"use client";

import { useMemo, useState } from "react";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import { useInView } from "@/hooks/useInView";

export default function SolucoesNotpaperSection() {
  const { ref, isVisible } = useInView();

  const items = useMemo(
    () => [
      {
        step: "1",
        menuTitle: "Comunicação Interna & Memorando",
        title: "Comunicação Interna & Memorando",
        description:
          "Centralize a comunicação institucional com envio, registro e acompanhamento de memorandos em um ambiente digital seguro, garantindo rastreabilidade e organização das informações.",
        to: "/",
        image: "/image/memorando.png",
        imageAlt: "Comunicação Interna",
      },
      {
        step: "2",
        menuTitle: "Circulares Oficiais",
        title: "Circulares Oficiais",
        description:
          "Padronize o envio de comunicados para múltiplos destinatários com controle de leitura e histórico completo, garantindo que a informação chegue com clareza e segurança.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Circular",
      },
      {
        step: "3",
        menuTitle: "Cadastro e Protocolo de Serviços",
        title: "Cadastro e Protocolo de Serviços",
        description:
          "Estruture o atendimento ao cidadão com registro formal de solicitações, acompanhamento em tempo real e organização dos fluxos de atendimento.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Protocolos",
      },
      {
        step: "4",
        menuTitle: "Ofícios e Atos Oficiais",
        title: "Ofícios e Atos Oficiais",
        description:
          "Emita e gerencie documentos oficiais com padronização, controle e validade jurídica, mantendo histórico completo das comunicações institucionais.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Ofícios",
      },
      {
        step: "5",
        menuTitle: "Ouvidoria integrada ao Fala.br",
        title: "Ouvidoria integrada ao Fala.br",
        description:
          "Integre sua ouvidoria ao Fala.br, garantindo transparência, controle e atendimento conforme as diretrizes do governo federal.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Ouvidoria",
      },
      {
        step: "6",
        menuTitle: "Configuração de Fluxos",
        title: "Configuração de Fluxos",
        description:
          "Modele e automatize processos com definição de etapas, responsáveis e regras claras, garantindo eficiência e padronização operacional.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Fluxos",
      },
      {
        step: "7",
        menuTitle: "Inteligência Artificial",
        title: "Inteligência Artificial",
        description:
          "Aplique inteligência artificial para automatizar tarefas repetitivas, analisar dados e apoiar decisões com mais agilidade e precisão.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "IA",
      },
      {
        step: "8",
        menuTitle: "Workflow Customizável",
        title: "Workflow Customizável",
        description:
          "Crie fluxos personalizados sem depender de desenvolvimento complexo, adaptando o sistema às necessidades específicas da sua operação.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Workflow",
      },
      {
        step: "9",
        menuTitle: "Registro de Atas",
        title: "Registro de Atas",
        description: "Registre e organize atas de reuniões com segurança, histórico e fácil acesso, garantindo transparência e governança.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Atas",
      },
      {
        step: "10",
        menuTitle: "Licitação e Compras",
        title: "Licitação e Compras",
        description: "Gerencie processos licitatórios com controle de etapas, documentos e conformidade com a legislação vigente.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Licitação",
      },
      {
        step: "11",
        menuTitle: "Empenho e Liquidação",
        title: "Empenho e Liquidação",
        description: "Acompanhe a execução financeira com controle de empenhos e liquidações integrados aos processos administrativos.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Financeiro",
      },
      {
        step: "12",
        menuTitle: "Gestão de Contratos",
        title: "Gestão de Contratos",
        description: "Centralize contratos com controle de prazos, aditivos e obrigações, reduzindo riscos e aumentando a governança.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Contratos",
      },
      {
        step: "13",
        menuTitle: "Relatórios e Dashboards",
        title: "Relatórios e Dashboards",
        description: "Tenha visão estratégica com dashboards e relatórios em tempo real para tomada de decisão baseada em dados.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Dashboards",
      },
      {
        step: "14",
        menuTitle: "Cadastro de Obras",
        title: "Cadastro de Obras",
        description: "Gerencie processos de obras e licenciamento com integração a sistemas oficiais, garantindo controle e conformidade.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Obras",
      },
      {
        step: "15",
        menuTitle: "Gestão de Diárias",
        title: "Gestão de Diárias",
        description: "Controle solicitações, aprovações e prestação de contas de diárias com transparência e rastreabilidade.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Diárias",
      },
      {
        step: "16",
        menuTitle: "Certidões e Declarações",
        title: "Certidões e Declarações",
        description:
          "Emita documentos personalizados diretamente pelos protocolos, automatizando processos e reduzindo o tempo de atendimento.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Certidões",
      },
      {
        step: "17",
        menuTitle: "Aplicativo do Cidadão",
        title: "Aplicativo do Cidadão",
        description:
          "Conecte munícipes, turistas e servidores em um único aplicativo com acesso a serviços públicos e informações relevantes.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "App",
      },
      {
        step: "18",
        menuTitle: "Carta de Serviços",
        title: "Carta de Serviços",
        description: "Disponibilize de forma clara todos os serviços públicos com prazos, requisitos e orientações para o cidadão.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Serviços",
      },
      {
        step: "19",
        menuTitle: "E-SIC e Ouvidoria",
        title: "E-SIC e Ouvidoria",
        description: "Atenda solicitações de informação e manifestações com transparência, controle e conformidade legal.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Transparência",
      },
      {
        step: "20",
        menuTitle: "Agendamento e Marketplace",
        title: "Agendamento e Marketplace",
        description:
          "Ofereça agendamento online e um ambiente digital para serviços e iniciativas locais, melhorando a experiência do cidadão.",
        to: "/",
        image: "/image/modelo_teste_site.png",
        imageAlt: "Agendamento",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

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

        <div className="grid md:grid lg:grid-cols-2 gap-8 items-center">
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
                      onClick={() => setActiveIndex(index)}
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
            className={`${
              isVisible ? "animate-blur-in-right" : "opacity-0"
            } w-full h-full flex flex-col lg:min-h-[610px] justify-between rounded-2xl shadow-2xl overflow-hidden
            bg-[radial-gradient(circle,_#2b2eed_0%,_#424750_70%)]`}
          >
            <div className="px-6 py-8 md:px-10 md:py-12">
              <h4 className="text-xl md:text-2xl text-center text-white mb-4 font-semibold">{active.title}</h4>

              <p className="text-sm md:text-base text-gray-200 text-center leading-relaxed">{active.description}</p>
            </div>

            <img src={active.image} alt={active.imageAlt} className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
