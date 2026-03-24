export default function sitemap() {
  const routes = ["", "/comparacao", "/quem-somos", "/contato", "/servicos", "/solucoes"];

  return routes.map((route) => ({
    url: `https://notpaper.com.br${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

