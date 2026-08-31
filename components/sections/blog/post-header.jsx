import Image from "next/image";
import Link from "next/link";

import { BLUR_DATA_URL } from "@/lib/blur-data-url";
import { formatPublishedAt, formatReadingTime, toDateAttribute } from "@/lib/blog/format";
import { categorySlug } from "@/lib/blog/categories";
import { blogCategoryPath, blogIndexPath } from "@/lib/blog/urls";

/**
 * Cabecalho do post.
 *
 * Vive dentro da coluna de conteudo, alinhado a esquerda junto com o corpo -
 * e o que faz a trilha lateral comecar no topo do artigo, ao lado do titulo.
 * O espacamento superior e a largura da coluna vem da pagina.
 */
export default function PostHeader({ post }) {
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <header className="mb-12">
      <div className="max-w-3xl">
        <div className="w-full flex justify-between">
          <Link href={blogIndexPath()} className="text-sm font-semibold text-[#0043FE] hover:underline">
            &larr; Voltar para o blog
          </Link>

          {/* Aqui o rotulo nao estava dentro de link nenhum: troca direta. */}
          {categorySlug(post.category) ? (
            <Link
              href={blogCategoryPath(categorySlug(post.category))}
              className="inline-block rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE] transition-colors hover:bg-[#0043FE]/20"
            >
              {post.category}
            </Link>
          ) : (
            <span className="inline-block rounded-full bg-[#0043FE]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0043FE]">
              {post.category}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{post.title}</h1>

        <p className="mt-4 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{post.author.name}</span>
          <span className="text-gray-500">— {post.author.role}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={toDateAttribute(post.publishedAt)}>{formatPublishedAt(post.publishedAt)}</time>
          <span aria-hidden="true">•</span>
          <span>{formatReadingTime(post.readingMinutes)}</span>
        </div>

        {tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* 16:9 de proposito: a arte das capas geradas pelo modulo e composta
          assumindo corte 16:9 (o essencial no centro), entao qualquer outra
          proporcao aqui cortaria mais do que ela pressupoe. A capa segue a
          mesma medida do texto. */}
      <div className="mt-10 max-w-3xl overflow-hidden rounded-3xl shadow-xl">
        <div className="relative aspect-[16/9] w-full">
          {/* `fill` porque a capa vem do banco e as dimensoes reais variam
              (1200x675 nas atuais, 1536x1024 nas geradas pela IA). Declarar
              width/height fixos seria afirmar uma dimensao que nao se conhece;
              quem define a caixa e o container. */}
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
