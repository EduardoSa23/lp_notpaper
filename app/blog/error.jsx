"use client";

import Link from "next/link";

import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import { blogIndexPath } from "@/lib/blog/urls";

/**
 * Erro ao renderizar uma pagina do blog.
 *
 * Existe para o caso concreto do banco indisponivel numa pagina que ainda nao
 * foi renderizada: sem esta fronteira, o visitante receberia o erro cru do
 * Next em vez de uma pagina do site.
 *
 * NAO mostra a mensagem do erro. Ela pode conter servidor, nome de banco ou
 * trecho de consulta - detalhe interno que nao vai para visitante nenhum. O
 * diagnostico fica no log do servidor, que e onde alguem pode agir.
 */
export default function BlogError({ reset }) {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6]">
        <section className="pb-24 pt-40">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0043FE]">Blog</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">Não foi possível carregar o conteúdo</h1>
              <p className="mt-4 text-gray-600">
                Houve uma falha ao buscar este conteúdo. Tente de novo em alguns instantes — o
                restante do site continua disponível.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg bg-[#0043FE] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0036cc]"
                >
                  Tentar de novo
                </button>
                <Link
                  href={blogIndexPath()}
                  className="rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-[#0043FE] hover:text-[#0043FE]"
                >
                  Voltar para o blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
