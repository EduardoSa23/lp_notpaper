// Gerado uma unica vez no build para funcionar tambem no export estatico.
export const dynamic = "force-static";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://notpaper.com.br/sitemap.xml",
  };
}
