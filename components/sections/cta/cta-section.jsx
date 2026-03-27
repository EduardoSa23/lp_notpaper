import Link from "next/link";

export default function CtaFinalSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:pb-24 pb-6 md:pb-20">
      <div className="rounded-2xl p-6 text-center shadow-2xl md:py-10 bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)]">
        <h3 className="text-3xl font-bold text-white md:text-5xl mx-auto max-w-[800px]">Antes de escolher um sistema, veja isso</h3>
        <p className="mx-auto mt-3 md:mt-8 max-w-3xl text-gray-200">
          Nem toda solução entrega o que promete. Compare a NotPaper com outras plataformas e entenda as diferenças que impactam sua gestão
          em funcionalidades, controle, rastreabilidade e eficiência, antes de tomar uma decisão.
        </p>
        <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/comparacao"
            className="rounded-xl md:text-lg bg-white px-8 py-4 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700"
          >
            Comparar com outros sistemas
          </Link>
        </div>
      </div>
    </section>
  );
}
