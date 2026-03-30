"use client";

import Link from "next/link";
import BorderGlow from "../../../animate/Components/BorderGlow/BorderGlow";
import SplitText from "../../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";

export default function ComparacaoCtaFinalSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="bg-[#F6F8FC]">
      <div
        ref={ref}
        className={`max-w-[1200px] mx-auto px-4 md:py-24 py-6} >
          ${isVisible ? "animate-blur-in-up" : "opacity-0 translate-y-16 blur-md"}`}
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
          <div className="rounded-3xl p-6 text-center md:py-16 bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)]">
            <SplitText
              text="A escolha não é entre sistemas. É entre o ontem e o amanhã."
              className="text-2xl font-bold text-white md:text-4xl mx-auto max-w-[580px]"
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
        </BorderGlow>
      </div>
    </section>
  );
}
