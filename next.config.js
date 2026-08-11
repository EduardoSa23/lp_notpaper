/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  // O export estatico nao tem servidor: as imagens precisam ser servidas como estao
  // e as rotas viram pastas com index.html para funcionar em qualquer host.
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

module.exports = nextConfig;
