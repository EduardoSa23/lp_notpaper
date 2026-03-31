"use client";

import Link from "next/link";
import BorderGlow from "../../../animate/Components/BorderGlow/BorderGlow";
import { useInView } from "@/hooks/useInView";

const metrics = [
  { value: "+500", label: "Empresas Transformadas" },
  { value: "99%", label: "Uptime Garantido" },
  { value: "+15k", label: "Dispositivos Ativos" },
  { value: "24/7", label: "Suporte Especializado" },
];

export default function QuemSomosCtaSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="py-16 w-full max-w-[1280px] mx-auto">
      <div
        ref={ref}
        className={`${isVisible ? "animate-blur-in-up" : "opacity-0 translate-y-16 blur-md"}
        `}
      >
        <BorderGlow
          edgeSensitivity={30}
          glowColor="30 58 138"
          backgroundColor="#060010"
          borderRadius={25}
          glowRadius={40}
          glowIntensity={5}
          coneSpread={25}
          animated={false}
          colors={["#02010f", "#1d1250", "#101baf"]}
        >
          <div
            className="
            relative overflow-hidden rounded-[28px]
            bg-[radial-gradient(circle_at_12%_15%,rgba(45,212,191,0.18),transparent_35%),radial-gradient(circle_at_82%_84%,rgba(30,64,175,0.4),transparent_42%),linear-gradient(125deg,#020617_0%,#0f172a_45%,#111827_100%)]
            p-6 md:p-8 lg:p-12
            grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-teal-300/5 pointer-events-none" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-[620px]">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Pronto para a Próxima Fase?</h2>

              <p className="mt-5 text-[1.05rem] leading-7 text-slate-300">
                A transformação digital não é um destino, mas uma evolução contínua. Vamos desenhar juntos o futuro da sua infraestrutura.
              </p>

              <Link
                href="https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F"
                target="_blank"
                className="
                  inline-block mt-6
                  rounded-xl
                  bg-gradient-to-br from-teal-400 to-teal-300
                  px-6 py-3
                  font-bold text-teal-950
                  transition-all duration-300
                  hover:-translate-y-1 hover:brightness-105
                "
              >
                Falar com um Especialista
              </Link>
            </div>

            {/* METRICS */}
            <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4">
              {metrics.map((item) => (
                <article
                  key={item.label}
                  className="
                    rounded-xl border border-slate-400/30
                    bg-slate-900/60 backdrop-blur-md
                    p-4
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-teal-400/60
                  "
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-teal-300">{item.value}</p>
                  <p className="text-slate-300 mt-1 text-sm md:text-base">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}
