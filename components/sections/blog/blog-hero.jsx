import Image from "next/image";
import Link from "next/link";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { categorySlug } from "@/lib/blog/categories";
import { formatPublishedAt, formatReadingTime, toDateAttribute } from "@/lib/blog/format";
import { blogCategoryPath, blogPostPath } from "@/lib/blog/urls";

export default function BlogHero({ post }) {
  const urlDaCategoria = post ? categorySlug(post.category) : null;

  return (
    <section className="pb-12 pt-32">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#0043FE]">Blog</span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Conteúdo sobre gestão pública digital
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Práticas, análises e experiências de quem coloca processo público para funcionar sem papel.
          </p>
        </div>

        {/* Mesma sobreposicao do card: o link do titulo cobre o bloco todo e o
            link da categoria fica acima dele. Ver `post-card.jsx`. */}
        {post ? (
          <article className="group relative grid overflow-hidden rounded-3xl bg-white shadow-xl transition-shadow duration-300 hover:shadow-2xl focus-within:ring-2 focus-within:ring-[#0043FE] focus-within:ring-offset-2 lg:grid-cols-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[22rem]">
                <Image
                  src={post.coverImage.src}
                  alt={post.coverImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#0043FE] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Destaque
                  </span>
                  {urlDaCategoria ? (
                    <Link
                      href={blogCategoryPath(urlDaCategoria)}
                      className="relative z-10 rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE] transition-colors hover:bg-[#0043FE]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-1"
                    >
                      {post.category}
                    </Link>
                  ) : (
                    <span className="rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE]">
                      {post.category}
                    </span>
                  )}
                </div>

                <h2 className="mb-4 text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#0043FE] md:text-3xl">
                  <Link
                    href={blogPostPath(post.slug)}
                    className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mb-6 text-base leading-relaxed text-gray-600">{post.excerpt}</p>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{post.author.name}</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={toDateAttribute(post.publishedAt)}>{formatPublishedAt(post.publishedAt)}</time>
                  <span aria-hidden="true">•</span>
                  <span>{formatReadingTime(post.readingMinutes)}</span>
                </div>

                <span className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0043FE]">
                  Ler o artigo
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
