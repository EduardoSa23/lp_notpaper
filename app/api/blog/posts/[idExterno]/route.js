import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

import { TAG_BLOG, tagForPost } from "@/lib/blog/cache-tags";
import { BlogModelError, IngestContentError, ingestPost } from "@/lib/blog/ingest";
import { unpublishPost } from "@/lib/blog/unpublish";
import { blogPostUrl } from "@/lib/blog/urls";

/**
 * Ingestao e despublicacao de post do modulo de marketing autonomo.
 *
 * Contrato definido pelo lado que chama (`PublicadorDeBlogNoSite.cs`):
 *   PUT /api/blog/posts/{Publicacao.Id}
 *   X-Ingestao-Token: <token>
 *   { titulo, resumo, corpo: [...], categoria, minutosDeLeitura, capa: {...} }
 *   -> { url }
 *
 * ── OS CODIGOS DE RESPOSTA SAO PARTE DO CONTRATO ────────────────────────────
 *
 * O modulo interpreta o status e decide se retenta:
 *   2xx com url    -> publicado, grava a URL
 *   2xx SEM url    -> ele trata como indisponibilidade e RETENTA
 *   401 / 403      -> credencial recusada, nao retenta
 *   400/409/422/413 -> conteudo recusado, nao retenta (exige editar o texto)
 *   qualquer outro -> indisponibilidade, RETENTA ate o teto
 *
 * Errar isso e o defeito mais caro possivel aqui: validar mal e responder 5xx
 * faria a fila retentar um post que nunca vai passar; falhar o banco e
 * responder 4xx faria o modulo desistir de uma falha passageira.
 *
 * ── A RETIRADA DO AR TEM DE PASSAR POR AQUI ─────────────────────────────────
 *
 *   DELETE /api/blog/posts/{Publicacao.Id}
 *   X-Ingestao-Token: <token>
 *   -> { slug, situacao: "rascunho" }
 *
 * O blog NAO consulta o banco a cada visita: `content-source.js` embrulha as
 * leituras em `unstable_cache` com a tag `blog`, e as entradas nao expiram. Uma
 * escrita direta no banco - um DELETE no SSMS, um UPDATE de `status` a mao - e
 * invisivel para o cache, e o post continua no ar por tempo indeterminado, sem
 * erro nenhum denunciando. Foi assim que dois posts apagados do banco em
 * 15/09/2026 continuaram aparecendo.
 *
 * Esta rota e o caminho que fecha esse buraco: despublica e revalida na mesma
 * operacao. Quem tira post do ar por fora dela volta a ter o problema.
 *
 * Codigos, na mesma leitura de retentativa do PUT:
 *   200 -> em rascunho. IDEMPOTENTE: repetir devolve 200 de novo.
 *   404 -> nenhum post com esse `id_externo`. Nao ha o que retentar.
 *   422 -> identificador malformado.
 *   503 -> banco indisponivel. RETENTA.
 */

const GUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function json(body, status, extraHeaders = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

/**
 * Comparacao em tempo constante: `===` em string vaza o tamanho do prefixo
 * correto pelo tempo de resposta.
 */
function tokenConfere(recebido, esperado) {
  if (typeof recebido !== "string" || recebido.length === 0) return false;

  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);

  // `timingSafeEqual` exige mesmo tamanho; comparar tamanhos antes vazaria o
  // tamanho do token, que nao e segredo util.
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * Porta de entrada comum aos dois verbos: token e formato do identificador.
 *
 * Devolve uma Response quando a requisicao para aqui, e `null` quando pode
 * seguir. Os dois verbos MESMO tem de recusar igual - uma sondagem que
 * distinguisse os caminhos pelo codigo de resposta saberia por qual insistir.
 */
function barrar(request, idExterno) {
  const esperado = process.env.BLOG_INGESTAO_TOKEN;

  if (!esperado) {
    // Configuracao ausente e problema NOSSO, nao credencial errada dele.
    console.error("[blog] BLOG_INGESTAO_TOKEN nao configurado - ingestao indisponivel");
    return json({ erro: "Ingestao nao configurada" }, 503);
  }

  // Resposta identica para token ausente e token incorreto.
  if (!tokenConfere(request.headers.get("x-ingestao-token"), esperado)) {
    return json({ erro: "Nao autorizado" }, 401);
  }

  if (!GUID.test(idExterno ?? "")) {
    return json({ erro: "Identificador da publicacao invalido" }, 422);
  }

  return null;
}

export async function PUT(request, { params }) {
  const { idExterno } = await params;

  const barrado = barrar(request, idExterno);
  if (barrado) return barrado;

  // Corpo ilegivel, vazio ou truncado e TRANSPORTE, nao conteudo ruim.
  //
  // A razao e a assimetria do prejuizo: o modulo nao repete o que foi recusado
  // por conteudo. Ele barra post sem titulo antes de enviar (`OQueFalta`), e o
  // titulo nunca pode estar vazio do lado dele - entao um corpo mutilado aqui e,
  // por construcao, problema de rede. Diagnosticar como conteudo ruim faria o
  // post ser abandonado com o texto intacto, e ninguem saberia.
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("[blog] corpo da ingestao ilegivel:", error.message);
    return json({ erro: "Corpo da requisicao nao pode ser lido" }, 503);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ erro: "Corpo da requisicao nao pode ser lido" }, 503);
  }

  try {
    const { slug, action } = await ingestPost(idExterno, payload);

    // Revalida ANTES de responder: o modulo considera o post publicado no
    // instante em que recebe a URL e a grava. Devolver antes faria o endereco
    // registrado apontar, por um instante, para uma pagina sem o post.
    revalidateTag(TAG_BLOG);
    revalidateTag(tagForPost(slug));

    return json({ url: blogPostUrl(slug), slug, acao: action === "INSERT" ? "criado" : "atualizado" }, 200);
  } catch (error) {
    if (error instanceof IngestContentError || error instanceof BlogModelError) {
      // Conteudo recusado: repetir daria a mesma resposta.
      return json({ erro: error.message }, 422);
    }

    // Infraestrutura: o modulo deve retentar.
    console.error("[blog] falha na ingestao:", error.message);
    return json({ erro: "Ingestao indisponivel" }, 503);
  }
}

/**
 * Tira o post do ar: marca como rascunho e revalida.
 *
 * Nao apaga a linha - ver `lib/blog/unpublish.js` para o motivo. Para o
 * visitante a diferenca nao existe: as paginas e a capa passam a responder 404.
 */
export async function DELETE(request, { params }) {
  const { idExterno } = await params;

  const barrado = barrar(request, idExterno);
  if (barrado) return barrado;

  let resultado;

  try {
    resultado = await unpublishPost(idExterno);
  } catch (error) {
    // Infraestrutura: quem chama deve retentar.
    console.error("[blog] falha ao despublicar:", error.message);
    return json({ erro: "Despublicacao indisponivel" }, 503);
  }

  if (!resultado) {
    return json({ erro: "Nenhum post com esse identificador" }, 404);
  }

  // Revalida ANTES de responder, pela mesma razao do PUT invertida: quem
  // recebeu o 200 vai conferir que o post saiu. Revalidar depois deixaria uma
  // janela em que a resposta ja disse "fora do ar" e o cache ainda serve a
  // pagina - e a confianca nessa resposta e o que faz esta rota valer a pena.
  //
  // As duas tags, mesmo quando a linha JA estava em rascunho: e justamente o
  // caso de quem mexeu no banco a mao e veio aqui consertar o cache.
  revalidateTag(TAG_BLOG);
  revalidateTag(tagForPost(resultado.slug));

  return json({ slug: resultado.slug, situacao: "rascunho", jaEraRascunho: resultado.jaEraRascunho }, 200);
}
