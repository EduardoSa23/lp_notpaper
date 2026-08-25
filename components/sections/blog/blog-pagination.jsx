import Link from "next/link";

import { blogPagePath } from "@/lib/blog/urls";

const LINK_BASE =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-2";

export default function BlogPagination({ currentPage, pageCount }) {
  // Uma pagina so nao precisa de navegacao.
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < pageCount;

  return (
    <nav aria-label="Paginação do blog" className="pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Anterior e seguinte aparecem apenas quando existem. */}
          {hasPrevious ? (
            <Link href={blogPagePath(currentPage - 1)} className={`${LINK_BASE} bg-white text-gray-700 shadow hover:text-[#0043FE]`} rel="prev">
              &larr; Anterior
            </Link>
          ) : null}

          {pages.map((page) => {
            const isCurrent = page === currentPage;

            return isCurrent ? (
              <span key={page} aria-current="page" className={`${LINK_BASE} bg-[#0043FE] text-white`}>
                {page}
              </span>
            ) : (
              <Link key={page} href={blogPagePath(page)} className={`${LINK_BASE} bg-white text-gray-700 shadow hover:text-[#0043FE]`}>
                {page}
              </Link>
            );
          })}

          {hasNext ? (
            <Link href={blogPagePath(currentPage + 1)} className={`${LINK_BASE} bg-white text-gray-700 shadow hover:text-[#0043FE]`} rel="next">
              Próxima &rarr;
            </Link>
          ) : null}
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Página {currentPage} de {pageCount}
        </p>
      </div>
    </nav>
  );
}
