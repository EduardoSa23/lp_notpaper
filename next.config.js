/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // O driver do SQL Server carrega um binario (.node), que o bundler tentaria
  // parsear como JavaScript. Externalizar deixa o require chegar ao Node.
  serverExternalPackages: ["mssql", "msnodesqlv8"],
};

module.exports = nextConfig;
