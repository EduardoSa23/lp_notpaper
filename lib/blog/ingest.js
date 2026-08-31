import { verifyCover } from "@/lib/blog/covers";
import { getPool, types } from "@/lib/blog/db";
import { IngestContentError, translateBody, translateCategory } from "@/lib/blog/ingest-mapping";
import { INSTITUTIONAL_AUTHOR } from "@/lib/blog/model";
import { resolveSlug } from "@/lib/blog/slug";
import { assertPostShape, BlogModelError } from "@/lib/blog/validate";
import { blogCoverPath } from "@/lib/blog/urls";
import { sql } from "@/lib/blog/db";

/**
 * Ingestao de um post entregue pelo modulo de marketing.
 *
 * O que a entrega traz e CONTEUDO: titulo, resumo, corpo em blocos, categoria,
 * minutos de leitura, capa e a indicacao de destaque. O que este lado preenche
 * e IDENTIDADE: slug, autor, situacao e data de publicacao.
 *
 * ── POR QUE O DESTAQUE NAO E IDENTIDADE ─────────────────────────────────────
 *
 * Ele estava nesta lista e saiu. Os quatro que ficaram tem cada um o seu
 * motivo: slug e data so este lado pode gerar, porque so ele conhece o proprio
 * acervo; a situacao e dele porque e ele que serve a pagina; e o autor e a voz
 * institucional, que o modulo nao tem como saber - ele conhece so quem aprovou.
 *
 * O destaque e diferente dos quatro: e julgamento editorial SOBRE O CONTEUDO, e
 * quem sabe se um post merece destaque e quem acabou de le-lo, com o texto na
 * tela e o botao de aprovar na mao. Antes disso, trocar o destaque exigia abrir
 * o banco.
 *
 * Nada e corrigido nem completado - a unica excecao seria a capa, e ela deixou
 * de ser excecao quando o modulo passou a manda-la sempre.
 */

const MAX_TITLE = 300;
const MAX_EXCERPT = 1000;
const MAX_COVER_BYTES = 8 * 1024 * 1024;

function refuse(message) {
  throw new IngestContentError(message);
}

function requireString(value, campo, max) {
  if (typeof value !== "string" || value.trim() === "") {
    refuse(`campo obrigatorio "${campo}" ausente ou vazio`);
  }

  if (value.length > max) {
    refuse(`"${campo}" excede ${max} caracteres (recebido ${value.length})`);
  }

  return value;
}

/** Decodifica e confere a capa. Os tres campos sao obrigatorios. */
function readCover(capa) {
  if (!capa || typeof capa !== "object") {
    refuse('campo obrigatorio "capa" ausente - o blog nao aceita post sem imagem');
  }

  const base64 = capa.base64;
  const formato = capa.formato;
  const alt = requireString(capa.textoAlternativo, "capa.textoAlternativo", 500);

  if (typeof base64 !== "string" || base64.trim() === "") {
    refuse('campo obrigatorio "capa.base64" ausente');
  }

  let bytes;

  try {
    bytes = Buffer.from(base64, "base64");
  } catch {
    refuse('"capa.base64" nao e base64 valido');
  }

  if (bytes.length === 0) refuse('"capa.base64" decodificou para zero bytes');
  if (bytes.length > MAX_COVER_BYTES) {
    refuse(`capa excede ${MAX_COVER_BYTES / 1024 / 1024} MB (recebido ${Math.round(bytes.length / 1024)} KB)`);
  }

  // Confere os bytes contra o formato declarado. O modulo tambem confere do
  // lado dele, mas confiar nisso seria confiar num campo de texto vindo da rede.
  const verificado = verifyCover(bytes, formato);

  if (!verificado.ok) refuse(`capa recusada: ${verificado.motivo}`);

  return { bytes, format: verificado.format, alt };
}

/**
 * Le a indicacao de destaque.
 *
 * OPCIONAL, e ausente vale nao destacado. E isso que permite este lado aceitar
 * o campo antes de o modulo passar a envia-lo: enquanto ele nao envia, toda
 * entrega continua sendo aceita exatamente como antes. `null` conta como
 * ausente - um booleano anulavel serializado do .NET chega assim.
 *
 * Tipo errado e RECUSA, nao coercao. `"false"` como texto e verdadeiro em
 * JavaScript: coagir transformaria a intencao de nao destacar em destaque, que
 * e o pior erro possivel neste campo.
 */
function readFeatured(value) {
  if (value === undefined || value === null) return false;

  if (typeof value !== "boolean") {
    refuse(`"destaque" deve ser verdadeiro ou falso (recebido ${JSON.stringify(value)})`);
  }

  return value;
}

/**
 * Monta o post no modelo do blog e valida com a mesma definicao que a leitura
 * usa. O slug entra depois, porque depende do banco.
 */
function buildPost(payload) {
  const title = requireString(payload?.titulo, "titulo", MAX_TITLE);
  const excerpt = requireString(payload?.resumo, "resumo", MAX_EXCERPT);
  const category = translateCategory(payload?.categoria);
  const content = translateBody(payload?.corpo);
  const cover = readCover(payload?.capa);

  const readingMinutes = payload?.minutosDeLeitura;

  // Usado como recebido: quem tem o texto integral e quem o envia.
  if (!Number.isInteger(readingMinutes) || readingMinutes < 1) {
    refuse('"minutosDeLeitura" deve ser um inteiro maior ou igual a 1');
  }

  const featured = readFeatured(payload?.destaque);

  return { title, excerpt, category, content, cover, readingMinutes, featured };
}

const CAMPOS_INSERT = `
  id_externo, slug, title, excerpt, content, author, cover_bytes, cover_format,
  cover_alt, published_at, reading_minutes, category, tags, featured, status`;

