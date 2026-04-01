"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const diferencas = [
  {
    img: "/image/digitalizacao_documentos.png",
    titulo: "Adeus ao Papel, Olá à Eficiência",
    subtitulo: "Digitalização",
    descricao:
      "A notPaper revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
  },
  {
    img: "/image/agilidade_processos.png",
    titulo: "Agilidade que Transforma o Serviço",
    subtitulo: "Processos Ágeis",
    descricao:
      "Reduza drasticamente o tempo de tramitação de documentos e processos. A notPaper acelera as etapas, permite o acompanhamento em tempo real e agiliza a tomada de decisões, resultando em um processo mais rápido e eficaz.",
  },
  {
    img: "/image/implementacao_suporte.png",
    titulo: "Implantação Simples",
    subtitulo: "Parceria Completa",
    descricao:
      "Nossa equipe garante uma implantação rápida e sem complicações, com treinamento completo para sua equipe. Conte com suporte técnico especializado e contínuo para que sua prefeitura aproveite ao máximo todos os recursos da notPaper.",
  },
  {
    img: "/image/dados_protegidos.png",
    titulo: "Segurança e Conformidade Garantidas",
    subtitulo: "Dados Protegidos",
    descricao:
      "Com a notPaper, a segurança dos seus dados é prioridade. Nosso sistema garante a integridade e confidencialidade das informações, com trilhas de auditoria completas e conformidade com a LGPD, assegurando a validade jurídica de cada processo.",
  },
  {
    img: "/image/economia_sustentabilidade.png",
    titulo: "Economia e Sustentabilidade de Mãos Dadas",
    subtitulo: "Sustentabilidade",
    descricao:
      "A notPaper revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
  },
];

export default function DiferencaSection() {
  const carouselRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const endDrag = () => {
      if (!dragState.current.isDragging) return;
      dragState.current.isDragging = false;
      setIsDragging(false);
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  const getStep = () => {
    const track = carouselRef.current;
    if (!track) return 360;

    const firstCard = track.querySelector(".card-diferanca");
    if (!firstCard) return 360;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollByStep = (direction) => {
    const track = carouselRef.current;
    if (!track) return;

    track.scrollBy({
      left: getStep() * direction,
      behavior: "smooth",
    });
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse") return;

    const track = carouselRef.current;
    if (!track) return;

    dragState.current.isDragging = true;
    dragState.current.startX = event.clientX;
    dragState.current.scrollLeft = track.scrollLeft;
    setIsDragging(true);
  };

  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") return;

    const track = carouselRef.current;
    if (!track || !dragState.current.isDragging) return;

    const deltaX = event.clientX - dragState.current.startX;
    track.scrollLeft = dragState.current.scrollLeft - deltaX;
  };

  return (
    <section id="diferenca" className="bg-white pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <div className="mx-auto grid max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-12">
          <h2 className="mb-2 text-center text-3xl md:text-5xl font-bold md:mb-6">
            O que torna a <strong className="text-[#0043FE]">notPaper</strong> diferente?
          </h2>
          <div className="mb-2 flex justify-end gap-2 md:mb-4">
            <button
              className="rounded-full bg-gray-200 p-2 text-2xl shadow-md transition hover:bg-gray-300"
              onClick={() => scrollByStep(-1)}
              aria-label="Anterior"
              type="button"
            >
              <FaChevronLeft />
            </button>
            <button
              className="rounded-full bg-[#0043FE] p-2 text-2xl shadow-md transition hover:bg-[#0135C5]"
              onClick={() => scrollByStep(1)}
              aria-label="Próximo"
              type="button"
            >
              <FaChevronRight className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="carousel-container">
        <div
          ref={carouselRef}
          className={`carousel-diferenca my-8 px-5 md:pl-8 ml-2 lg:ml-[150px] ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {diferencas.map((card, index) => (
            <article
              key={card.titulo}
              className="card-diferanca max-w-[100%] rounded-[30px] border border-gray-200 bg-white shadow md:max-w-5xl"
            >
              <Image
                src={card.img}
                alt={card.titulo}
                width={500}
                height={250}
                className="mb-4 max-w-full"
                priority={index === 0}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                style={{ width: "100%", height: "auto" }}
                draggable={false}
              />
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
