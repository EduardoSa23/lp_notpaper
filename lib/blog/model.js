/**
 * Modelo do post do blog: tipos de bloco e constantes de listagem.
 *
 * Este arquivo NAO importa nada, de proposito: e a definicao do modelo, e
 * `lib/blog/validate.js` depende dele. Trazer a validacao de volta para ca
 * criaria ciclo entre os dois.
 */

// Tipos de bloco aceitos no corpo do post. Bloco de tipo fora dessa lista e
// ignorado na renderizacao - conteudo gerado automaticamente nao derruba a pagina.
export const BLOCK_TYPES = ["paragraph", "heading", "list", "quote", "image"];

export const POSTS_PER_PAGE = 6;

export const RELATED_POSTS_COUNT = 3;

export const POST_STATUSES = ["published", "draft"];

// Segmentos estaticos sob /blog: eles ganham de /blog/[slug] na precedencia do
// Next, entao um post com um desses slugs sequestraria a rota.
//   pagina    -> /blog/pagina/[page]
//   capa      -> /blog/capa/[slug]
//   categoria -> /blog/categoria/[categoria]
export const RESERVED_SLUGS = ["pagina", "capa", "categoria"];

// Formatos de imagem que o site reconhece e sabe servir. O tipo de midia
// servido sai DESTA lista, nunca do texto recebido na entrega.
export const COVER_FORMATS = {
  webp: "image/webp",
  png: "image/png",
  jpeg: "image/jpeg",
};

// As cinco categorias do blog, com os nomes exatos que o modulo de marketing
// envia (`CategoriasDoBlog.Nome` do lado dele). Categoria fora desta lista e
// recusada na ingestao - aceitar uma sexta criaria uma secao que o blog nao
// sabe apresentar.
export const BLOG_CATEGORIES = [
  "Gestão Pública",
  "GED",
  "Automação",
  "Segurança e Compliance",
  "Transformação Digital",
];

// A voz do blog e institucional. O modulo conhece quem aprovou o conteudo, mas
// mandar isso publicaria identidade interna numa pagina publica - por isso o
// autor e preenchido por este lado, sempre igual.
export const INSTITUTIONAL_AUTHOR = {
  name: "Equipe notPaper",
  role: "Conteúdo e Produto",
};

export function isValidBlock(block) {
  return Boolean(block) && BLOCK_TYPES.includes(block.type);
}
