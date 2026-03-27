import { FaBrain, FaCircleCheck } from "react-icons/fa6";
import { BtnWhatsapp } from "../../ui/btn-whatsapp";

export default function SolucoesIaBiSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div
        className="grid gap-10 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-700 md:px-10 md:py-12 px-6 py-8 shadow-2xl 
                md:grid-cols-[auto_auto] md:justify-between md:items-center "
      >
        <div className="lg:max-w-[85%] w-full">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Inteligência estratégica</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">Transforme dados em decisões com IA & BI</h2>
          <div className="mt-7 space-y-4">
            <article className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-teal-400/20 text-teal-200">
                <FaBrain />
              </div>
              <div>
                <h3 className="font-semibold text-white">Predição de demandas</h3>
                <p className="text-sm text-slate-300">Algoritmos que analisam históricos para prever picos e necessidades de recursos.</p>
              </div>
            </article>
            <article className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-teal-400/20 text-teal-200">
                <FaCircleCheck />
              </div>
              <div>
                <h3 className="font-semibold text-white">Dashboards executivos</h3>
                <p className="text-sm text-slate-300">Visão holística com indicadores de performance em tempo real.</p>
              </div>
            </article>
          </div>
          <BtnWhatsapp className="mt-7">Falar com um especialista</BtnWhatsapp>
        </div>
        <div className="rounded-2xl p-4 bg-gray-600 shadow-2xl">
          <img className="max-h-[500px] rounded-2xl" src="/image/dados_ia.png" alt="" />
        </div>
      </div>
    </section>
  );
}
