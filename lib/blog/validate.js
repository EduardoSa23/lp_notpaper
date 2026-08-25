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

  for (const [index, block] of post.content.entries()) {
    if (!block || !BLOCK_TYPES.includes(block.type)) {
      fail(`slug "${post.slug}": bloco na posicao ${index} tem tipo invalido (${block?.type ?? "ausente"}).`);
    }
  }

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
