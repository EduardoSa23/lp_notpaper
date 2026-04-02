"use client";

import Image from "next/image";
import { FaMobileScreenButton } from "react-icons/fa6";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const citizenBadges = ["Alertas em tempo real", "Validacão via QR code", "Carta de Serviços", "Ouvidoria integrada", "E-SIC digital", "Agendamento online", "Bolsa de empregos", "Marketplace da cidade", "Pontos turísticos", "Comunicação oficial"];

export default function SolucoesCidadaniaSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="container mx-auto grid gap-10 px-4 py-8 md:grid-cols-2 md:items-center md:py-16">
      <div ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"} grid grid-cols-2 gap-2`}>
        <div className="grid gap-2">
          <Image
            className="max-w-full max-h-[275px] rounded-3xl"
            src="/image/servicos_app.jpg"
            alt="Tela de serviços do aplicativo"
            width={900}
            height={600}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ height: "auto" }}
          />
          <Image
            className="max-w-full max-h-[275px] rounded-3xl"
            src="/image/mobile_secondary.jpg"
            alt="Tela secundária do aplicativo"
            width={900}
            height={600}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ height: "auto" }}
          />
        </div>
        <div className="max-w-[270px] rounded-3xl bg-white p-4">
          <Image
            className="max-w-full rounded-3xl shadow-2xl"
            src="/image/tela_app.png"
            alt="Aplicativo notPaper"
            width={540}
            height={960}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ height: "auto" }}
          />
        </div>
      </div>

      <div ref={ref} className={`${isVisible ? "animate-blur-in-right" : "opacity-0"}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Cidadania digital</p>
        <SplitText
          text="A prefeitura na palma da mão do cidadão"
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
          Aproxime a gestão pública das pessoas com um app intuitivo, que permite solicitar serviços, acompanhar demandas e se manter
          informado em tempo real.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {citizenBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              <FaMobileScreenButton />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
