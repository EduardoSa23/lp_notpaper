import Image from "next/image";
import Link from "next/link";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { formatPublishedAtShort, formatReadingTime, toDateAttribute } from "@/lib/blog/format";
import { blogPostPath } from "@/lib/blog/urls";

export default function PostCard({ post }) {
  return (
    <article className="group h-full">
      {/* O card inteiro e o link: o alvo de clique no mobile e a area toda. */}
      <Link
        href={blogPostPath(post.slug)}
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-2"
      >
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
          <span className="mb-3 self-start rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE]">
            {post.category}
          </span>

          <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0043FE]">
            {post.title}
          </h3>

          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <time dateTime={toDateAttribute(post.publishedAt)}>{formatPublishedAtShort(post.publishedAt)}</time>
            <span aria-hidden="true">•</span>
            <span>{formatReadingTime(post.readingMinutes)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
