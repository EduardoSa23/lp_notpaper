/**
 * Caminhos e URLs do blog.
 *
 * Sem barra final: o site roda com servidor, e `trailingSlash` era exigencia do
 * export estatico, que deixou de existir. Um helper que ainda a acrescentasse
 * faria o Next redirecionar cada link internamente.
 */

// Mesmo dominio de `metadataBase` em app/layout.jsx.
//
// Configuravel porque a ingestao devolve esta URL ao modulo, que a GRAVA como o
// endereco publicado. Num ambiente de teste, devolver o dominio de producao
// faria o modulo registrar um endereco que nao existe la.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://notpaper.com.br";

export const BLOG_BASE_PATH = "/blog";

export function blogIndexPath() {
  return BLOG_BASE_PATH;
}

/** Pagina 1 nao tem endereco proprio: e sempre /blog. */
export function blogPagePath(page) {
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber <= 1) return blogIndexPath();
  return `${BLOG_BASE_PATH}/pagina/${pageNumber}`;
}

export function blogPostPath(slug) {
  return `${BLOG_BASE_PATH}/${slug}`;
}

export function blogCategoryPath(categorySlug) {
  return `${BLOG_BASE_PATH}/categoria/${categorySlug}`;
}

/**
 * Pagina de uma categoria. Como no indice, a pagina 1 NAO tem endereco proprio:
 * ela e a URL da categoria. Duas URLs para a mesma listagem seriam conteudo
 * duplicado para busca.
 */
export function blogCategoryPagePath(categorySlug, page) {
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber <= 1) return blogCategoryPath(categorySlug);
  return `${blogCategoryPath(categorySlug)}/pagina/${pageNumber}`;
}

/**
 * Caminho da capa de um post.
 *
 * Sem extensao: o formato pode mudar de webp para png numa regeracao, e isso
 * nao deve mudar o endereco. O tipo de midia vem da coluna de formato.
 *
 * O `v` faz a capa regerada ter endereco novo - senao navegador e proxy
 * continuariam servindo a antiga, com cache longo. Ver design 6e.
 */
export function blogCoverPath(slug, version) {
  // A versao NUNCA e omitida: medido que o otimizador do `next/image` recusa
  // ("url parameter is invalid") um caminho local sem query, e o sintoma seria
  // imagem quebrada em silencio. Zero e a versao de quem nao tem versao.
  return `${BLOG_BASE_PATH}/capa/${slug}?v=${version || 0}`;
}

export function absoluteUrl(path) {
  return `${SITE_URL}${path}`;
}

export function blogIndexUrl() {
  return absoluteUrl(blogIndexPath());
}

export function blogPostUrl(slug) {
  return absoluteUrl(blogPostPath(slug));
}

export function blogCategoryUrl(categorySlug, page) {
  return absoluteUrl(blogCategoryPagePath(categorySlug, page));
}
