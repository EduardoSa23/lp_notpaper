// Landing Page JavaScript with jQuery
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
    
    // Mobile menu toggle
    $('.mobile-menu-toggle').on('click', function() {
        $('.mobile-menu').toggleClass('active');
    });
    
    // Header scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('scrolled').css({
                'background-color': 'rgba(255, 255, 255, 0.95)',
                'backdrop-filter': 'blur(10px)'
            });
        } else {
            $('header').removeClass('scrolled').css({
                'background-color': 'white',
                'backdrop-filter': 'none'
            });
        }
    });
    
    // Animate elements on scroll
    function animateOnScroll() {
        $('.feature-card, .animate-on-scroll').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-fade-in-up');
            }
        });
    }
    
    // Run animation on scroll
    $(window).scroll(animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Counter animation
    function animateCounters() {
        $('.counter').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    
    // Typing animation for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Initialize typing animation
    setTimeout(function() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 50);
        }
    }, 500);
    
    // Form handling
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            interest: $('#interest').val()
        };
        
        // Validate form
        if (!formData.name || !formData.email) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Show loading state
        var submitBtn = $(this).find('button[type="submit"]');
        var originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...').addClass('btn-loading');
        
        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset form
            $('#contact-form')[0].reset();
            
            // Reset button
            submitBtn.html(originalText).removeClass('btn-loading');
            
            // Show success message
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Track conversion (if analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form'
                });
            }
        }, 2000);
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        var notification = $(`
            <div class="notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300">
                <div class="flex items-center">
                    <i class="fas ${type === 'success' ? 'fa-check-circle text-green-500' : type === 'error' ? 'fa-exclamation-circle text-red-500' : 'fa-info-circle text-blue-500'} mr-2"></i>
                    <span class="text-gray-800">${message}</span>
                    <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="$(this).parent().parent().remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `);
        
        // Set background color based on type
        if (type === 'success') {
            notification.addClass('bg-green-100 border border-green-300');
        } else if (type === 'error') {
            notification.addClass('bg-red-100 border border-red-300');
        } else {
            notification.addClass('bg-blue-100 border border-blue-300');
        }
        
        $('body').append(notification);
        
        // Animate in
        setTimeout(function() {
            notification.removeClass('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            notification.addClass('translate-x-full');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Button hover effects
    $('.btn-primary, .btn-secondary').hover(
        function() {
            $(this).addClass('transform scale-105');
        },
        function() {
            $(this).removeClass('transform scale-105');
        }
    );
    
    // Feature card interactions
    $('.feature-card').hover(
        function() {
            $(this).find('i').addClass('animate-pulse-custom');
        },
        function() {
            $(this).find('i').removeClass('animate-pulse-custom');
        }
    );
    
    // Parallax effect for hero section
    $(window).scroll(function() {
        var scrolled = $(this).scrollTop();
        var parallax = $('.parallax-bg');
        var speed = 0.5;
        
        parallax.css('transform', 'translateY(' + (scrolled * speed) + 'px)');
    });
    
    // Lazy loading for images
    function lazyLoadImages() {
        $('img[data-src]').each(function() {
            var img = $(this);
            var imgTop = img.offset().top;
            var imgBottom = imgTop + img.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (imgBottom > viewportTop && imgTop < viewportBottom) {
                img.attr('src', img.attr('data-src')).removeAttr('data-src');
            }
        });
    }
    
    $(window).scroll(lazyLoadImages);
    lazyLoadImages(); // Run once on load
    
    // Modal functionality
    function openModal(modalId) {
        $('#' + modalId).removeClass('hidden').addClass('flex');
        $('body').addClass('overflow-hidden');
    }
    
    function closeModal(modalId) {
        $('#' + modalId).removeClass('flex').addClass('hidden');
        $('body').removeClass('overflow-hidden');
    }
    
    // Close modal when clicking outside
    $('.modal').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('flex').addClass('hidden');
            $('body').removeClass('overflow-hidden');
        }
    });
    
    // Testimonial carousel
    let currentTestimonial = 0;
    const testimonials = $('.testimonial-item');
    
    function showTestimonial(index) {
        testimonials.removeClass('active').eq(index).addClass('active');
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // FAQ accordion
    $('.faq-question').on('click', function() {
        var answer = $(this).next('.faq-answer');
        var icon = $(this).find('.faq-icon');
        
        if (answer.is(':visible')) {
            answer.slideUp();
            icon.removeClass('fa-minus').addClass('fa-plus');
        } else {
            $('.faq-answer').slideUp();
            $('.faq-icon').removeClass('fa-minus').addClass('fa-plus');
            answer.slideDown();
            icon.removeClass('fa-plus').addClass('fa-minus');
        }
    });
    
    // Progress bar animation
    function animateProgressBars() {
        $('.progress-bar').each(function() {
            var bar = $(this);
            var percentage = bar.data('percentage');
            
            bar.css('width', '0%').animate({
                width: percentage + '%'
            }, 1500);
        });
    }
    
    // Trigger progress bar animation when in view
    $(window).scroll(function() {
        $('.progress-container').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom && !$(this).hasClass('animated')) {
                $(this).addClass('animated');
                animateProgressBars();
            }
        });
    });
    
    // Search functionality
    $('#search-input').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();
        
        $('.searchable').each(function() {
            var text = $(this).text().toLowerCase();
            if (text.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Copy to clipboard functionality
    $('.copy-btn').on('click', function() {
        var textToCopy = $(this).data('copy');
        
        navigator.clipboard.writeText(textToCopy).then(function() {
            showNotification('Copiado para a área de transferência!', 'success');
        });
    });
    
    // Dark mode toggle
    $('#dark-mode-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        
        // Save preference
        localStorage.setItem('darkMode', $('body').hasClass('dark-mode'));
    });
    
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }
    
    // Intersection Observer for animations (modern browsers)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll events
    $(window).scroll(debounce(function() {
        // Scroll-dependent functions here
    }, 10));
    
    // Initialize tooltips
    $('[data-tooltip]').hover(
        function() {
            var tooltip = $('<div class="tooltip">' + $(this).data('tooltip') + '</div>');
            $('body').append(tooltip);
            
            var pos = $(this).offset();
            tooltip.css({
                top: pos.top - tooltip.outerHeight() - 10,
                left: pos.left + ($(this).outerWidth() / 2) - (tooltip.outerWidth() / 2)
            });
        },
        function() {
            $('.tooltip').remove();
        }
    );
    
    // Initialize page
    console.log('Landing page initialized successfully!');
    
    // Analytics tracking (if Google Analytics is loaded)
    if (typeof gtag !== 'undefined') {
        // Track page view
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Landing Page - Sistema Inovador',
            page_location: window.location.href
        });
        
        // Track button clicks
        $('.btn-primary, .btn-secondary').on('click', function() {
            gtag('event', 'click', {
                'event_category': 'button',
                'event_label': $(this).text().trim()
            });
        });
    }
});

// Additional utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Export functions for external use
window.LandingPage = {
    showNotification: function(message, type) {
        // Implementation here
    },
    openModal: function(modalId) {
        // Implementation here
    },
    closeModal: function(modalId) {
        // Implementation here
    }
};

