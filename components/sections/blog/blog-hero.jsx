import Image from "next/image";
import Link from "next/link";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { formatPublishedAt, formatReadingTime, toDateAttribute } from "@/lib/blog/format";
import { blogPostPath } from "@/lib/blog/urls";

export default function BlogHero({ post }) {
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

        {post ? (
          <article>
            <Link
              href={blogPostPath(post.slug)}
              className="group grid overflow-hidden rounded-3xl bg-white shadow-xl transition-shadow duration-300 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-2 lg:grid-cols-2"
            >
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
                  <span className="rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE]">
                    {post.category}
                  </span>
                </div>

                <h2 className="mb-4 text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#0043FE] md:text-3xl">
                  {post.title}
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
            </Link>
          </article>
        ) : null}
      </div>
    </section>
  );
}
