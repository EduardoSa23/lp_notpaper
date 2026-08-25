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
  const base = `${BLOG_BASE_PATH}/capa/${slug}`;
  return version ? `${base}?v=${version}` : base;
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
