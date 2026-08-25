import { notFound } from "next/navigation";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import PostBody from "@/components/sections/blog/post-body";
import PostCta from "@/components/sections/blog/post-cta";
import PostHeader from "@/components/sections/blog/post-header";
import PostShare from "@/components/sections/blog/post-share";
import PostToc from "@/components/sections/blog/post-toc";
import RelatedPosts from "@/components/sections/blog/related-posts";
import ArticleStructuredData from "@/components/seo/article-structured-data";
import { getAllPublishedSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog/content-source";
import { collectHeadings } from "@/lib/blog/headings";
import { blogPostPath, blogPostUrl } from "@/lib/blog/urls";

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // `generateMetadata` roda ANTES da arvore de componentes, entao um erro aqui
  // impede a fronteira `error.jsx` de sequer existir - o visitante receberia a
  // pagina de erro embutida do Next em vez de uma pagina do site. Falha de
  // infraestrutura e engolida de proposito: quem estoura de verdade e o
  // componente logo abaixo, e ai a fronteira aparece.
  let post;

  try {
    post = await getPostBySlug(slug);
  } catch {
    return { title: "Blog | notPaper" };
  }

  if (!post) return { title: "Conteúdo não encontrado | notPaper" };

  return {
    title: `${post.title} | Blog notPaper`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: blogPostPath(post.slug),
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: blogPostUrl(post.slug),
      siteName: "notPaper",
      locale: "pt_BR",
      publishedTime: post.publishedAt,
      // Sem width/height: a capa vem do banco e a dimensao real varia
      // (1536x1024 nas geradas pela IA). Declarar 1200x675 seria informar ao
      // buscador e as redes uma dimensao que a imagem nao tem.
      images: [
        {
          url: post.coverImage.src,
          alt: post.coverImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage.src],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Slug inexistente ou em rascunho cai no not-found do segmento /blog.
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug);

  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6]">
        <ArticleStructuredData post={post} />
        <div className="container mx-auto px-4 pb-20 pt-32">
          {/* Duas colunas no desktop; uma no mobile, onde a ordem vem do `order-*`
              de cada bloco - nenhum componente e duplicado, senao os `id` das
              ancoras do sumario apareceriam duas vezes. */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* Cabecalho e corpo na mesma coluna: e o que alinha o texto a
                esquerda e coloca a trilha ao lado do titulo, ja no topo. */}
            <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
              <PostHeader post={post} />
              <PostBody content={post.content} />
            </div>

            {/* `contents` no mobile dissolve este container: os tres blocos passam
                a ser itens da grade e se ordenam sozinhos. No desktop volta a ser
                uma caixa, que e o que permite o sticky da coluna.

                A folga acima da trilha durante o scroll e o `lg:top-20` (5rem, um
                pouco acima dos ~72px do header fixo) - NAO existe margin aqui.
                O espaco inicial, antes de rolar, vem do `pt-32` do container. */}
            <div className="contents lg:col-start-2 lg:row-start-1 lg:block lg:space-y-6 lg:self-start lg:sticky lg:top-20">
              <PostToc
                headings={collectHeadings(post.content)}
                className="order-1 w-full max-w-3xl lg:order-none lg:max-w-none"
              />
              <PostShare
                title={post.title}
                url={blogPostUrl(post.slug)}
                className="order-3 w-full max-w-3xl lg:order-none lg:max-w-none"
              />
              <PostCta className="order-4 w-full max-w-3xl lg:order-none lg:max-w-none" />
            </div>
          </div>

          {/* Fora da grade de proposito: a trilha e sticky dentro dela, entao o
              fim da grade e o limite do percurso dela. Deixar os relacionados
              aqui dentro faria a trilha continuar descendo por cima deles.
              No mobile a ordem continua correta - isto vem depois da grade. */}
          <div className="mt-12">
            <RelatedPosts posts={related} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
