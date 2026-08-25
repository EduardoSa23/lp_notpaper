import { mediaTypeFor } from "@/lib/blog/covers";
import { selectCover } from "@/lib/blog/queries";

/**
 * Serve a capa de um post a partir do banco.
 *
 * `capa` e segmento estatico sob /blog, entao ganha de /blog/[slug] na
 * precedencia do Next - e por isso `capa` e slug reservado em `model.js`.
 *
 * O endereco carrega `?v=<atualizacao do post>`, o que torna cada versao da
 * capa um endereco novo: da para cachear por um ano sem risco de servir a
 * imagem anterior depois de uma regeracao.
 */
export async function GET(request, { params }) {
  const { slug } = await params;

  // Route handler nao tem fronteira de erro: o tratamento e aqui. Falha de
  // infraestrutura responde 503 e nao 500 - o codigo diz "tente depois", e
  // intermediarios nao guardam a resposta.
  let cover;

  try {
    cover = await selectCover(slug);
  } catch (error) {
    console.error("[blog] falha ao buscar a capa:", error.message);

    return new Response("Capa indisponivel", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  // Post inexistente ou em rascunho: nao distingue os dois casos.
  if (!cover) {
    return new Response("Capa nao encontrada", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Tipo de midia da lista do site. Um formato invalido no banco e defeito
  // nosso, e servir bytes sem saber o tipo e pior do que falhar.
  const mediaType = mediaTypeFor(cover.format);

  if (!mediaType) {
    return new Response("Formato de capa nao reconhecido", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(cover.bytes, {
    headers: {
      "Content-Type": mediaType,
      // Impede o navegador de inferir o tipo por conta - a defesa que faz o
      // ponto acima valer alguma coisa.
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(cover.bytes.length),
    },
  });
}
