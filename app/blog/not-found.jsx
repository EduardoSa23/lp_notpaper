import Link from "next/link";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import { blogIndexPath } from "@/lib/blog/urls";

export default function BlogNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6]">
        <section className="pb-24 pt-40">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0043FE]">Erro 404</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">Conteúdo não encontrado</h1>
              <p className="mt-4 text-gray-600">
                O artigo que você procura não existe, foi despublicado ou o endereço está incorreto.
              </p>
              <Link
                href={blogIndexPath()}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0043FE] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0036cc]"
              >
                Voltar para o blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
