import { getAllPublishedSlugs, getPageCount } from "@/lib/blog/content-source";
import { BLOG_BASE_PATH } from "@/lib/blog/urls";

const BASE_URL = "https://notpaper.com.br";

const routes = ["", "/comparar-solucoes", "/quem-somos", "/contato", "/solucoes"];

// Sem `force-static`: o sitemap depende do banco e precisa ser revalidavel.
// Ele e cacheado como qualquer rota sem API dinamica, e a ingestao o invalida
// pela tag `blog`, que as consultas de `content-source` carregam.

// Indice do blog, paginas de listagem e um endereco por post publicado.
// Rascunho nao entra: a fonte de conteudo so expoe o que esta publicado.
async function blogRoutes() {
  const [pageCount, slugs] = await Promise.all([getPageCount(), getAllPublishedSlugs()]);

  const listingPages = Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => `${BLOG_BASE_PATH}/pagina/${index + 2}`);

  return [BLOG_BASE_PATH, ...listingPages, ...slugs.map((slug) => `${BLOG_BASE_PATH}/${slug}`)];
}

export async function GET() {
  const now = new Date().toISOString();
  const allRoutes = [...routes, ...(await blogRoutes())];

  const urls = allRoutes
    .map((route) => {
      const priority = route === "" ? "1.0" : "0.8";
      return [
        "<url>",
        `<loc>${BASE_URL}${route}</loc>`,
        `<lastmod>${now}</lastmod>`,
        "<changefreq>weekly</changefreq>",
        `<priority>${priority}</priority>`,
        "</url>",
      ].join("");
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
