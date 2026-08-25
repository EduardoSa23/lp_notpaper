/**
 * Tags de cache do blog, em um lugar so.
 *
 * A ingestao revalida por estas tags depois de gravar. Ter os nomes espalhados
 * seria a forma mais facil de revalidar uma tag que ninguem usa - e o sintoma
 * seria conteudo velho no ar, sem erro nenhum.
 */

/** Tudo o que depende da lista de posts: indice, paginacao, relacionados, sitemap. */
export const TAG_BLOG = "blog";

/** A pagina de um post especifico. */
export function tagForPost(slug) {
  return `post:${slug}`;
}
