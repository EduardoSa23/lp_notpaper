import Link from "next/link";

export default function ComparacaoCtaFinalSection() {
  return (
    <section className="bg-[#F6F8FC]">
      <div className="max-w-[1200px] mx-auto px-4 md:py-24 py-6">
        <div className="rounded-2xl p-6 text-center shadow-2xl md:py-16 bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)]">
          <h3 className="text-2xl font-bold text-white md:text-4xl mx-auto max-w-[580px]">
            A escolha não é entre sistemas. É entre o ontem e o amanhã.
          </h3>
          <p className="mx-auto mt-3 md:mt-8 max-w-2xl text-gray-200">
            Você vai continuar gerindo processos ou vai começar a gerir resultados? Transforme sua prefeitura em uma referência de
            eficiência.
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F"
              target="_blank"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Falar com especialista
            </Link>
            <Link
              href="/contato"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700"
            >
              Solicitar demonstração
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
