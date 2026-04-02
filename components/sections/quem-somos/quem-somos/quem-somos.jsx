"use client";

import Link from "next/link";
import BorderGlow from "../../../animate/Components/BorderGlow/BorderGlow";
import { useInView } from "@/hooks/useInView";
import SplitText from "../../../animate/TextAnimations/SplitText/SplitText";

export default function QuemSomosSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="w-full bg-gray-50 py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"}`}>
          <SplitText
            text="Quem somos"
            className="text-3xl lg:text-5xl text-center font-bold text-gray-900 leading-tight"
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
          <p className="mt-6 text-gray-600 leading-relaxed">
            Somos uma empresa especializada em digitalização e automação de processos para gestão pública. Desenvolvemos soluções que
            organizam documentos, automatizam fluxos e permitem que prefeituras tenham controle total sobre seus processos.
          </p>
        </div>
        <div ref={ref} className={`${isVisible ? "animate-blur-in-right" : "opacity-0"}`}>
          {/* 🔹 Diferencial */}
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nosso diferencial</h3>

            <p className="text-gray-600 leading-relaxed">
              Não se trata apenas de digitalizar documentos. Enquanto muitas soluções apenas substituem o papel por arquivos digitais, a{" "}
              <span className="font-semibold text-[#0043fe]">NotPaper</span> estrutura processos completos, com regras, rastreabilidade e
              inteligência.
            </p>

            <p className="mt-3 text-gray-600 leading-relaxed">Isso significa mais controle, menos retrabalho e decisões mais seguras.</p>
          </div>

          {/* 🔹 Números */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div>
              <p className="text-3xl text-center font-bold text-blue-600">+20</p>
              <span className="text-sm text-gray-500">Cidades atendidas</span>
            </div>

            <div>
              <p className="text-3xl text-center font-bold text-blue-600">50+</p>
              <span className="text-sm text-gray-500">Especialistas</span>
            </div>

            <div>
              <p className="text-3xl text-center font-bold text-blue-600">98%</p>
              <span className="text-sm text-gray-500">Satisfação do Cliente</span>
            </div>

            <div>
              <p className="text-3xl text-center font-bold text-blue-600">500+</p>
              <span className="text-sm text-gray-500">Projetos Implementados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
