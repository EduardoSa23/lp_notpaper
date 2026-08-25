/**
 * Fonte de conteudo mock: le data/blog-posts.js.
 *
 * Trocar por API significa trocar quem `content-source.js` chama - nada aqui
 * e importado direto pelas paginas.
 */
import { blogPosts } from "@/data/blog-posts";
import { assertPostsIntegrity } from "@/lib/blog/validate";

// Roda no carregamento do modulo: slug duplicado ou campo faltando derruba o
// build em vez de virar rota ambigua em producao.
assertPostsIntegrity(blogPosts);

// Desempate por slug para a paginacao nao mudar entre builds quando dois posts
// tem a mesma data.
function byRecency(a, b) {
  const diff = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  if (diff !== 0) return diff;
  return a.slug.localeCompare(b.slug);
}

export function listPublished() {
  return blogPosts.filter((post) => post.status === "published").sort(byRecency);
}

export function findPublishedBySlug(slug) {
  return listPublished().find((post) => post.slug === slug) ?? null;
}
