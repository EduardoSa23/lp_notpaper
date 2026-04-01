"use client";

import { useRef, useState } from "react";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";
import { notpaperItems } from "@/data/notpaper-items";

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
      <div className="container mx-auto py-4 md:py-24 px-4 md:px-6 flex flex-col justify-center">
        <header className="max-w-[780px] mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 01</p>
          <SplitText
            text="notPaper - Gestão de processos e protocolos digitais"
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
            Tudo que sua gestão precisa para operar com eficiência, controle e transformação digital real.
          </p>
        </header>

        <div className="ajuste-grid grid lg:grid-cols-2 gap-8 items-center">
          <aside ref={ref} className={`${isVisible ? "animate-blur-in-left" : "opacity-0"}`}>
            {" "}
            <h3 className="pb-5 text-center text-lg md:text-2xl font-semibold text-slate-600">Confira todas as nossas funcionalidades.</h3>
            <nav aria-label="Passos">
              <ul className="flex flex-wrap w-full border-2 border-white bg-gradient-to-br from-slate-800 to-slate-700 p-4 rounded-2xl shadow-2xl gap-4 items-center md:items-start">
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
                      className={`flex items-center px-4 py-2 border border-white rounded-xl cursor-pointer transition-all duration-300
                        
                        ${isActive ? "bg-white shadow-2xl text-[#36415e]" : "bg-transparent text-white hover:-translate-y-1 hover:shadow-2xl"}
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
            className={`${
              isVisible ? "animate-blur-in-right" : "opacity-0"
            } w-full h-full flex flex-col lg:min-h-[610px] justify-between rounded-2xl shadow-2xl overflow-hidden
            bg-[radial-gradient(circle,_#2b2eed_0%,_#424750_70%)]`}
          >
            <div className="px-6 py-8 md:px-10 md:py-12">
              <h4 className="text-xl md:text-2xl text-center text-white mb-4 font-semibold">{active.title}</h4>

              <p className="text-sm md:text-base text-gray-200 text-center leading-relaxed">{active.description}</p>
            </div>

            <div className="relative">
              <img src="/image/modelo_teste_site.png" alt="Preview sistema" className="w-full h-auto object-cover" />

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
                    className={`absolute z-10 ${positions[index]} 
                    text-[7px] md:text-[12px] p-2 max-w-[320px] md:max-w-[300px] 
                    bg-white shadow-2xl rounded-lg
                    transition-all duration-500 animate-fade-in-up`}
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


