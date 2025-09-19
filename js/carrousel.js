$(document).ready(function () {
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
