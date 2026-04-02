const BASE_URL = "https://notpaper.com.br";

const routes = ["", "/comparar-solucoes", "/quem-somos", "/contato", "/solucoes"];

export function GET() {
  const now = new Date().toISOString();

  const urls = routes
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
