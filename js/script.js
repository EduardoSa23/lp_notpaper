$(document).ready(function() {
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");

    // abre/fecha ao clicar no botão
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
        menu.classList.add("hidden");
        });
    });

    document.addEventListener("click", (e) => {
        if (!menu.classList.contains("hidden") && !menu.contains(e.target) && e.target !== btn) {
        menu.classList.add("hidden");
        }
    });

    // Header background on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('bg-white shadow-lg').removeClass('bg-transparent');
        } else {
            $('header').removeClass('bg-white shadow-lg').addClass('bg-transparent');
        }
    });

    // Animate elements on scroll
    function animateOnScroll() {
        $('.animate-on-scroll').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-fade-in-up');
            }
        });
    }

    // Add animate-on-scroll class to elements
    $('.services-card, .stats-item, .about-content, .contact-form').addClass('animate-on-scroll');

    // Run animation on scroll
    $(window).scroll(animateOnScroll);
    animateOnScroll(); // Run once on load

    // Counter animation for stats
    function animateCounters() {
        $('.counter').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            if (!$this.hasClass('counted')) {
                $this.addClass('counted');
                $({ countNum: $this.text() }).animate({
                    countNum: countTo
                }, {
                    duration: 2000,
                    easing: 'linear',
                    step: function() {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                        $this.text(this.countNum);
                    }
                });
            }
        });
    }

    // Trigger counter animation when stats section is visible
    $(window).scroll(function() {
        var statsSection = $('.stats-section');
        if (statsSection.length) {
            var elementTop = statsSection.offset().top;
            var elementBottom = elementTop + statsSection.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                animateCounters();
            }
        }
    });


    // Parallax effect for hero section
    $(window).scroll(function() {
        var scrolled = $(this).scrollTop();
        var parallaxElement = $('.parallax-bg');
        var speed = 0.5;
        
        if (parallaxElement.length) {
            parallaxElement.css('transform', 'translateY(' + (scrolled * speed) + 'px)');
        }
    });

    // Add hover effects to service cards
    $('.service-card').hover(
        function() {
            $(this).addClass('card-hover');
        },
        function() {
            $(this).removeClass('card-hover');
        }
    );

    // Typing effect for hero title
    function typeWriter(element, text, speed) {
        var i = 0;
        var timer = setInterval(function() {
            if (i < text.length) {
                element.text(element.text() + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Initialize typing effect (optional)
    var heroTitle = $('.hero-title');
    if (heroTitle.length && heroTitle.hasClass('typing-effect')) {
        var originalText = heroTitle.text();
        heroTitle.text('');
        typeWriter(heroTitle, originalText, 100);
    }

    // Lazy loading for images
    $('img[data-src]').each(function() {
        var $img = $(this);
        var src = $img.attr('data-src');
        
        $img.attr('src', src).removeAttr('data-src').addClass('fade-in');
    });

    // Add loading animation to buttons
    $('.btn-primary').on('click', function() {
        var $btn = $(this);
        if (!$btn.hasClass('loading')) {
            $btn.addClass('loading');
            setTimeout(function() {
                $btn.removeClass('loading');
            }, 2000);
        }
    });

    // Intersection Observer for better performance (if supported)
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $('.animate-on-scroll').each(function() {
            observer.observe(this);
        });
    }

    // Add active state to navigation links based on scroll position
    $(window).scroll(function() {
        var scrollPos = $(document).scrollTop();
        
        $('nav a[href^="#"]').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr('href'));
            
            if (refElement.length && refElement.position().top - 100 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('nav a').removeClass('active');
                currLink.addClass('active');
            }
        });
    });

    // Add smooth reveal animation to sections
    $('.section').each(function(index) {
        $(this).css('animation-delay', (index * 0.2) + 's');
    });

    // Initialize tooltips (if using Bootstrap or similar)
    $('[data-toggle="tooltip"]').tooltip();

    // Add click effect to buttons
    $('.btn').on('click', function(e) {
        var $btn = $(this);
        var x = e.pageX - $btn.offset().left;
        var y = e.pageY - $btn.offset().top;
        
        var $ripple = $('<span class="ripple"></span>');
        $ripple.css({
            top: y + 'px',
            left: x + 'px'
        });
        
        $btn.append($ripple);
        
        setTimeout(function() {
            $ripple.remove();
        }, 300);
    });

});

document.getElementById('meu-form').addEventListener('submit', function(e){
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    // Mostra o Swal de carregando
    Swal.fire({
        title: "Enviando...",
        text: "Aguarde enquanto enviamos seus dados.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('https://formspree.io/f/mkgqnjlb', {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        Swal.close(); // Fecha o Swal de carregando
        if(data.ok || data.success || data.status === 200){
            Swal.fire({
                title: "Dados enviados com sucesso!",
                icon: "success",
                draggable: true
            });
            form.reset(); // limpa o formulário
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Erro ao enviar o formulário",
                footer: '<a href="#contato">Voltar ao formulário</a>'
            });
        }
    })
    .catch(error => {
        Swal.close(); // Fecha o Swal de carregando
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Erro ao enviar o formulário",
            footer: '<a href="#contato">Voltar ao formulário</a>'
        });
        console.error(error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll("#services .card");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fade-in-up"); // ou "animate-zoom-in"
            observer.unobserve(entry.target); // anima apenas uma vez
          }
        });
      },
      { threshold: 0.2 } // dispara quando 20% do card estiver visível
    );

    cards.forEach(card => observer.observe(card));
  });

  document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll("#stats [data-target]");
    const speed = 100; // quanto maior, mais devagar

    const animateCount = (el) => {
        const target = +el.getAttribute("data-target");
        let count = 0;

        const update = () => {
            const increment = target / speed;
            count += increment;
            if (count < target) {
                el.textContent = Math.floor(count) + (el.textContent.includes('+') ? '+' : el.textContent.includes('%') ? '%' : '');
                requestAnimationFrame(update);
            } else {
                el.textContent = target + (el.textContent.includes('+') ? '+' : el.textContent.includes('%') ? '%' : '');
            }
        };
        update();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target); // anima apenas uma vez
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
});

