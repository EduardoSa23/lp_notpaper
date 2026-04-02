"use client";

import Image from "next/image";
import { FaDiagramProject, FaWaveSquare } from "react-icons/fa6";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const workflowFeatures = [
  {
    icon: FaDiagramProject,
    title: "Estruturação inteligente de fluxos",
    text: "Crie fluxos de trabalho com lógica clara, definindo etapas, responsáveis e regras. Visualize todo o processo e elimine gargalos antes que eles aconteçam.",
  },
  {
    icon: FaWaveSquare,
    title: "Controle de processos e performance",
    text: "Acompanhe prazos, status e desempenho em tempo real. Identifique atrasos e oportunidades de melhoria com dados confiáveis.",
  },
];

export default function SolucoesWorkflowSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="container mx-auto grid gap-10 px-4 py-8 md:grid-cols-2 md:items-center md:py-16">
      <div ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"} rounded-2xl bg-white p-4 shadow-xl`}>
        <Image
          className="max-w-full rounded-2xl"
          src="/image/automacao.png"
          alt="Fluxo de automação"
          width={1200}
          height={700}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          style={{ height: "auto" }}
        />
      </div>
      <div ref={ref} className={`${isVisible ? "animate-blur-in-right" : "opacity-0"}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 02</p>
        <SplitText
          text="Automação & Workflow (BPMN 2.0)"
          className="mt-3 text-4xl md:min-h-[105px] font-bold leading-tight md:text-5xl"
          delay={50}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="start"
        />
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Processos manuais geram atrasos, retrabalho e falta de controle. Com a NotPaper, você transforma fluxos complexos em operações
          digitais ágeis, seguras e totalmente monitoradas.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {workflowFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
