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
 * minutos de leitura e capa. O que este lado preenche e IDENTIDADE: slug,
 * autor, destaque, situacao e data de publicacao.
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

  return { title, excerpt, category, content, cover, readingMinutes };
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
 * Em MATCHED nao se toca em `slug`, `published_at`, `created_at` nem
 * `featured`: eles sao identidade, e uma correcao de texto nao os muda.
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
      featured: false,
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
      .input("category", types.text, post.category).query(`
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
            status = 'published',
            updated_at = SYSDATETIMEOFFSET()
        WHEN NOT MATCHED THEN INSERT (${CAMPOS_INSERT})
            VALUES (@id_externo, @slug, @title, @excerpt, @content, @author,
                    @cover_bytes, @cover_format, @cover_alt, SYSDATETIMEOFFSET(),
                    @reading_minutes, @category, N'[]', 0, 'published')
        OUTPUT $action AS acao, inserted.slug AS slug;`);

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
