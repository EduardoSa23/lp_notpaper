"use client";

import Image from "next/image";
import { FaBolt, FaDatabase, FaFileLines, FaClock, FaShieldHalved } from "react-icons/fa6";
import { useInView } from "@/hooks/useInView";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const certidoesFeatures = [
  {
    icon: FaBolt,
    title: "Emissão em tempo real ",
    text: "Gere certidões e documentos instantaneamente, sem depender de etapas manuais ou retrabalho.",
  },
  {
    icon: FaDatabase,
    title: "Integração com dados existentes",
    text: "Aproveite informações já cadastradas no sistema para preencher automaticamente os documentos, evitando duplicidade e inconsistências.",
  },
  {
    icon: FaFileLines,
    title: "Padronização automática",
    text: "Garanta que todos os documentos sigam o mesmo formato, linguagem e critérios institucionais. Elimine falhas humanas com geração automatizada e validação de dados em cada emissão.",
  },
  {
    icon: FaClock,
    title: "Agilidade no atendimento ao cidadão",
    text: "Diminua filas, reduza prazos e entregue respostas muito mais rápidas à população.",
  },
  {
    icon: FaShieldHalved,
    title: "Rastreabilidade e segurança jurídica",
    text: "Cada documento emitido possui registro, histórico e controle, garantindo transparência e validade.",
  },
];

export default function SolucoesCertidoesDocumentosSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="container mx-auto grid gap-10 px-4 py-8 md:grid-cols-2 md:items-center md:py-16">
      <div ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"} order-2 md:order-1`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 04</p>
        <SplitText
          text="Automação na emissão de certidões e documentos públicos"
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
          Automatize a emissão de certidões com base em dados já existentes no sistema, garantindo agilidade, padronização e segurança em
          cada documento gerado.
        </p>

        <div className="mt-8 space-y-4">
          {certidoesFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Icon />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div
        ref={ref}
        className={`${isVisible ? "animate-blur-in-right" : "opacity-0"} order-1 rounded-2xl bg-white p-4 shadow-xl md:order-2`}
      >
        <Image
          className="max-w-full rounded-2xl"
          src="/image/certidoes.png"
          alt="Interface do módulo certidões e documentos"
          width={1200}
          height={700}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          style={{ height: "auto" }}
        />
      </div>
    </section>
  );
}
