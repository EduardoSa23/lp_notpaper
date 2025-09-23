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

  const track = $(".carousel-diferenca");
  const cards = $(".card-diferanca");
  let index = 0;

  // --- Movimento centralizado ---
  function moveCarousel() {
    const cardWidth = $(".card-diferanca").outerWidth(true);
    track.css("transform", `translateX(${-index * cardWidth}px)`);
  }

  function moveCarouselDesktop() {
    track.css("transform", `translateX(${-index * 350}px)`);
  }

  // --- Navegação desktop (mantém como estava) ---
  $("#next").click(function () {
    if (index < cards.length - 2) {
      index++;
    } else {
      index = 0;
    }
    track.css("transition", "transform 0.6s ease");
    moveCarouselDesktop();
  });

  $("#prev").click(function () {
    if (index > 0) {
      index--;
    } else {
      index = cards.length - 2;
    }
    track.css("transition", "transform 0.6s ease");
    moveCarouselDesktop();
  });

  // Auto play apenas no desktop
  if ($(window).width() > 768) {
    setInterval(function () {
      $("#next").click();
    }, 15000);
  }

  // ...existing code...
  // ...existing code...
  if ($(window).width() <= 768) {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let isDragging = false;

      track.on("touchstart", function (e) {
          startX = e.originalEvent.touches[0].clientX;
          startY = e.originalEvent.touches[0].clientY;
          currentX = startX;
          currentY = startY;
          isDragging = true;
          track.css("transition", "none");
      });

      track.on("touchmove", function (e) {
          if (!isDragging) return;
          currentX = e.originalEvent.touches[0].clientX;
          currentY = e.originalEvent.touches[0].clientY;
          let diffX = currentX - startX;
          let diffY = currentY - startY;

          // Só previne o scroll se o movimento for mais horizontal que vertical
          if (Math.abs(diffX) > Math.abs(diffY)) {
              e.preventDefault();
              const cardWidth = $(".card-diferanca").outerWidth(true);
              track.css("transform", `translateX(${-index * cardWidth + diffX}px)`);
          }
          // Se for mais vertical, não faz nada (deixa o scroll da página acontecer)
      });

      track.on("touchend", function () {
          isDragging = false;
          track.css("transition", "transform 0.5s ease");

          let diffX = currentX - startX;
          let diffY = currentY - startY;
          const cardWidth = $(".card-diferanca").outerWidth(true);

          // só troca de card se arrastar mais de 1/4 do tamanho e for swipe horizontal
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > cardWidth / 4) {
              if (diffX < 0 && index < cards.length - 1) {
                  index++;
              } else if (diffX > 0 && index > 0) {
                  index--;
              }
          }
          moveCarousel();
      });
  }
// ...existing code...
  // ...existing code...
});
