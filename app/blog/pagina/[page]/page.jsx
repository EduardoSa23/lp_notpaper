import { notFound, redirect } from "next/navigation";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import BlogPagination from "@/components/sections/blog/blog-pagination";
import CategoryBar from "@/components/sections/blog/category-bar";
import PostGrid from "@/components/sections/blog/post-grid";
import { getCategoryCounts, getPageCount, getPostsPage } from "@/lib/blog/content-source";
import { BLOG_BASE_PATH } from "@/lib/blog/urls";

// Gera 2..N: a pagina 1 e /blog e nao ganha endereco proprio.
export async function generateStaticParams() {
  const pageCount = await getPageCount();
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }) {
  const { page } = await params;

  return {
    title: `Blog - página ${page} | notPaper`,
    description:
      "Artigos sobre gestão pública digital, GED, automação de processos e conformidade para quem moderniza a administração pública.",
    alternates: {
      canonical: `${BLOG_BASE_PATH}/pagina/${page}`,
    },
  };
}

export default async function BlogPaginaPage({ params }) {
  const { page } = await params;
  const pageNumber = Number(page);

  // Endereco unico da primeira pagina: /blog.
  if (pageNumber === 1) redirect(BLOG_BASE_PATH);

  const pageCount = await getPageCount();
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) notFound();

  const [posts, counts] = await Promise.all([getPostsPage(pageNumber), getCategoryCounts()]);

  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6] pt-32">
        <CategoryBar activeSlug={null} counts={counts} />
        <PostGrid posts={posts} heading={`Artigos - página ${pageNumber}`} />
        <BlogPagination currentPage={pageNumber} pageCount={pageCount} />
      </main>
      <SiteFooter />
    </>
  );
}
