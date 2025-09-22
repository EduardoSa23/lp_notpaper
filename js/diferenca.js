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
        <div class="card-diferanca bg-white rounded-[30px] shadow border border-gray-200 max-w-5xl">
          <img src="${card.img}" class="mb-4 w-full">
          <h3 class="font-bold text-lg text-center">${card.titulo}</h3>
          <h4 class="text-center font-semibold my-4">${card.subtitulo}</h4>
          <p class="text-sm text-gray-600 p-6">${card.descricao}</p>
        </div>
      `);
  });

  const track = $(".carousel-diferenca");
  const cards = $(".card-diferanca");
  const cardWidth = $(".card-diferanca").outerWidth(true);
  let index = 0;

  function moveCarousel() {
    track.css("transform", `translateX(${-index * cardWidth}px)`);
  }

  $("#next").click(function () {
    if (index < cards.length - 2) {
      // deixa 2+1 visível
      index++;
    } else {
      index = 0; // volta ao início
    }
    moveCarousel();
  });

  $("#prev").click(function () {
    if (index > 0) {
      index--;
    } else {
      index = cards.length - 2;
    }
    moveCarousel();
  });

  // Auto play
  setInterval(function () {
    $("#next").click();
  }, 115000);
});
