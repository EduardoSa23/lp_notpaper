import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import BlogHero from "@/components/sections/blog/blog-hero";
import BlogPagination from "@/components/sections/blog/blog-pagination";
import PostGrid from "@/components/sections/blog/post-grid";
import { getFeaturedPost, getPageCount, getPostsPage } from "@/lib/blog/content-source";

export const metadata = {
  title: "Blog | notPaper",
  description:
    "Artigos sobre gestão pública digital, GED, automação de processos e conformidade para quem moderniza a administração pública.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const [featured, posts, pageCount] = await Promise.all([getFeaturedPost(), getPostsPage(1), getPageCount()]);

  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6]">
        <BlogHero post={featured} />
        {/* A mensagem de lista vazia e para quando nao ha post algum. Com um unico
            post publicado ele aparece no destaque e a grade simplesmente nao existe. */}
        {posts.length > 0 || !featured ? (
          <PostGrid posts={posts} heading={featured ? "Últimos artigos" : null} />
        ) : null}
        <BlogPagination currentPage={1} pageCount={pageCount} />
      </main>
      <SiteFooter />
    </>
  );
}
