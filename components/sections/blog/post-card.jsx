import Image from "next/image";
import Link from "next/link";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { categorySlug } from "@/lib/blog/categories";
import { formatPublishedAtShort, formatReadingTime, toDateAttribute } from "@/lib/blog/format";
import { blogCategoryPath, blogPostPath } from "@/lib/blog/urls";

/**
 * Card da grade.
 *
 * ── DOIS DESTINOS NUM CARD CLICAVEL INTEIRO ─────────────────────────────────
 *
 * O card todo levava ao post por ser UM `<Link>` envolvendo tudo. Com a
 * categoria virando link, isso deixou de servir: ancora dentro de ancora e
 * HTML invalido, e o navegador desfaz o aninhamento de um jeito que nenhum dos
 * dois links funciona como escrito.
 *
 * A saida e a sobreposicao: o link do TITULO se estende sobre o card inteiro
 * pelo `after:absolute after:inset-0`, e o link da CATEGORIA fica acima dessa
 * camada com `relative z-10`. Resultado: clicar em qualquer lugar leva ao post,
 * clicar no rotulo leva a categoria, e a arvore tem os dois links como irmaos.
 */
export default function PostCard({ post }) {
  const urlDaCategoria = categorySlug(post.category);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#0043FE] focus-within:ring-offset-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.coverImage.src}
          alt={post.coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Categoria fora das cinco (escrita manual no banco) nao ganha link:
            ela nao tem pagina para levar a. O rotulo continua aparecendo. */}
        {urlDaCategoria ? (
          <Link
            href={blogCategoryPath(urlDaCategoria)}
            className="relative z-10 mb-3 self-start rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE] transition-colors hover:bg-[#0043FE]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-1"
          >
            {post.category}
          </Link>
        ) : (
          <span className="mb-3 self-start rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE]">
            {post.category}
          </span>
        )}

        <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0043FE]">
          <Link
            href={blogPostPath(post.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <time dateTime={toDateAttribute(post.publishedAt)}>{formatPublishedAtShort(post.publishedAt)}</time>
          <span aria-hidden="true">•</span>
          <span>{formatReadingTime(post.readingMinutes)}</span>
        </div>
      </div>
    </article>
  );
}
