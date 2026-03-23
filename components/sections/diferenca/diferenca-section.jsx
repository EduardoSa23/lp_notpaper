"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const diferencas = [
  {
    img: "/image/digitalizacao_documentos.png",
    titulo: "Adeus ao Papel, Olá à Eficiência",
    subtitulo: "Digitalização",
    descricao:
      "A inPrint Prime revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
  },
  {
    img: "/image/agilidade_processos.png",
    titulo: "Agilidade que Transforma o Serviço",
    subtitulo: "Processos Ágeis",
    descricao:
      "Reduza drasticamente o tempo de tramitação de documentos e processos. A inPrint Prime acelera as etapas, permite o acompanhamento em tempo real e agiliza a tomada de decisões, resultando em um processo mais rápido e eficaz.",
  },
  {
    img: "/image/implementacao_suporte.png",
    titulo: "Implantação Simples",
    subtitulo: "Parceria Completa",
    descricao:
      "Nossa equipe garante uma implantação rápida e sem complicações, com treinamento completo para sua equipe. Conte com suporte técnico especializado e contínuo para que sua prefeitura aproveite ao máximo todos os recursos da inPrint Prime.",
  },
  {
    img: "/image/dados_protegidos.png",
    titulo: "Segurança e Conformidade Garantidas",
    subtitulo: "Dados Protegidos",
    descricao:
      "Com a inPrint Prime, a segurança dos seus dados é prioridade. Nosso sistema garante a integridade e confidencialidade das informações, com trilhas de auditoria completas e conformidade com a LGPD, assegurando a validade jurídica de cada processo.",
  },
  {
    img: "/image/economia_sustentabilidade.png",
    titulo: "Economia e Sustentabilidade de Mãos Dadas",
    subtitulo: "Sustentabilidade",
    descricao:
      "A inPrint Prime revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
  },
];

export default function DiferencaSection() {
  const [cardIndex, setCardIndex] = useState(0);
  const maxDesktopIndex = useMemo(() => Math.max(diferencas.length - 2, 0), []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 769px)");
    if (!media.matches) return undefined;

    const id = setInterval(() => {
      setCardIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
    }, 15000);

    return () => clearInterval(id);
  }, [maxDesktopIndex]);

  const next = () => setCardIndex((prev) => (prev < maxDesktopIndex ? prev + 1 : 0));
  const prev = () => setCardIndex((prevValue) => (prevValue > 0 ? prevValue - 1 : maxDesktopIndex));
  const desktopTranslate = { transform: `translateX(${-cardIndex * 350}px)` };

  return (
    <section id="diferenca" className="bg-white pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <div className="mx-auto grid max-w-6xl px-4">
        <div className="flex items-center justify-between gap-12">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">
            O que torna a <strong className="text-3xl text-[#0043FE] md:text-4xl">notPaper</strong> diferente?
          </h2>
          <div className="mb-4 hidden justify-end gap-2 md:flex">
            <button className="rounded-full bg-gray-200 p-2 text-2xl shadow-md hover:bg-gray-300" onClick={prev} aria-label="Anterior">
              <FaChevronLeft />
            </button>
            <button className="rounded-full bg-[#0043FE] p-2 text-2xl shadow-md hover:bg-[#0135C5]" onClick={next} aria-label="Próximo">
              <FaChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="carousel-container">
        <div className="carousel-diferenca my-8 hidden px-5 md:flex md:pl-8 lg:ml-[200px]" style={desktopTranslate}>
          {diferencas.map((card) => (
            <article key={card.titulo} className="card-diferanca max-w-[100%] rounded-[30px] border border-gray-200 bg-white shadow md:max-w-5xl">
              <Image src={card.img} alt={card.titulo} width={500} height={250} className="mb-4 w-full" />
              <h3 className="text-center text-lg font-bold">{card.titulo}</h3>
              <h4 className="my-4 text-center font-semibold">{card.subtitulo}</h4>
              <p className="p-6 text-sm text-gray-600">{card.descricao}</p>
            </article>
          ))}
        </div>

        <div className="carousel-diferenca-mobile my-8 block px-5 md:hidden md:pl-8 lg:ml-[200px]">
          {diferencas.map((card) => (
            <article key={`mobile-${card.titulo}`} className="card-diferanca-mobile mb-8 max-w-[100%] rounded-[30px] border border-gray-200 bg-white shadow md:max-w-5xl">
              <Image src={card.img} alt={card.titulo} width={500} height={250} className="mb-4 w-full" />
              <h3 className="text-center text-lg font-bold">{card.titulo}</h3>
              <h4 className="my-4 text-center font-semibold">{card.subtitulo}</h4>
              <p className="p-6 text-sm text-gray-600">{card.descricao}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
