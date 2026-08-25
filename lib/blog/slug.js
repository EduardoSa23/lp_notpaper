import { slugifyHeading } from "@/lib/blog/headings";
import { RESERVED_SLUGS } from "@/lib/blog/model";

/**
 * Geracao do slug a partir do titulo.
 *
 * O slug e identidade PUBLICA e e gerado por este lado - a entrega nao o traz.
 * Reaproveita o `slugifyHeading` que o sumario do post ja usa, que remove
 * acento e normaliza; um slug com acento derruba a construcao do site inteiro,
 * porque `assertPostShape` roda ao ler do banco e `generateStaticParams`
 * consulta o banco no build.
 *
 * Tres casos que a geracao tem que tratar, e cada um ja quebrou algum blog:
 *   1. colisao - dois titulos diferentes produzindo o mesmo slug;
 *   2. segmento reservado - um titulo que produza `pagina` ou `capa`
 *      sequestraria /blog/pagina/[page] ou /blog/capa/[slug];
 *   3. titulo que nao produz nada - so pontuacao ou emoji daria slug vazio.
 */

const MAX_LENGTH = 200; // igual ao nvarchar(200) da coluna

/** Slug base, sem tratar colisao. Vazio quando o titulo nao produz nada. */
export function baseSlug(title) {
  return slugifyHeading(title ?? "").slice(0, MAX_LENGTH).replace(/-+$/, "");
}

/**
 * Slug definitivo, dado o base e um teste de disponibilidade.
 *
 * @param {string} title titulo da entrega
 * @param {string} fallback usado quando o titulo nao produz slug (o id externo serve)
 * @param {(slug: string) => Promise<boolean>} isTaken consulta de disponibilidade
 */
export async function resolveSlug(title, fallback, isTaken) {
  const base = baseSlug(title) || baseSlug(fallback) || "post";

  // Reservado ja no base: nem tenta, vai direto para o sufixo.
  let candidate = RESERVED_SLUGS.includes(base) ? `${base}-2` : base;

  for (let suffix = 2; await isTaken(candidate); suffix += 1) {
    candidate = `${base}-${suffix}`;

    // Guarda contra laco infinito se `isTaken` mentir. Mil colisoes do mesmo
    // titulo e defeito, nao uso normal.
    if (suffix > 1000) {
      throw new Error(`[blog] nao foi possivel gerar slug livre a partir de "${base}"`);
    }
  }

  return candidate;
}
