import { unstable_cache } from "next/cache";

import { TAG_BLOG, tagForPost } from "@/lib/blog/cache-tags";
import { RELATED_POSTS_COUNT } from "@/lib/blog/model";
import {
  selectBySlug,
  selectFeatured,
  selectPage,
  selectPageCount,
  selectPublishedSlugs,
  selectRelated,
} from "@/lib/blog/queries";

/**
 * Contrato de leitura do conteudo do blog.
 *
 * UNICO ponto de acesso ao conteudo: as paginas importam daqui e de nenhum
 * outro lugar. As seis funcoes e suas assinaturas sao as mesmas de quando a
 * fonte era mock - foi isso que permitiu trocar sem tocar em tela.
 *
 * A leitura NAO passa por HTTP ao proprio site: estas funcoes rodam no servidor
 * e falam com o banco direto. Uma pagina que buscasse do proprio app falharia
 * no build, quando servidor nenhum esta de pe.
 *
 * ── O CACHE VIVE AQUI, E NAO NAS PAGINAS ────────────────────────────────────
 *
 * Cada leitura e envolvida por `unstable_cache` com as tags de
 * `lib/blog/cache-tags.js`. A ingestao revalida essas tags depois de gravar, e
 * e assim que um post novo aparece sem novo deploy.
 *
 * Duas visitas seguidas a mesma pagina nao consultam o banco duas vezes: a
 * segunda e servida do cache de dados.
 */

const cachedFeatured = unstable_cache(async () => selectFeatured(), ["blog", "featured"], {
  tags: [TAG_BLOG],
});

const cachedPageCount = unstable_cache(async () => selectPageCount(), ["blog", "pageCount"], {
  tags: [TAG_BLOG],
});

// O argumento entra na chave do cache, entao cada pagina tem sua propria entrada.
const cachedPage = unstable_cache(async (page) => selectPage(page), ["blog", "page"], {
  tags: [TAG_BLOG],
});

const cachedSlugs = unstable_cache(async () => selectPublishedSlugs(), ["blog", "slugs"], {
  tags: [TAG_BLOG],
});

const cachedRelated = unstable_cache(
  async (slug, limit) => selectRelated(slug, limit),
  ["blog", "related"],
  { tags: [TAG_BLOG] }
);

/** Post do topo do indice: o marcado como destaque ou, na falta, o mais recente. */
export async function getFeaturedPost() {
  return cachedFeatured();
}

export async function getPageCount() {
  return cachedPageCount();
}

/** Pagina 1 = /blog. Numero fora do intervalo devolve lista vazia. */
export async function getPostsPage(page) {
  return cachedPage(page);
}

/**
 * Devolve null quando o slug nao existe ou o post esta em rascunho.
 *
 * O envolvimento acontece por chamada porque a tag do post depende do slug, e
 * `unstable_cache` fixa as tags na criacao. A entrada de cache continua sendo
 * compartilhada: quem decide e a chave, nao a instancia da funcao.
 */
export async function getPostBySlug(slug) {
  const cached = unstable_cache(async () => selectBySlug(slug), ["blog", "post", String(slug)], {
    tags: [TAG_BLOG, tagForPost(slug)],
  });

  return cached();
}

/** Prioriza a mesma categoria e completa com os mais recentes. Nunca inclui o proprio post. */
export async function getRelatedPosts(slug, limit = RELATED_POSTS_COUNT) {
  return cachedRelated(slug, limit);
}

export async function getAllPublishedSlugs() {
  return cachedSlugs();
}
