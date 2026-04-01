import Image from "next/image";
import { FaBrain, FaCircleCheck } from "react-icons/fa6";
import { BtnWhatsapp } from "../../ui/btn-whatsapp";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

export default function SolucoesIaBiSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div
        className="grid gap-10 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-8 shadow-2xl 
                md:grid-cols-[auto_auto] md:items-center md:justify-between md:px-10 md:py-12"
      >
        <div className="max-w-[85%]">
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
        <div className="rounded-2xl bg-gray-600 p-4 shadow-2xl">
          <Image
            className="max-h-[500px] rounded-2xl"
            src="/image/dados_ia.png"
            alt="Dashboard com dados e inteligência artificial"
            width={400}
            height={500}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
