/**
 * Validacao do modelo do post.
 *
 * Uma definicao so, usada pela ingestao (que valida UM post vindo da rede) e
 * pela leitura (que valida o que sai do banco). Reproduzir estas regras num
 * segundo lugar e a receita conhecida para as duas pontas divergirem na
 * primeira mudanca de campo.
 *
 * Nao importa nada alem de `model.js`, que por sua vez nao importa nada - o
 * modelo e a validacao dele nao podem depender um do outro em ciclo.
 */
import { BLOCK_TYPES, POST_STATUSES, RESERVED_SLUGS } from "@/lib/blog/model";
import { assertRuns } from "@/lib/blog/rich-text";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const REQUIRED_FIELDS = [
  "slug",
  "title",
  "excerpt",
  "content",
  "coverImage",
  "author",
  "publishedAt",
  "readingMinutes",
  "category",
  "status",
];

export class BlogModelError extends Error {
  constructor(message) {
    super(`[blog] ${message}`);
    this.name = "BlogModelError";
  }
}

function fail(message) {
  throw new BlogModelError(message);
}

/**
 * Valida a forma de UM bloco de conteudo.
 *
 * O texto de paragrafo, subtitulo e citacao e uma lista de trechos; em `list`,
 * cada item e uma lista de trechos. Ver `lib/blog/rich-text.js`.
 *
 * Antes, aqui so se conferia o `type` - o que deixava um paragrafo sem texto
 * nenhum chegar ate a pagina.
 */
export function assertBlockShape(block, onde) {
  if (!block || !BLOCK_TYPES.includes(block.type)) {
    fail(`${onde} tem tipo invalido (${block?.type ?? "ausente"}).`);
  }

  switch (block.type) {
    case "paragraph":
    case "heading":
      assertRuns(block.text, fail, onde);
      break;

    case "quote":
      assertRuns(block.text, fail, onde);
      if (block.cite !== undefined && typeof block.cite !== "string") {
        fail(`${onde}: "cite" deve ser texto quando presente.`);
      }
      break;

    case "list":
      if (!Array.isArray(block.items) || block.items.length === 0) {
        fail(`${onde}: "items" deve ser uma lista nao vazia.`);
      }
      block.items.forEach((item, i) => assertRuns(item, fail, `${onde}, item ${i}`));
      if (block.ordered !== undefined && typeof block.ordered !== "boolean") {
        fail(`${onde}: "ordered" deve ser booleano quando presente.`);
      }
      break;

    case "image":
      if (!block.src || !block.alt) {
        fail(`${onde}: imagem precisa de "src" e "alt".`);
      }
      break;

    default:
      fail(`${onde}: tipo "${block.type}" sem validacao definida.`);
  }

  return block;
}

/**
 * Valida UM post. Lanca no primeiro problema, citando o post afetado.
 *
 * Nao valida unicidade: unicidade e propriedade do conjunto, e um post sozinho
 * nao tem como saber dos outros. Ver `assertPostsIntegrity`.
 */
export function assertPostShape(post, { position } = {}) {
  const identifier = post?.slug
    ? `slug "${post.slug}"`
    : `post na posicao ${position ?? "?"}`;

  for (const field of REQUIRED_FIELDS) {
    const value = post?.[field];
    const isEmpty = value === undefined || value === null || value === "";
    if (isEmpty) fail(`${identifier}: campo obrigatorio "${field}" ausente.`);
  }

  if (!SLUG_PATTERN.test(post.slug)) {
    fail(`slug "${post.slug}": use apenas minusculas, numeros e hifen, sem acento nem espaco.`);
  }

  if (RESERVED_SLUGS.includes(post.slug)) {
    fail(`slug "${post.slug}": reservado pela rota de paginacao do blog.`);
  }

  if (!POST_STATUSES.includes(post.status)) {
    fail(`slug "${post.slug}": status "${post.status}" invalido (use ${POST_STATUSES.join(" ou ")}).`);
  }

  if (!Array.isArray(post.content) || post.content.length === 0) {
    fail(`slug "${post.slug}": "content" deve ser uma lista de blocos nao vazia.`);
  }

  post.content.forEach((block, index) => {
    assertBlockShape(block, `slug "${post.slug}": bloco na posicao ${index}`);
  });

  if (!post.coverImage?.src || !post.coverImage?.alt) {
    fail(`slug "${post.slug}": "coverImage" precisa de "src" e "alt".`);
  }

  if (!post.author?.name || !post.author?.role) {
    fail(`slug "${post.slug}": "author" precisa de "name" e "role".`);
  }

  if (Number.isNaN(Date.parse(post.publishedAt))) {
    fail(`slug "${post.slug}": "publishedAt" deve ser uma data ISO 8601 valida.`);
  }

  if (!Number.isInteger(post.readingMinutes) || post.readingMinutes < 1) {
    fail(`slug "${post.slug}": "readingMinutes" deve ser um inteiro maior ou igual a 1.`);
  }

  if (post.tags !== undefined && !Array.isArray(post.tags)) {
    fail(`slug "${post.slug}": "tags" deve ser uma lista quando presente.`);
  }

  // O modelo exige booleano, e agora o valor vem da entrega em vez de ser
  // fixado aqui. Sem esta checagem, um `"false"` de texto passaria e o post
  // viraria destaque - `Boolean("false")` e verdadeiro.
  if (typeof post.featured !== "boolean") {
    fail(`slug "${post.slug}": "featured" deve ser booleano (recebido ${typeof post.featured}).`);
  }

  return post;
}

/**
 * Valida uma lista de posts: a forma de cada um, mais a unicidade do slug -
 * que so existe no conjunto.
 */
export function assertPostsIntegrity(posts) {
  if (!Array.isArray(posts)) fail("a fonte de conteudo deve entregar uma lista de posts.");

  const seen = new Set();

  posts.forEach((post, position) => {
    assertPostShape(post, { position });

    if (seen.has(post.slug)) fail(`slug "${post.slug}": duplicado na fonte de conteudo.`);
    seen.add(post.slug);
  });

  return posts;
}

/** True quando o post satisfaz o modelo, sem lancar. */
export function isValidPost(post) {
  try {
    assertPostShape(post);
    return true;
  } catch (error) {
    if (error instanceof BlogModelError) return false;
    throw error;
  }
}
