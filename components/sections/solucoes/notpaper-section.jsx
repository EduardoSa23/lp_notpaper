"use client";

import { useRef } from "react";
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
        highlights: [
          {
            title: "Controle de numeração de protocolo",
            text: "Possibilidade de controlar e rastrear cada documento enviado ou recebido com um número único de protocolo.",
          },
          {
            title: "Registro de criação",
            text: "Registro das informações sobre a data e o autor do memorando, permitindo o acompanhamento do histórico e a identificação do responsável.",
          },
          {
            title: "Destaque de assuntos",
            text: "Opção de destacar um assunto específico em um memorando e enviá-lo para usuários, departamentos e secretarias selecionados, garantindo uma comunicação direcionada.",
          },
          {
            title: "Anexo de documentos",
            text: "Capacidade de anexar múltiplos documentos em um memorando, facilitando o compartilhamento de informações relevantes.",
          },
        ],
      },
      {
        step: "2",
        menuTitle: "Circulares Oficiais",
        title: "Circulares Oficiais",
        description:
          "Padronize o envio de comunicados para múltiplos destinatários com controle de leitura e histórico completo, garantindo que a informação chegue com clareza e segurança.",
        highlights: [
          {
            title: "Comunicado direcionado",
            text: "Possibilidade de enviar a Circular para um setor ou grupo de trabalho específico, garantindo que a mensagem seja direcionada aos destinatários corretos.",
          },
          {
            title: "Validade da Circular",
            text: "Definição de uma data limite para a Circular, determinando sua validade nas caixas de entrada dos servidores e finalizando automaticamente.",
          },
          {
            title: "Anexo de documentos",
            text: "Capacidade de anexar documentos a Circular, fornecendo embasamento ou possibilidade de análise aos participantes.",
          },
          {
            title: "Assinatura digital",
            text: "Possibilidade de assinar o documento gerado com certificado digital ou assinatura eletrônica, tanto internamente no fluxo quanto solicitando a assinatura de colaboradores externos por e-mail.",
          },
        ],
      },
      {
        step: "3",
        menuTitle: "Cadastro e Protocolo de Serviços",
        title: "Cadastro e Protocolo de Serviços",
        description:
          "Estruture o atendimento ao cidadão com registro formal de solicitações, acompanhamento em tempo real e organização dos fluxos de atendimento.",
        highlights: [
          {
            title: "Centralização e Orquestração de Processos",
            text: "Possibilidade de controlar e rastrear cada documento enviado ou recebido com um número único de protocolo.",
          },
          {
            title: "Modelagem e Execução de Fluxos (BPMN 2.0)",
            text: "Estrutura processos de ponta a ponta com definição de papéis, responsabilidades, prazos e regras de negócio, utilizando padrões BPMN 2.0 para garantir rastreabilidade, governança e previsibilidade operacional.",
          },
          {
            title: "Governança e Integridade da Informação",
            text: "Implementa controle de obrigatoriedade de dados e documentos por etapa, assegurando consistência das informações, redução de retrabalho e conformidade documental ao longo de todo o ciclo do processo.",
          },
          {
            title: "Automação e Geração de Artefatos",
            text: "Utiliza formulários estruturados para automação da geração de documentos oficiais (certidões, alvarás, licenças, entre outros), promovendo eficiência operacional, padronização e redução de tempo de resposta ao cidadão.",
          },
        ],
      },
      {
        step: "4",
        menuTitle: "Ofícios e Atos Oficiais",
        title: "Ofícios e Atos Oficiais",
        description:
          "Emita e gerencie documentos oficiais com padronização, controle e validade jurídica, mantendo histórico completo das comunicações institucionais.",
        highlights: [
          {
            title: "Gestão Estruturada de Atos Oficiais",
            text: "Permite a criação, edição e armazenamento de processos baseados em diferentes tipos de Atos Oficiais, como normativos, declaratórios, enunciativos, de correspondência e pactos, todos organizados em fluxos previamente definidos no sistema.",
          },
          {
            title: "Fluxos de Aprovação e Assinatura",
            text: "Implementa workflows completos para elaboração, revisão, aprovação e assinatura de documentos, garantindo controle de versões, padronização e conformidade nos trâmites institucionais.",
          },
          {
            title: "Comunicação e Rastreabilidade",
            text: "Viabiliza o envio de ofícios por e-mail com controle de entrega, leitura e confirmação de recebimento, assegurando rastreabilidade completa e maior transparência nas comunicações entre órgãos, entidades e terceiros.",
          },
          {
            title: "Repositório Seguro e Governança Documental",
            text: "Centraliza todos os documentos e processos em um ambiente seguro, com fácil consulta e organização de históricos, permitindo gestão eficiente, preservação das informações e suporte à tomada de decisão.",
          },
        ],
      },
      {
        step: "5",
        menuTitle: "Ouvidoria integrada ao Fala.br",
        title: "Ouvidoria integrada ao Fala.br",
        description:
          "Integre sua ouvidoria ao Fala.br, garantindo transparência, controle e atendimento conforme as diretrizes do governo federal.",
        highlights: [
          {
            title: "Conformidade com a Lei nº 13.460/2017",
            text: "Atende integralmente às diretrizes da Lei nº 13.460/2017, garantindo a implementação de ouvidorias como canal oficial de comunicação entre o cidadão e a administração pública, assegurando transparência e cumprimento das obrigações legais.",
          },
          {
            title: "Canal Estruturado de Comunicação com o Cidadão",
            text: "Disponibiliza um ambiente digital para registro e gestão de manifestações como solicitações, sugestões, elogios e reclamações, fortalecendo a participação social e a escuta ativa na gestão pública.",
          },
          {
            title: "Automação e Tramitação Inteligente",
            text: "Realiza o encaminhamento automático das demandas para os setores responsáveis, com controle de prazos, status e histórico completo, garantindo maior agilidade, rastreabilidade e eficiência no atendimento.",
          },
          {
            title: "Segurança, Auditoria e Inteligência de Dados",
            text: "Assegura privacidade das informações, registro detalhado de todas as etapas do processo e geração de indicadores estratégicos, permitindo análise de dados, controle da gestão e tomada de decisão orientada por evidências.",
          },
        ],
      },
      {
        step: "6",
        menuTitle: "Configuração de Fluxos",
        title: "Configuração de Fluxos",
        description:
          "Modele e automatize processos com definição de etapas, responsáveis e regras claras, garantindo eficiência e padronização operacional.",
        highlights: [
          {
            title: "Administrativos",
            text: "Processos internos da organização, como RH, compras, jurídico, etc.",
          },
          {
            title: "Carta de Serviços",
            text: "Solicitações dos munícipes feitas diretamente na Carta de serviços, pelo site ou aplicativo.",
          },
          {
            title: "Ouvidoria",
            text: "Registro e tratamento de manifestações dos munícipes, para uma gestão eficiente das demandas.",
          },
          {
            title: "E-SIC",
            text: "Registro e tratamento de pedidos de acesso à informação através do Sistema Eletrônico de informações ao cidadão.",
          },
        ],
      },
      {
        step: "7",
        menuTitle: "Inteligência Artificial",
        title: "Inteligência Artificial",
        description:
          "Aplique inteligência artificial para automatizar tarefas repetitivas, analisar dados e apoiar decisões com mais agilidade e precisão.",
        highlights: [
          {
            title: "Inteligência Artificial",
            text: "Utilização de IA para auxiliar na composição do memorando, oferecendo sugestões e melhorando a eficiência na redação.",
          },
          {
            title: "Assinatura digital",
            text: "Possibilidade de assinar digitalmente documentos dentro da plataforma e com assinantes externos, garantindo autenticidade e validade dos documentos, agilizando o processo de tramitação.",
          },
          {
            title: "Registro de tramitação",
            text: "Registro de todas as etapas da tramitação do memorando, incluindo anexos e despachos proferidos, permitindo o acompanhamento de todas as ações realizadas.",
          },
          {
            title: "Finalização do processo",
            text: "Apenas o gerador da Comunicação Interna pode finalizá-la, garantindo o atendimento da mesma e evitando perda de informações no meio dos processos.",
          },
        ],
      },
      {
        step: "8",
        menuTitle: "Workflow Customizável",
        title: "Workflow Customizável",
        description:
          "Crie fluxos personalizados sem depender de desenvolvimento complexo, adaptando o sistema às necessidades específicas da sua operação.",
        highlights: [
          {
            title: "Automação e Orquestração de Processos",
            text: "Permite automatizar e gerenciar fluxos de trabalho administrativos e operacionais, como Compras e Licitações, com definição de regras, etapas e responsáveis, garantindo maior eficiência e padronização das rotinas.",
          },
          {
            title: "Modelagem Padrão BPMN 2.0",
            text: "Utiliza o padrão internacional BPMN (Business Process Model and Notation) para modelagem e execução dos processos, assegurando consistência, interoperabilidade e aderência às melhores práticas de mercado.",
          },
          {
            title: "Flexibilidade e Evolução Contínua",
            text: "Adota uma abordagem modular e configurável, possibilitando ajustes dinâmicos nos fluxos, melhoria contínua dos processos e adaptação às necessidades específicas da gestão pública.",
          },
          {
            title: "Monitoramento, Controle e Eficiência Operacional",
            text: "Disponibiliza acompanhamento em tempo real das etapas, controle de prazos e notificações automáticas, permitindo identificação de gargalos, aumento da produtividade e maior transparência na execução dos processos.",
          },
        ],
      },
      {
        step: "9",
        menuTitle: "Registro de Atas",
        title: "Registro de Atas",
        description: "Registre e organize atas de reuniões com segurança, histórico e fácil acesso, garantindo transparência e governança.",
        highlights: [
          {
            title: "Registro Digital de Atas",
            text: "Permite a criação, edição e armazenamento de atas de sessões, pregões e eventos institucionais em ambiente digital, garantindo padronização e organização dos registros oficiais.",
          },
          {
            title: "Estruturação e Formalização das Informações",
            text: "Disponibiliza campos estruturados para inserção de dados essenciais, como data, horário, local, pauta e deliberações, assegurando consistência e integridade das informações registradas.",
          },
          {
            title: "Assinatura Eletrônica com Validade Jurídica",
            text: "Viabiliza a assinatura eletrônica dos documentos conforme a legislação vigente, garantindo autenticidade, validade jurídica e segurança no processo de formalização das atas.",
          },
          {
            title: "Eficiência Operacional e Governança Documental",
            text: "Elimina a necessidade de processos físicos, promovendo agilidade na geração e tramitação das atas, além de assegurar armazenamento seguro, rastreabilidade e fácil acesso aos registros.",
          },
        ],
      },
      {
        step: "10",
        menuTitle: "Licitação e Compras",
        title: "Licitação e Compras",
        description: "Gerencie processos licitatórios com controle de etapas, documentos e conformidade com a legislação vigente.",
        highlights: [
          {
            title: "Gestão de Processos de Compras e Licitação",
            text: "Permite a condução estruturada de processos de aquisição pública, contemplando diferentes modalidades como licitação, dispensa e inexigibilidade, com definição clara do rito processual.",
          },
          {
            title: "Controle de Etapas e Conformidade",
            text: "Gerencia todas as fases do processo com inclusão progressiva de documentos obrigatórios, garantindo aderência às exigências legais e conformidade documental em cada etapa.",
          },
          {
            title: "Gestão de Prazos e Execução",
            text: "Assegura o acompanhamento dos prazos legais e operacionais, evitando atrasos e garantindo que o fluxo processual seja executado de forma eficiente e dentro dos parâmetros normativos.",
          },
          {
            title: "Rastreabilidade e Governança",
            text: "Proporciona visibilidade completa do processo, com registro de todas as ações, histórico das etapas e organização centralizada das informações, fortalecendo a transparência e a governança pública.",
          },
        ],
      },
      {
        step: "11",
        menuTitle: "Empenho e Liquidação",
        title: "Empenho e Liquidação",
        description: "Acompanhe a execução financeira com controle de empenhos e liquidações integrados aos processos administrativos.",
        highlights: [
          {
            title: "Gestão Integrada de Empenho e Liquidação",
            text: "Centraliza o controle da execução orçamentária, integrando processos de compras, contratos e finanças, permitindo o acompanhamento completo desde o empenho até a liquidação e pagamento.",
          },
          {
            title: "Controle de Contratos e Execução Financeira",
            text: "Possibilita o monitoramento do consumo contratual em tempo real, com controle por percentual de utilização, apoiando a correta alocação de despesas e evitando extrapolação de valores.",
          },
          {
            title: "Tramitação e Controle por Etapas",
            text: "Gerencia o fluxo completo entre os departamentos envolvidos, como compras, contabilidade e auditoria, incluindo registro de notas fiscais, anexação de documentos e acompanhamento de cada fase do processo.",
          },
          {
            title: "Rastreabilidade, Auditoria e Conformidade",
            text: "Assegura transparência total por meio do registro detalhado das operações, facilitando auditorias, garantindo conformidade com normas legais e promovendo maior controle sobre os recursos públicos.",
          },
        ],
      },
      {
        step: "12",
        menuTitle: "Gestão de Contratos",
        title: "Gestão de Contratos",
        description: "Centralize contratos com controle de prazos, aditivos e obrigações, reduzindo riscos e aumentando a governança.",
        highlights: [
          {
            title: "Gestão Centralizada de Contratos",
            text: "Centraliza o gerenciamento de contratos administrativos em um único ambiente, permitindo controle unificado das informações, vigências, valores e vínculos com processos de compras e execução orçamentária.",
          },
          {
            title: "Controle Financeiro e Percentual de Utilização",
            text: "Disponibiliza acompanhamento em tempo real do consumo contratual, com indicadores de percentual utilizado, garantindo melhor alocação de recursos e estratégias de extrapolações orçamentárias.",
          },
          {
            title: "Integração com Execução Orçamentária",
            text: "Integra contratos aos processos de empenho e liquidação, permitindo rastrear a utilização dos recursos inclusive verbas estaduais e federais assegurando conformidade na aplicação financeira.",
          },
          {
            title: "Governança, Previsibilidade e Tomada de Decisão",
            text: "Fornece dados consolidados e alertas preventivos que ampliam a capacidade de decisão dos gestores, promovendo disciplina orçamentária, previsibilidade financeira e uso eficiente dos recursos públicos.",
          },
        ],
      },
      {
        step: "13",
        menuTitle: "Relatórios e Dashboards",
        title: "Relatórios e Dashboards",
        description: "Tenha visão estratégica com dashboards e relatórios em tempo real para tomada de decisão baseada em dados.",
        highlights: [
          {
            title: "Monitoramento Estratégico de Processos",
            text: "Disponibiliza dashboards gerenciais com visão consolidada dos processos, permitindo acompanhamento em tempo real do andamento, volume de demandas e status das atividades.",
          },
          {
            title: "Relatórios Analíticos por Dimensão",
            text: "Oferece relatórios detalhados por fluxo, setor e usuário, possibilitando análise segmentada dos processos, visualização de despachos, anexos e distribuição das responsabilidades.",
          },
          {
            title: "Controle de Prazos e Desempenho",
            text: "Permite identificar processos dentro e fora do prazo, com relatórios de acompanhamento que auxiliam na gestão de SLAs, priorização de demandas e melhoria da eficiência operacional.",
          },
          {
            title: "Auditoria e Inteligência Operacional",
            text: "Disponibiliza relatórios de atividades por usuário, garantindo rastreabilidade completa das ações, suporte à auditoria e geração de insights para tomada de decisão orientada por dados.",
          },
        ],
      },
      {
        step: "14",
        menuTitle: "Cadastro de Obras",
        title: "Cadastro de Obras",
        description: "Gerencie processos de obras e licenciamento com integração a sistemas oficiais, garantindo controle e conformidade.",
        highlights: [
          {
            title: "Gestão Completa do Processo de Obras",
            text: "Centraliza solicitações de obras com tramitação automática entre setores, garantindo controle e conformidade em todas as etapas.",
          },
          {
            title: "Automação de Fluxos",
            text: "Roteamento inteligente com regras, prazos e notificações automáticas, reduzindo gargalos e padronizando processos.",
          },
          {
            title: "Análise e Versionamento",
            text: "Permite análise de projetos (PDF/DWG), comentários técnicos e controle de versões durante todo o fluxo.",
          },
          {
            title: "Integração e Documentos",
            text: "Integra com sistemas externos e gera documentos automaticamente com assinatura digital e validade jurídica.",
          },
        ],
      },
      {
        step: "15",
        menuTitle: "Gestão de Diárias",
        title: "Gestão de Diárias",
        description: "Controle solicitações, aprovações e prestação de contas de diárias com transparência e rastreabilidade.",
        highlights: [
          {
            title: "Controle de numeração de protocolo",
            text: "Possibilidade de controlar e rastrear cada documento enviado ou recebido com um número único de protocolo.",
          },
          {
            title: "Registro de criação",
            text: "Registro das informações sobre a data e o autor do memorando, permitindo o acompanhamento do histórico e a identificação do responsável.",
          },
          {
            title: "Destaque de assuntos",
            text: "Opção de destacar um assunto específico em um memorando e enviá-lo para usuários, departamentos e secretarias selecionados, garantindo uma comunicação direcionada.",
          },
          {
            title: "Anexo de documentos",
            text: "Capacidade de anexar múltiplos documentos em um memorando, facilitando o compartilhamento de informações relevantes.",
          },
        ],
      },
      {
        step: "16",
        menuTitle: "Certidões e Declarações",
        title: "Certidões e Declarações",
        description:
          "Emita documentos personalizados diretamente pelos protocolos, automatizando processos e reduzindo o tempo de atendimento.",
        highlights: [
          {
            title: "Automação com RPA",
            text: "Emissão automatizada de certidões por meio de RPA, eliminando processos manuais e reduzindo erros operacionais. O robô executa coleta, validação e geração de documentos sem intervenção humana.",
          },
          {
            title: "Eficiência Operacional",
            text: "Redução do tempo médio de emissão de aproximadamente 20 para 4 minutos. Aumenta significativamente a produtividade e a agilidade no atendimento das demandas.",
          },
          {
            title: "Conformidade e Segurança",
            text: "Processos estruturados conforme a Lei nº 14.133/2021, garantindo aderência legal. Validações automáticas asseguram confiabilidade e segurança jurídica nas operações.",
          },
          {
            title: "Rastreabilidade e Governança",
            text: "Registro completo de todas as ações realizadas durante o processo. Garante transparência, facilidade de auditoria e maior controle da gestão pública.",
          },
        ],
      },
      {
        step: "17",
        menuTitle: "Aplicativo do Cidadão",
        title: "Aplicativo do Cidadão",
        description:
          "Conecte munícipes, turistas e servidores em um único aplicativo com acesso a serviços públicos e informações relevantes.",
        highlights: [
          {
            title: "Canal Unificado com o Cidadão",
            text: "Aplicativo centraliza a comunicação entre cidadãos e gestão pública em um único ambiente digital. Facilita o acesso a serviços e fortalece o relacionamento com a população.",
          },
          {
            title: "Solicitação de Serviços",
            text: "Permite abertura de demandas diretamente pelo app, de forma simples e intuitiva. Atende desde solicitações operacionais até processos administrativos mais complexos",
          },
          {
            title: "Agilidade no Atendimento",
            text: "Digitaliza o fluxo de solicitações, reduzindo tempo de resposta e eliminando burocracia. Garante mais eficiência na execução e acompanhamento dos serviços públicos.",
          },
          {
            title: "Gestão e Acompanhamento",
            text: "Possibilita o monitoramento das demandas em tempo real, com rastreabilidade completa. Oferece mais transparência e controle para cidadãos e gestores.",
          },
        ],
      },
      {
        step: "18",
        menuTitle: "Carta de Serviços",
        title: "Carta de Serviços",
        description: "Disponibilize de forma clara todos os serviços públicos com prazos, requisitos e orientações para o cidadão.",
        highlights: [
          {
            title: "Transparência dos Serviços",
            text: "Centraliza e apresenta todos os serviços públicos de forma clara e organizada. Facilita o acesso à informação e melhora a comunicação com o cidadão.",
          },
          {
            title: "Solicitação Digital",
            text: "Permite que o cidadão solicite serviços de qualquer lugar, sem deslocamento. Proporciona mais comodidade e amplia o acesso aos serviços públicos.",
          },
          {
            title: "Parametrização Inteligente",
            text: "Cada serviço é configurado com regras, variáveis e documentos obrigatórios. Evita devoluções por inconsistência de dados e padroniza o atendimento.",
          },
          {
            title: "Eficiência no Atendimento",
            text: "Garante maior agilidade no processamento das demandas. Reduz retrabalho e melhora a qualidade da prestação de serviços.",
          },
        ],
      },
      {
        step: "19",
        menuTitle: "E-SIC e Ouvidoria",
        title: "E-SIC e Ouvidoria",
        description: "Atenda solicitações de informação e manifestações com transparência, controle e conformidade legal.",
        highlights: [
          {
            title: "Canal de Comunicação Oficial",
            text: "Centraliza a Ouvidoria e o E-SIC como canais diretos entre cidadão e administração pública. Facilita o registro e tratamento de manifestações e solicitações de informação.",
          },
          {
            title: "Gestão de Manifestações",
            text: "Recebe, classifica e encaminha automaticamente demandas como reclamações, denúncias e sugestões. Garante tramitação interna eficiente e retorno adequado ao cidadão.",
          },
          {
            title: "Acesso à Informação (E-SIC)",
            text: "Atende solicitações conforme a Lei nº 12.527/2011 (LAI), assegurando acesso a dados públicos. Promove transparência ativa e passiva na gestão pública.",
          },
          {
            title: "Transparência e Controle Social",
            text: "Permite acompanhamento das demandas e respostas em tempo real. Fortalece a participação cidadã e a governança pública orientada a dados.",
          },
        ],
      },
      {
        step: "20",
        menuTitle: "Agendamento e Marketplace",
        title: "Agendamento e Marketplace",
        description:
          "Ofereça agendamento online e um ambiente digital para serviços e iniciativas locais, melhorando a experiência do cidadão.",
        highlights: [
          {
            title: "Marketplace Local",
            text: "Ambiente digital que reúne estabelecimentos e serviços da cidade em um único canal. Permite divulgação, interação com clientes e fomenta a economia local.",
          },
          {
            title: "Agendamento de Serviços",
            text: "Possibilita o agendamento de consultas médicas e atendimentos públicos diretamente pelo app. Organiza filas, reduz tempo de espera e melhora a gestão dos atendimentos.",
          },
          {
            title: "Bolsa de Empregos",
            text: "Espaço dedicado à divulgação de vagas e oportunidades de trabalho na região. Conecta cidadãos e empresas, fortalecendo o desenvolvimento econômico local.",
          },
          {
            title: "Turismo e Serviços Públicos",
            text: "Apresenta pontos turísticos e serviços disponíveis no município de forma acessível. Valoriza a cidade e melhora a experiência de moradores e visitantes.",
          },
        ],
      },
    ],
    [],
  );

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
