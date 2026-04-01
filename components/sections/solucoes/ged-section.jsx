"use client";

import Image from "next/image";
import { FaFileSignature, FaMagnifyingGlass, FaShieldHalved } from "react-icons/fa6";
import { useInView } from "@/hooks/useInView";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const gedFeatures = [
  {
    icon: FaMagnifyingGlass,
    title: "OCR inteligente",
    text: "Conversão automática de imagens e PDFs para texto pesquisavel em alta precisão.",
  },
  {
    icon: FaFileSignature,
    title: "Busca full-text",
    text: "Localize qualquer informação em milhares de páginas com rastreabilidade completa.",
  },
  {
    icon: FaShieldHalved,
    title: "Validade jurídica",
    text: "Assinaturas digitais padrão ICP-Brasil e trilhas de auditoria integradas.",
  },
];

export default function SolucoesGedSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="container mx-auto grid gap-10 px-4 py-8 md:grid-cols-2 md:items-center md:py-16">
      <div ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"} order-2 md:order-1`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 03</p>
        <SplitText
          text="Gestão Eletrônica de Documentos (GED)"
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
          Solução completa de armazenamento inteligente, indexação automática e governança documental para operações de alta performance.
        </p>

        <div className="mt-8 space-y-4">
          {gedFeatures.map((item) => {
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

      <div ref={ref} className={`${isVisible ? "animate-blur-in-right" : "opacity-0"} order-1 rounded-2xl bg-white p-4 shadow-xl md:order-2`}>
        <Image
          className="max-w-full rounded-2xl"
          src="/image/ged.png"
          alt="Interface do módulo GED"
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
