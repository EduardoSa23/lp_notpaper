import Link from "next/link";

export default function SolucoesCtaFinalSection() {
  return (
    <section className="container mx-auto px-4 pb-16 pt-6 md:pb-20">
      <div className="rounded-2xl bg-[#253143] p-6 text-center shadow-sm md:p-8">
        <h3 className="text-3xl font-bold text-white md:text-4xl">Pronto para modernizar sua operação?</h3>
        <p className="mx-auto mt-3 max-w-2xl text-gray-200">Combinamos arquitetura robusta, automação e experiência para acelerar resultados reais.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contato" className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800">
            Falar com especialista
          </Link>
          <Link href="/comparacao" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700">
            Ver comparação de cenários
          </Link>
        </div>
      </div>
    </section>
  );
}