/**
 * Grava a entrega: cria ou substitui pelo identificador externo.
 *
 * `MERGE ... WITH (HOLDLOCK)` nao e enfeite. Sem o hint, duas entregas
 * simultaneas do mesmo `id_externo` podem ambas nao encontrar a linha e ambas
 * tentar inserir, e a segunda estoura violacao de chave unica. E defeito
 * conhecido do MERGE no SQL Server, e o requisito de concorrencia cai nele.
 *
 * Em MATCHED nao se toca em `slug`, `published_at` nem `created_at`: eles sao
 * identidade, e uma correcao de texto nao os muda.
 *
 * `featured` SAIU dessa lista. Ele deixou de ser identidade deste lado quando
 * passou a vir na entrega: uma reentrega que carrega destaque e a intencao de
 * quem revisou, e descarta-la faria o painel mostrar uma coisa e o blog outra,
 * sem nada denunciando.
 */
async function persist(pool, idExterno, post) {
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    // Slug resolvido DENTRO da transacao: `isTaken` le com HOLDLOCK para que
    // duas entregas de titulos iguais nao escolham o mesmo slug.
    const existente = await new sql.Request(transaction)
      .input("id", types.uuid, idExterno)
      .query("SELECT slug FROM dbo.posts WITH (HOLDLOCK) WHERE id_externo = @id");

    const slug =
      existente.recordset[0]?.slug ??
      (await resolveSlug(post.title, idExterno, async (candidato) => {
        const r = await new sql.Request(transaction)
          .input("slug", types.text, candidato)
          .query("SELECT 1 AS achou FROM dbo.posts WITH (HOLDLOCK) WHERE slug = @slug");

        return r.recordset.length > 0;
      }));

    // Valida o post completo com a mesma definicao que a leitura usa.
    assertPostShape({
      slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: { src: blogCoverPath(slug), alt: post.cover.alt },
      author: INSTITUTIONAL_AUTHOR,
      publishedAt: new Date().toISOString(),
      readingMinutes: post.readingMinutes,
      category: post.category,
      tags: [],
      featured: post.featured,
      status: "published",
    });

    const resultado = await new sql.Request(transaction)
      .input("id_externo", types.uuid, idExterno)
      .input("slug", types.text, slug)
      .input("title", types.text, post.title)
      .input("excerpt", types.text, post.excerpt)
      .input("content", types.text, JSON.stringify(post.content))
      .input("author", types.text, JSON.stringify(INSTITUTIONAL_AUTHOR))
      .input("cover_bytes", types.bytes, post.cover.bytes)
      .input("cover_format", types.ascii, post.cover.format)
      .input("cover_alt", types.text, post.cover.alt)
      .input("reading_minutes", types.int, post.readingMinutes)
      .input("category", types.text, post.category)
      .input("featured", types.bool, post.featured).query(`
        MERGE dbo.posts WITH (HOLDLOCK) AS destino
        USING (SELECT @id_externo AS id_externo) AS origem
            ON destino.id_externo = origem.id_externo
        WHEN MATCHED THEN UPDATE SET
            title = @title,
            excerpt = @excerpt,
            content = @content,
            author = @author,
            cover_bytes = @cover_bytes,
            cover_format = @cover_format,
            cover_alt = @cover_alt,
            reading_minutes = @reading_minutes,
            category = @category,
            featured = @featured,
            status = 'published',
            updated_at = SYSDATETIMEOFFSET()
        WHEN NOT MATCHED THEN INSERT (${CAMPOS_INSERT})
            VALUES (@id_externo, @slug, @title, @excerpt, @content, @author,
                    @cover_bytes, @cover_format, @cover_alt, SYSDATETIMEOFFSET(),
                    @reading_minutes, @category, N'[]', @featured, 'published')
        OUTPUT $action AS acao, inserted.slug AS slug;`);

    // ── EXCLUSIVIDADE DO DESTAQUE ──────────────────────────────────────────
    //
    // `vw_post_destaque` ordena por `featured DESC, published_at DESC`, entao
    // com DOIS marcados vence o mais recente. Medido no acervo real: marcar um
    // post ANTIGO como destaque gravaria a marcacao e nao mudaria nada na
    // pagina - o revisor veria o painel confirmar uma escolha que o blog
    // ignora, que e exatamente a divergencia silenciosa que este campo veio
    // resolver.
    //
    // Desmarcar os outros aqui faz "marcar destaque" significar o que o revisor
    // espera, e mantem a promessa feita ao outro lado: ele nao gere
    // exclusividade, porque este lado garante. A view segue intocada.
    //
    // Na mesma transacao do MERGE: fora dela existiria um instante com dois
    // marcados, e uma leitura nesse instante veria o destaque errado.
    if (post.featured) {
      await new sql.Request(transaction)
        .input("id_externo", types.uuid, idExterno)
        // `updated_at` avanca tambem no despromovido: a linha mudou, e o
        // requisito de registro de mudanca existe para diagnosticar isso sem
        // log. Custo aceito: a versao da capa dele muda, e a capa e rebuscada
        // uma vez - uma imagem, na troca de destaque.
        .query(`
          UPDATE dbo.posts
             SET featured = 0, updated_at = SYSDATETIMEOFFSET()
           WHERE featured = 1 AND id_externo <> @id_externo`);
    }

    await transaction.commit();

    const linha = resultado.recordset[0];
    return { slug: linha.slug, action: linha.acao };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Ingere um post. Lanca `IngestContentError` ou `BlogModelError` para problema
 * de conteudo; qualquer outro erro e infraestrutura.
 */
export async function ingestPost(idExterno, payload) {
  const post = buildPost(payload);
  const pool = await getPool();

  return persist(pool, idExterno, post);
}

export { IngestContentError, BlogModelError };
