"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const diferencas = [
  {
    img: "/image/digitalizacao_documentos.png",
    titulo: "Elimine o papel, organize sua gestão",
    subtitulo: "Gestão eletrônica de documentos (GED)",
    descricao:
      "Transforme documentos físicos em processos digitais organizados, com acesso rápido, versionamento e validação jurídica. Mais controle, menos extravio e zero dependência de papel.",
  },
  {
    img: "/image/agilidade_processos.png",
    titulo: "Processos que andam sozinhos",
    subtitulo: "Automação de fluxos e protocolo digital",
    descricao:
      "Crie, acompanhe e finalize processos em tempo real. Com fluxos automatizados, responsáveis definidos e rastreabilidade completa, sua gestão ganha velocidade e previsibilidade.",
  },
  {
    img: "/image/implementacao_suporte.png",
    titulo: "Implantação rápida, sem travar a rotina",
    subtitulo: "Onboarding completo para sua equipe",
    descricao:
      "Implementamos a NotPaper de forma simples e assistida, com treinamento e suporte contínuo. Sua equipe aprende rápido e começa a usar desde o primeiro dia.",
  },
  {
    img: "/image/dados_protegidos.png",
    titulo: "Segurança jurídica e proteção de dados",
    subtitulo: "Conformidade com LGPD e validade legal",
    descricao:
      "Todos os processos contam com assinatura eletrônica válida, trilha de auditoria e armazenamento seguro. Transparência e proteção para a gestão e para o cidadão.",
  },
  {
    img: "/image/economia_sustentabilidade.png",
    titulo: "Reduza custos e ganhe eficiência",
    subtitulo: "Menos papel, menos desperdício",
    descricao:
      "Diminua gastos com impressão, armazenamento e logística. Ganhe espaço, tempo e eficiência, enquanto contribui com a sustentabilidade da sua cidade.",
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
