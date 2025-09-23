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
        "Reduza drasticamente o tempo de tramitação dos documentos. A inPrint Prime acelera as etapas...",
    },
    {
      img: "./image/implementacao_suporte.png",
      titulo: "Implantação Simples",
      subtitulo: "Parceria Completa",
      descricao:
        "Nossa equipe garante uma implantação rápida e sem complicações, com treinamento completo...",
    },
    {
      img: "./image/dados_protegidos.png",
      titulo: "Segurança e Conformidade Garantidas",
      subtitulo: "Dados Protegidos",
      descricao:
        "Com a inPrint Prime, a segurança dos seus dados é prioridade. Garantimos a integridade...",
    },
    {
      img: "./image/economia_sustentabilidade.png",
      titulo: "Economia e Sustentabilidade de Mãos Dadas",
      subtitulo: "Digitalização",
      descricao:
        "A inPrint Prime elimina o uso do papel nos processos, garantindo sustentabilidade e eficiência.",
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

  // --- Swipe no mobile ---
  // ...existing code...
  if ($(window).width() <= 768) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    track.on("touchstart", function (e) {
      startX = e.originalEvent.touches[0].clientX;
      currentX = startX;
      isDragging = true;
      track.css("transition", "none");
    });

    track.on("touchmove", function (e) {
      if (!isDragging) return;
      currentX = e.originalEvent.touches[0].clientX;
      let diff = currentX - startX;

      // Só previne o scroll se o movimento for mais horizontal que vertical
      let deltaY = Math.abs(
        e.originalEvent.touches[0].clientY -
          (e.originalEvent.touches[0].clientY || 0)
      );
      if (Math.abs(diff) > deltaY) {
        e.preventDefault();
      }

      const cardWidth = $(".card-diferanca").outerWidth(true);
      track.css("transform", `translateX(${-index * cardWidth + diff}px)`);
    });

    track.on("touchend", function () {
      isDragging = false;
      track.css("transition", "transform 0.5s ease");

      let diff = currentX - startX;
      const cardWidth = $(".card-diferanca").outerWidth(true);

      // só troca de card se arrastar mais de 1/4 do tamanho
      if (Math.abs(diff) > cardWidth / 4) {
        if (diff < 0 && index < cards.length - 1) {
          index++;
        } else if (diff > 0 && index > 0) {
          index--;
        }
      }
      moveCarousel();
    });
  }
  // ...existing code...
});
