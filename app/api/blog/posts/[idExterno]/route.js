import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

import { TAG_BLOG, tagForPost } from "@/lib/blog/cache-tags";
import { BlogModelError, IngestContentError, ingestPost } from "@/lib/blog/ingest";
import { blogPostUrl } from "@/lib/blog/urls";

/**
 * Ingestao de post do modulo de marketing autonomo.
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

export async function PUT(request, { params }) {
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

  const { idExterno } = await params;

  if (!GUID.test(idExterno ?? "")) {
    return json({ erro: "Identificador da publicacao invalido" }, 422);
  }

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
