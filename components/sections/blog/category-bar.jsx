import Link from "next/link";

import { CATEGORY_SLUGS, categoryFromSlug } from "@/lib/blog/categories";
import { blogCategoryPath, blogIndexPath } from "@/lib/blog/urls";

const ITEM_BASE =
  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-2";

/**
 * Navegacao entre as categorias do blog.
 *
 * Oferece SO as categorias com ao menos um post publicado: um item que levasse
 * a uma listagem vazia seria um convite para um beco sem saida. A URL direta de
 * uma categoria vazia continua respondendo - quem tem link antigo nao perde a
 * pagina, apenas ninguem e levado a ela por aqui.
 *
 * @param {string|null} activeSlug URL da categoria ativa, ou null no indice
 * @param {Record<string, number>} counts nome da categoria -> total publicado
 */
export default function CategoryBar({ activeSlug = null, counts = {} }) {
  const comPosts = CATEGORY_SLUGS.map((slug) => ({
    slug,
    nome: categoryFromSlug(slug),
    total: counts[categoryFromSlug(slug)] ?? 0,
  })).filter((item) => item.total > 0);

  // Sem nenhuma categoria com post, a barra nao tem o que oferecer.
  if (comPosts.length === 0) return null;

  const noIndice = activeSlug === null;

  return (
    <nav aria-label="Categorias do blog" className="pb-8">
      <div className="container mx-auto px-4">
        {/* Rolagem horizontal na propria barra: cinco categorias com contagem
            nao cabem na largura de um telefone, e deixar a PAGINA rolar de lado
            quebraria o resto do layout. */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Link
            href={blogIndexPath()}
            aria-current={noIndice ? "page" : undefined}
            className={`${ITEM_BASE} ${
              noIndice ? "bg-[#0043FE] text-white" : "bg-white text-gray-700 shadow hover:text-[#0043FE]"
            }`}
          >
            Todos
          </Link>

          {comPosts.map((item) => {
            const ativa = item.slug === activeSlug;

            return (
              <Link
                key={item.slug}
                href={blogCategoryPath(item.slug)}
                aria-current={ativa ? "page" : undefined}
                className={`${ITEM_BASE} ${
                  ativa ? "bg-[#0043FE] text-white" : "bg-white text-gray-700 shadow hover:text-[#0043FE]"
                }`}
              >
                {item.nome}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                    ativa ? "bg-white/25 text-white" : "bg-[#0043FE]/10 text-[#0043FE]"
                  }`}
                >
                  {item.total}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
