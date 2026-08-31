import { slugifyHeading } from "@/lib/blog/headings";
import { BLOG_CATEGORIES } from "@/lib/blog/model";

/**
 * A categoria como endereco.
 *
 * As cinco categorias sao nomes de exibicao ("Segurança e Compliance"), e a URL
 * precisa da forma sem acento ("seguranca-e-compliance"). Este arquivo e a
 * unica traducao entre as duas formas.
 *
 * ── POR QUE DERIVAR, E NAO ESCREVER A LISTA DE URLS ─────────────────────────
 *
 * A alternativa seria uma segunda lista, escrita a mao, ao lado de
 * `BLOG_CATEGORIES`. Duas listas que precisam concordar acabam discordando, e o
 * sintoma seria uma categoria com pagina inacessivel - nenhum erro, so um link
 * que da 404.
 *
 * Derivar tem um custo aceito: renomear uma categoria muda a URL dela. Renomear
 * uma das cinco e ato deliberado e raro, e a alternativa - URL congelada
 * divergindo do nome exibido - e pior de manter.
 *
 * Vive fora de `model.js` porque aquele arquivo nao importa nada de proposito, e
 * o mapa precisa da mesma normalizacao que gera slug de post.
 */

const PARA_URL = new Map(BLOG_CATEGORIES.map((nome) => [nome, slugifyHeading(nome)]));

// Duas categorias que produzissem a mesma URL fariam uma delas desaparecer em
// silencio. Com as cinco atuais nao acontece; a guarda existe para a sexta.
if (new Set(PARA_URL.values()).size !== PARA_URL.size) {
  throw new Error("[blog] duas categorias produzem a mesma URL - ajuste os nomes em BLOG_CATEGORIES");
}

const PARA_NOME = new Map(Array.from(PARA_URL, ([nome, url]) => [url, nome]));

/** URLs das cinco categorias, na ordem em que o modelo as declara. */
export const CATEGORY_SLUGS = Array.from(PARA_URL.values());

/** Nome de exibicao -> segmento de URL. Null para nome nao reconhecido. */
export function categorySlug(nome) {
  return PARA_URL.get(nome) ?? null;
}

/** Segmento de URL -> nome de exibicao. Null para URL nao reconhecida. */
export function categoryFromSlug(slug) {
  return PARA_NOME.get(String(slug ?? "")) ?? null;
}

/** True quando o nome e uma das categorias do blog. */
export function isKnownCategory(nome) {
  return PARA_URL.has(nome);
}
