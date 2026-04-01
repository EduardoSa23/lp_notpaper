import { FaChartLine } from "react-icons/fa6";
import Link from "next/link";

export default function QuemSomosHeroSection() {
  return (
    <section className="bg-[#eceff6] pt-28 md:pt-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-14 md:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="max-w-[640px]">
            <span className="inline-flex rounded-full bg-[#67e8d6] px-3 py-1 text-[0.7rem] font-bold tracking-[0.14em] text-[#0f766e]">NOSSA HISTÓRIA</span>

            <h1 className="mt-5 text-[2.35rem] font-bold leading-[1.05] text-slate-900 md:text-[4rem]">
              Nossa Evolução <span className="text-blue-700">Digital</span>
            </h1>

            <p className="mt-5 text-[1.07rem] leading-7 text-slate-600">
              Nascemos no coração da era física, transformando a eficiência operacional por meio de soluções inteligentes. Mas o mundo acelerou, e nos também.
            </p>
            <p className="mt-5 text-[1.07rem] leading-7 text-slate-600">
              Hoje, a notPaper atua com visão de Gestão 4.0, conectando ecossistemas de ECM, automação de workflow e digitalização inteligente em uma jornada contínua de evolução.
            </p>

            <Link
              href="/solucoes"
              className="mt-8 inline-flex rounded-xl bg-[#0f43d9] px-6 py-3.5 font-bold text-white shadow-[0_10px_25px_rgba(15,67,217,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0c37b3] hover:shadow-[0_14px_28px_rgba(12,55,179,0.28)]"
            >
              Explorar Soluções
            </Link>
          </div>

          <div className="relative min-h-[340px] w-full md:min-h-[450px] lg:min-h-[500px]">
            <img
              className="w-full rounded-[1.25rem] shadow-[0_24px_45px_rgba(15,23,42,0.32)] md:min-h-[420px] lg:min-h-[470px]"
              src="/image/nossa_evolucao.png"
              alt="Abstracao digital da evolucao tecnologica"
            />
            <div className="absolute bottom-[-1.6rem] left-4 w-[min(280px,80%)] rounded-2xl bg-white px-4 py-[0.95rem] shadow-[0_16px_30px_rgba(15,23,42,0.16)] md:bottom-[-1.2rem] md:left-[-1.2rem]">
              <div className="flex items-center gap-2 text-[0.78rem] font-extrabold tracking-[0.1em] text-[#0f766e]">
                <FaChartLine />
                <span>INOVAÇÃO</span>
              </div>
              <p className="mt-2 text-[0.92rem] leading-[1.35rem] text-slate-700">Eficiência 4.0 integrada ao seu fluxo de trabalho.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
