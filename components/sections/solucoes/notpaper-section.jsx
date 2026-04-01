"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";
import { notpaperItems } from "@/data/notpaper-items";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

export default function SolucoesNotpaperSection() {
  const { ref, isVisible } = useInView();

  const items = notpaperItems;

  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];
  const contentRef = useRef(null);
  const scrollToContent = () => {
    if (contentRef.current) {
      const elementPosition = contentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full">
      <div className="container mx-auto flex flex-col justify-center px-4 py-4 md:px-6 md:py-24">
        <header className="mb-6 max-w-[780px]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 01</p>
          <SplitText
            text="notPaper - Gestão de processos e protocolos digitais"
            className="mt-3 text-4xl font-bold leading-tight md:min-h-[105px] md:text-5xl"
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
            Tudo que sua gestão precisa para operar com eficiência, controle e transformação digital real.
          </p>
        </header>

        <div className="ajuste-grid grid items-center gap-8 lg:grid-cols-2">
          <aside ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"}`}>
            <h3 className="pb-5 text-center text-lg font-semibold text-slate-600 md:text-2xl">Confira todas as nossas funcionalidades.</h3>
            <nav aria-label="Passos">
              <ul className="flex w-full flex-wrap items-center gap-4 rounded-2xl border-2 border-white bg-gradient-to-br from-slate-800 to-slate-700 p-4 shadow-2xl md:items-start">
                {items.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <li
                      key={item.step}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      onClick={() => {
                        setActiveIndex(index);

                        if (window.innerWidth < 1280) {
                          setTimeout(() => {
                            scrollToContent();
                          }, 100);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveIndex(index);
                        }
                      }}
                      className={`flex cursor-pointer items-center rounded-xl border border-white px-4 py-2 transition-all duration-300
                        ${isActive ? "bg-white text-[#36415e] shadow-2xl" : "bg-transparent text-white hover:-translate-y-1 hover:shadow-2xl"}
                      `}
                    >
                      <p className="text-sm md:text-base">{item.menuTitle}</p>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div
            ref={contentRef}
            className={`${isVisible ? "animate-blur-in-right" : "opacity-0"} flex max-h-full flex-col justify-between overflow-hidden rounded-2xl bg-[radial-gradient(circle,_#2b2eed_0%,_#424750_70%)] shadow-2xl lg:min-h-[610px]`}
          >
            <div className="px-6 py-8 md:px-10 md:py-12">
              <h4 className="mb-4 text-center text-xl font-semibold text-white md:text-2xl">{active.title}</h4>

              <p className="text-center text-sm leading-relaxed text-gray-200 md:text-base">{active.description}</p>
            </div>

            <div className="relative">
              <Image
                src="/image/modelo_teste_site.png"
                alt="Preview sistema"
                width={1400}
                height={820}
                className="max-w-full object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                style={{ width: "100%", height: "auto" }}
              />

              {active.highlights.map((item, index) => {
                const positions = [
                  "top-[-20px] md:-top-4 left-2",
                  "top-[35px] md:top-[30px] right-4",
                  "top-[90px] md:top-[150px] left-[30px] md:left-[20px]",
                  "top-[143px] md:top-[250px] right-[20px]",
                ];

                return (
                  <div
                    key={index}
                    className={`absolute z-10 ${positions[index]} rounded-lg bg-white p-2 text-[7px] shadow-2xl transition-all duration-500 animate-fade-in-up md:max-w-[300px] md:text-[12px] max-w-[320px]`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <strong>
                      {index + 1}. {item.title}:
                    </strong>{" "}
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
