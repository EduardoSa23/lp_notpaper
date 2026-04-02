"use client";

import { useEffect, useState } from "react";
import { FaCity, FaFileInvoiceDollar, FaRobot } from "react-icons/fa6";
import RotatingText from "../../animate/TextAnimations/RotatingText/RotatingText";

const serviceCards = [
  {
    id: "ged",
    title: "GED: documentos organizados e seguros",
    color: "bg-blue-100 text-blue-600",
    icon: FaFileInvoiceDollar,
    text: "Chega de arquivos perdidos e versões duplicadas. Tudo digital, rastreável e com validade jurídica.",
    bullets: ["Digitalização com validade jurídica.", "Assinatura digital e eletrônica.", "Busca inteligente e acesso imediato."],
    dot: "bg-blue-500",
  },
  {
    id: "automacao",
    title: "Automação: processos que fluem sozinhos",
    color: "bg-orange-100 text-orange-600",
    icon: FaRobot,
    text: "Pare de depender de e-mails, planilhas e controles manuais. Automatize e acompanhe tudo em tempo real.",
    bullets: ["Workflow", "BPMN", "ECM", "IA (Inteligência Artificial)"],
    dot: "bg-[#0043FE]",
  },
  {
    id: "app",
    title: "APP Sua Cidade: serviços na palma da mão",
    color: "bg-purple-100 text-purple-600",
    icon: FaCity,
    text: "Leve a prefeitura para perto do cidadão. Mais acesso, mais transparência, mais eficiência.",
    bullets: ["Marketplace local", "Bolsa de empregos", "Carta de serviços digital", "Comunicação Social, canal direto com o cidadão"],
    dot: "bg-purple-500",
  },
];

export default function RecursosPoderosos() {
  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("#services .card"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedCards((prev) => [...new Set([...prev, entry.target.id])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="relative pb-12 pt-12 md:pb-16 md:pt-20 section-anchor overflow-hidden">
      <video autoPlay loop muted playsInline aria-hidden="true" tabIndex={-1} className="absolute inset-0 w-full h-full object-cover">
        <source src="/videos/bg_recursos_poderosos.mp4" type="video/mp4" />
        <track src="/videos/decorative-captions.vtt" kind="captions" srcLang="pt-BR" label="Português" />
      </video>
      <div className="absolute inset-0 bg-black/55 -z-10" />

      <div className="relative container mx-auto px-4">
        <div className="mb-8 text-center md:mb-16">
          <h2 className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 text-3xl md:text-5xl font-bold text-white">
            Recursos
            <RotatingText
              texts={["Poderosos", "Inteligentes", "Robustos", "Completos"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-[#0348FC] text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-100">Descubra como nosso sistema pode mudar a forma como você trabalha</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                id={card.id}
                key={card.id}
                className={`card rounded-2xl border border-gray-100 bg-white px-2 py-4 md:p-8 shadow-lg transition-shadow hover:shadow-xl ${
                  animatedCards.includes(card.id) ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">{card.title}</h3>
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${card.color}`}>
                    <Icon className="h-10 w-10" />
                  </div>
                </div>
                <p className="mb-6 text-gray-600">{card.text}</p>
                <ul className="space-y-2 text-gray-600">
                  {card.bullets.map((item) => (
                    <li key={item} className="flex items-center">
                      <span className={`mr-3 h-2 w-2 rounded-full ${card.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
