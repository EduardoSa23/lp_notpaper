$(document).ready(function () {
  const cardsDiferenca = [
    {
      img: "./image/digitalizacao_documentos.png",
      titulo: "Adeus ao Papel, Olá à Eficiência",
      subtitulo: "Digitalização",
      descricao:
        "A inPrint Prime revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
    },
    {
      img: "./image/agilidade_processos.png",
      titulo: "Agilidade que Transforma o Serviço",
      subtitulo: "Processos Ágeis",
      descricao:
        "Reduza drasticamente o tempo de tramitação de documentos e processos. A inPrint Prime acelera as etapas, permite o acompanhamento em tempo real e agiliza a tomada de decisões, resultando em um processo mais rápido e eficaz.",
    },
    {
      img: "./image/implementacao_suporte.png",
      titulo: "Implantação Simples",
      subtitulo: "Parceria Completa",
      descricao:
        "Nossa equipe garante uma implantação rápida e sem complicações, com treinamento completo para sua equipe. Conte com suporte técnico especializado e contínuo para que sua prefeitura aproveite ao máximo todos os recursos da inPrint Prime.",
    },
    {
      img: "./image/dados_protegidos.png",
      titulo: "Segurança e Conformidade Garantidas",
      subtitulo: "Dados Protegidos",
      descricao:
        "Com a inPrint Prime, a segurança dos seus dados é prioridade. Nosso sistema garante a integridade e confidencialidade das informações, com trilhas de auditoria completas e conformidade com a LGPD, assegurando a validade jurídica de cada processo.",
    },
    {
      img: "./image/economia_sustentabilidade.png",
      titulo: "Economia e Sustentabilidade de Mãos Dadas",
      subtitulo: "Digitalização",
      descricao:
        "A inPrint Prime revoluciona a gestão pública, eliminando o uso de papel em todos os processos da sua prefeitura. Do protocolo à assinatura, tudo é digital, organizado e acessível, otimizando o fluxo de trabalho e reduzindo a burocracia.",
    },
  ];

  // Render dos cards
  const container = $(".carousel-diferenca");
  cardsDiferenca.forEach((card) => {
    container.append(`
      <div class="card-diferanca bg-white rounded-[30px] shadow border border-gray-200 max-w-[100%] md:max-w-5xl">
        <img src="${card.img}" class="mb-4 w-full">
        <h3 class="font-bold text-lg text-center">${card.titulo}</h3>
        <h4 class="text-center font-semibold my-4">${card.subtitulo}</h4>
        <p class="text-sm text-gray-600 p-6">${card.descricao}</p>
      </div>
    `);
  });

  const containerMobile = $(".carousel-diferenca-mobile");
  cardsDiferenca.forEach((card) => {
    containerMobile.append(`
      <div class="card-diferanca-mobile bg-white rounded-[30px] shadow border border-gray-200 max-w-[100%] md:max-w-5xl">
        <img src="${card.img}" class="mb-4 w-full">
        <h3 class="font-bold text-lg text-center">${card.titulo}</h3>
        <h4 class="text-center font-semibold my-4">${card.subtitulo}</h4>
        <p class="text-sm text-gray-600 p-6">${card.descricao}</p>
      </div>
    `);
  });

  const track = $(".carousel-diferenca");
  const cards = $(".card-diferanca");
  let index = 0;

<<<<<<< Updated upstream
  function isDesktop() {
    return $(window).width() > 768;
  }

=======
>>>>>>> Stashed changes
  function moveCarouselDesktop() {
    if (isDesktop()) {
      track.css("transform", `translateX(${-index * 350}px)`);
    } else {
      track.css("transform", "none");
    }
  }

  $("#next").click(function () {
    if (!isDesktop()) return;
    if (index < cards.length - 2) {
      index++;
    } else {
      index = 0;
    }
    track.css("transition", "transform 0.6s ease");
    moveCarouselDesktop();
  });

  $("#prev").click(function () {
    if (!isDesktop()) return;
    if (index > 0) {
      index--;
    } else {
      index = cards.length - 2;
    }
    track.css("transition", "transform 0.6s ease");
    moveCarouselDesktop();
  });

  if (isDesktop()) {
    setInterval(function () {
      $("#next").click();
    }, 15000);
  }
<<<<<<< Updated upstream

  $(window).resize(function () {
    moveCarouselDesktop();
  });

  moveCarouselDesktop();
});
=======
});
>>>>>>> Stashed changes
