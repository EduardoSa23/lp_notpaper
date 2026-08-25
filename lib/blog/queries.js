import { assertPostShape } from "@/lib/blog/validate";
import { query, types } from "@/lib/blog/db";
import { POSTS_PER_PAGE, RELATED_POSTS_COUNT } from "@/lib/blog/model";
import { blogCoverPath } from "@/lib/blog/urls";

/**
 * As consultas que atendem o contrato de `blog/fonte-de-conteudo`.
 *
 * As regras de exposicao e ordenacao vivem no SQL, e nao em filtragem depois:
 * o custo nao pode crescer com o volume de posts. Rascunho nunca sai daqui.
 */

// Colunas do post, sem os bytes da capa - eles pesam e sao servidos por rota
// propria. Uma listagem que os trouxesse carregaria megabytes para desenhar
// seis cards.
const CAMPOS = `
  p.id_externo, p.slug, p.title, p.excerpt, p.content, p.author,
  p.cover_format, p.cover_alt, p.published_at, p.reading_minutes,
  p.category, p.tags, p.featured, p.status, p.updated_at`;

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Linha do banco -> post no modelo do blog.
 *
 * Valida na fronteira: `json` nao garante forma, e uma escrita manual no banco
 * poderia colocar um `content` malformado que so apareceria como pagina torta.
 */
function toPost(row) {
  const post = {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: parseJson(row.content, []),
    coverImage: {
      src: blogCoverPath(row.slug, Date.parse(row.updated_at)),
      alt: row.cover_alt,
    },
    author: parseJson(row.author, null),
    publishedAt: new Date(row.published_at).toISOString(),
    readingMinutes: row.reading_minutes,
    category: row.category,
    tags: parseJson(row.tags, []),
    featured: Boolean(row.featured),
    status: row.status,
  };

  assertPostShape(post);
  return post;
}

/** Post em destaque: o que a view `vw_post_destaque` resolve. Null sem publicados. */
export async function selectFeatured() {
  const rows = await query(`
    SELECT ${CAMPOS}
    FROM dbo.posts p
    JOIN dbo.vw_post_destaque d ON d.id = p.id`);

  return rows.length > 0 ? toPost(rows[0]) : null;
}

/**
 * Uma pagina da listagem. Exclui o destaque EFETIVO - que pode ser o mais
 * recente quando nenhum esta marcado, e nao `featured = 0`.
 */
export async function selectPage(page) {
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return [];

  const rows = await query(
    `SELECT ${CAMPOS}
     FROM dbo.posts p
     WHERE p.status = 'published'
       AND NOT EXISTS (SELECT 1 FROM dbo.vw_post_destaque d WHERE d.id = p.id)
     ORDER BY p.published_at DESC, p.slug
     OFFSET @pular ROWS FETCH NEXT @tamanho ROWS ONLY`,
    {
      pular: { type: types.int, value: (pageNumber - 1) * POSTS_PER_PAGE },
      tamanho: { type: types.int, value: POSTS_PER_PAGE },
    }
  );

  return rows.map(toPost);
}

/** Quantas paginas de listagem existem. Minimo 1, para o indice sempre renderizar. */
export async function selectPageCount() {
  const rows = await query(`
    SELECT COUNT(*) AS total
    FROM dbo.posts p
    WHERE p.status = 'published'
      AND NOT EXISTS (SELECT 1 FROM dbo.vw_post_destaque d WHERE d.id = p.id)`);

  const total = rows[0]?.total ?? 0;
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

/** Post por slug. Null quando nao existe OU esta em rascunho - sem distinguir os dois. */
export async function selectBySlug(slug) {
  if (!slug) return null;

  const rows = await query(
    `SELECT ${CAMPOS}
     FROM dbo.posts p
     WHERE p.slug = @slug AND p.status = 'published'`,
    { slug: { type: types.text, value: slug } }
  );

  return rows.length > 0 ? toPost(rows[0]) : null;
}

/**
 * Relacionados: mesma categoria primeiro, completando com os mais recentes.
 * Nunca inclui o proprio post.
 */
export async function selectRelated(slug, limit = RELATED_POSTS_COUNT) {
  if (!slug) return [];

  const rows = await query(
    `WITH atual AS (
        SELECT category FROM dbo.posts WHERE slug = @slug AND status = 'published'
     )
     SELECT TOP (@limite) ${CAMPOS}
     FROM dbo.posts p
     CROSS JOIN atual a
     WHERE p.status = 'published' AND p.slug <> @slug
     ORDER BY CASE WHEN p.category = a.category THEN 0 ELSE 1 END,
              p.published_at DESC,
              p.slug`,
    {
      slug: { type: types.text, value: slug },
      limite: { type: types.int, value: limit },
    }
  );

  return rows.map(toPost);
}

/** Todos os slugs publicados, para gerar rotas e sitemap. */
export async function selectPublishedSlugs() {
  const rows = await query(`
    SELECT slug FROM dbo.posts
    WHERE status = 'published'
    ORDER BY published_at DESC, slug`);

  return rows.map((row) => row.slug);
}

/** Bytes da capa, para a rota que a serve. Null quando o post nao esta publicado. */
export async function selectCover(slug) {
  if (!slug) return null;

  const rows = await query(
    `SELECT cover_bytes, cover_format, cover_alt
     FROM dbo.posts
     WHERE slug = @slug AND status = 'published'`,
    { slug: { type: types.text, value: slug } }
  );

  if (rows.length === 0) return null;

  return {
    bytes: rows[0].cover_bytes,
    format: rows[0].cover_format,
    alt: rows[0].cover_alt,
  };
}
