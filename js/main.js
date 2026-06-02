/* ============================================================
   IŞIKTEPE EĞİTİM GÖNÜLLÜLERİ DERNEĞİ — Main JavaScript
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // CONFIGURATION — Easily editable data
    // ============================================================

    /**
     * External form URLs — replace placeholders with real URLs when ready
     * These are referenced throughout the page for CTA buttons
     */
    const CONFIG = {
        forms: {
            volunteer: '#gonullu',       // [PLACEHOLDER: Gönüllü başvuru form URL]
            mentor: '#gonullu',          // [PLACEHOLDER: Mentor başvuru form URL]
            alumniNetwork: '#gonullu',   // [PLACEHOLDER: Mezun ağı katılım form URL]
        }
    };

    /**
     * Events data — update this array with real events
     * Each event: { day, month, year, title, description, status: 'upcoming' | 'past' }
     */
    const EVENTS_DATA = [
        {
            day: '—',
            month: '—',
            year: 2026,
            title: 'Mentorluk Programı Tanıtım Toplantısı',
            description: 'Mentorluk programımızın kapsamı, hedefleri ve katılım koşulları hakkında bilgilendirme toplantısı.',
            status: 'upcoming'
        },
        {
            day: '—',
            month: '—',
            year: 2026,
            title: 'Kariyer Günleri',
            description: 'Farklı meslek gruplarından mezunlarımızın deneyimlerini paylaştığı kariyer yönlendirme etkinliği.',
            status: 'upcoming'
        },
        {
            day: '—',
            month: '—',
            year: 2026,
            title: 'Kuruluş Buluşması',
            description: 'Derneğimizin kuruluş sürecini ve vizyonumuzu paylaştığımız ilk topluluk buluşması.',
            status: 'past'
        }
    ];

    // ============================================================
    // DOM Elements
    // ============================================================
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const floatingCTA = document.getElementById('floating-cta');
    const heroCanvas = document.getElementById('hero-particles');
    const eventsContainer = document.getElementById('events-container');

    // ============================================================
    // HEADER — Sticky shrink on scroll
    // ============================================================
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============================================================
    // MOBILE NAVIGATION
    // ============================================================

    // Create overlay element for mobile nav
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function toggleMobileNav() {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        navOverlay.classList.toggle('visible');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('visible');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileNav);
    navOverlay.addEventListener('click', closeMobileNav);

    // Close mobile nav when a link is clicked
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeMobileNav();
            }
        });
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMobileNav();
        }
    });

    // ============================================================
    // ACTIVE SECTION HIGHLIGHTING
    // ============================================================
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveSection() {
        const scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });

    // ============================================================
    // FLOATING CTA — Show after scrolling past hero, hide in #gonullu
    // ============================================================
    function handleFloatingCTA() {
        const heroSection = document.getElementById('hero');
        const gonulluSection = document.getElementById('gonullu');

        if (!heroSection || !floatingCTA) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollY = window.scrollY;

        // Show after scrolling past hero
        if (scrollY > heroBottom - 200) {
            floatingCTA.classList.add('visible');
        } else {
            floatingCTA.classList.remove('visible');
        }

        // Hide when in the Gönüllü Ol section
        if (gonulluSection) {
            const gonulluTop = gonulluSection.offsetTop - 100;
            const gonulluBottom = gonulluTop + gonulluSection.offsetHeight + 100;

            if (scrollY >= gonulluTop && scrollY <= gonulluBottom) {
                floatingCTA.classList.add('hidden-in-section');
            } else {
                floatingCTA.classList.remove('hidden-in-section');
            }
        }
    }

    window.addEventListener('scroll', handleFloatingCTA, { passive: true });

    // ============================================================
    // HERO — Star Particle Animation (Canvas)
    // ============================================================
    function initStarParticles() {
        if (!heroCanvas) return;

        const ctx = heroCanvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationId;

        // Particle count — fewer on mobile for performance
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 25 : 50;

        function resize() {
            width = heroCanvas.width = heroCanvas.parentElement.offsetWidth;
            height = heroCanvas.height = heroCanvas.parentElement.offsetHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005,
            };
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }

        function drawStar(x, y, size, opacity) {
            ctx.save();
            ctx.translate(x, y);
            ctx.globalAlpha = opacity;

            // Draw a 4-pointed star
            ctx.fillStyle = '#F5C842';
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const outerX = Math.cos(angle) * size;
                const outerY = Math.sin(angle) * size;
                const innerAngle = angle + Math.PI / 4;
                const innerX = Math.cos(innerAngle) * size * 0.35;
                const innerY = Math.sin(innerAngle) * size * 0.35;

                if (i === 0) {
                    ctx.moveTo(outerX, outerY);
                } else {
                    ctx.lineTo(outerX, outerY);
                }
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();

            // Add glow effect
            ctx.shadowBlur = size * 3;
            ctx.shadowColor = 'rgba(245, 200, 66, ' + opacity * 0.5 + ')';
            ctx.fill();

            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(function (p) {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += p.pulseSpeed;

                // Wrap around edges
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                // Pulsing opacity
                const dynamicOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

                drawStar(p.x, p.y, p.size, dynamicOpacity);
            });

            animationId = requestAnimationFrame(animate);
        }

        // Initialize
        resize();
        initParticles();
        animate();

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                resize();
                initParticles();
            }, 200);
        });

        // Pause animation when tab not visible
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // ============================================================
    // EVENTS — Render from data
    // ============================================================
    function renderEvents() {
        if (!eventsContainer) return;

        const html = EVENTS_DATA.map(function (event) {
            const isPast = event.status === 'past';
            const statusClass = isPast ? 'event-card--past' : '';
            const statusBadgeClass = isPast ? 'event-card__status--past' : 'event-card__status--upcoming';
            const statusText = isPast ? 'Geçmiş' : 'Yaklaşan';

            return (
                '<article class="event-card ' + statusClass + '">' +
                '  <div class="event-card__date">' +
                '    <span class="event-card__date-day">' + event.day + '</span>' +
                '    <span class="event-card__date-month">' + event.month + '</span>' +
                '  </div>' +
                '  <div class="event-card__body">' +
                '    <span class="event-card__status ' + statusBadgeClass + '">' + statusText + '</span>' +
                '    <h3 class="event-card__title">' + event.title + '</h3>' +
                '    <p class="event-card__description">' + event.description + '</p>' +
                '  </div>' +
                '</article>'
            );
        }).join('');

        eventsContainer.innerHTML = html;
    }

    // ============================================================
    // SMOOTH SCROLL — For older browsers fallback
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // SCROLL REVEAL — Subtle fade-in for sections
    // ============================================================
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;

        const revealElements = document.querySelectorAll('.section__header, .pillar-card, .mentor-card, .network-card, .volunteer-card, .event-card, .vision-block, .donation-block, .contact-item, .social-link');

        // Add initial hidden state
        revealElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger animation for grid items
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('.pillar-card, .mentor-card, .network-card, .volunteer-card');
                    let delay = 0;

                    if (siblings.length > 0) {
                        const index = Array.prototype.indexOf.call(siblings, entry.target);
                        if (index >= 0) {
                            delay = index * 100;
                        }
                    }

                    setTimeout(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    function init() {
        handleHeaderScroll();
        handleFloatingCTA();
        highlightActiveSection();
        initStarParticles();
        renderEvents();
        initScrollReveal();
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
