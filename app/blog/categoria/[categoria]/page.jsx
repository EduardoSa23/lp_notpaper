import { notFound } from "next/navigation";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import BlogPagination from "@/components/sections/blog/blog-pagination";
import CategoryBar from "@/components/sections/blog/category-bar";
import PostGrid from "@/components/sections/blog/post-grid";
import { categoryFromSlug } from "@/lib/blog/categories";
import { getCategoryCounts, getCategoryPage, getCategoryPageCount } from "@/lib/blog/content-source";
import { blogCategoryPagePath, blogCategoryPath } from "@/lib/blog/urls";

/**
 * Listagem de uma categoria - primeira pagina.
 *
 * Sem `generateStaticParams`: as cinco categorias sao conhecidas em tempo de
 * build, mas o numero de paginas de cada uma depende do banco, que muda por
 * publicacao automatica. Pre-gerar criaria a mesma classe de problema que a
 * paginacao do indice resolveu ficando dinamica. Ver design, decisao 6.
 *
 * A listagem NAO exclui o post em destaque: aqui nao existe o topo de destaque
 * que justifica a exclusao no indice. Ver `selectCategoryPage`.
 */
export async function generateMetadata({ params }) {
  const { categoria } = await params;
  const nome = categoryFromSlug(categoria);

  if (!nome) return { title: "Categoria não encontrada | notPaper" };

  return {
    title: `${nome} | Blog notPaper`,
    description: `Artigos de ${nome} para quem moderniza a administração pública: prática, processo e resultado.`,
    alternates: {
      // A canonica da primeira pagina e a URL da categoria, nunca uma
      // `pagina/1` - duas URLs para a mesma listagem seriam conteudo duplicado.
      canonical: blogCategoryPath(categoria),
    },
  };
}

export default async function BlogCategoriaPage({ params }) {
  const { categoria } = await params;
  const nome = categoryFromSlug(categoria);

  // URL que nao corresponde a nenhuma das cinco: essa secao nao existe.
  if (!nome) notFound();

  const [posts, pageCount, counts] = await Promise.all([
    getCategoryPage(nome, 1),
    getCategoryPageCount(nome),
    getCategoryCounts(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6] pt-32">
        <CategoryBar activeSlug={categoria} counts={counts} />
        {/* Categoria conhecida e sem post publicado NAO e 404: a secao existe e
            esta temporariamente vazia. `PostGrid` cuida da mensagem. */}
        <PostGrid posts={posts} heading={nome} />
        <BlogPagination
          currentPage={1}
          pageCount={pageCount}
          hrefFor={(page) => blogCategoryPagePath(categoria, page)}
          label={`Paginação da categoria ${nome}`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
