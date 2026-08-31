import { notFound, redirect } from "next/navigation";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import BlogPagination from "@/components/sections/blog/blog-pagination";
import CategoryBar from "@/components/sections/blog/category-bar";
import PostGrid from "@/components/sections/blog/post-grid";
import { categoryFromSlug } from "@/lib/blog/categories";
import { getCategoryCounts, getCategoryPage, getCategoryPageCount } from "@/lib/blog/content-source";
import { blogCategoryPagePath, blogCategoryPath } from "@/lib/blog/urls";

/**
 * Listagem de uma categoria - paginas 2..N.
 *
 * A pagina 1 nao mora aqui: ela e a URL da categoria. Ver a rota irma.
 */
export async function generateMetadata({ params }) {
  const { categoria, page } = await params;
  const nome = categoryFromSlug(categoria);

  if (!nome) return { title: "Categoria não encontrada | notPaper" };

  return {
    title: `${nome} - página ${page} | Blog notPaper`,
    description: `Artigos de ${nome} para quem moderniza a administração pública: prática, processo e resultado.`,
    alternates: {
      canonical: `${blogCategoryPath(categoria)}/pagina/${page}`,
    },
  };
}

export default async function BlogCategoriaPaginaPage({ params }) {
  const { categoria, page } = await params;
  const nome = categoryFromSlug(categoria);

  if (!nome) notFound();

  const pageNumber = Number(page);

  // Endereco unico da primeira pagina: a URL da categoria.
  if (pageNumber === 1) redirect(blogCategoryPath(categoria));

  const pageCount = await getCategoryPageCount(nome);

  // Pagina alem do total da categoria e conteudo inexistente, nao listagem
  // vazia - inclusive quando a categoria nao tem post nenhum (`pageCount` 0),
  // caso em que so a URL da categoria responde.
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) notFound();

  const [posts, counts] = await Promise.all([getCategoryPage(nome, pageNumber), getCategoryCounts()]);

  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6] pt-32">
        <CategoryBar activeSlug={categoria} counts={counts} />
        <PostGrid posts={posts} heading={`${nome} - página ${pageNumber}`} />
        <BlogPagination
          currentPage={pageNumber}
          pageCount={pageCount}
          hrefFor={(p) => blogCategoryPagePath(categoria, p)}
          label={`Paginação da categoria ${nome}`}
        />
      </main>
      <SiteFooter />
    </>
  );
}
