/* ============================================
   PORTFOLIO - JAVASCRIPT ENGINE
   Author: Abhijeet Rane
   Pure vanilla JS + GSAP animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- 1. PRELOADER ----
    const preloader = document.getElementById('preloader');
    const initSite = () => {
        document.body.classList.remove('loading');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 600);
        }
        if (!prefersReducedMotion) {
            initHeroAnimations();
        }
    };

    document.body.classList.add('loading');
    if (prefersReducedMotion) {
        if (preloader) preloader.remove();
        document.body.classList.remove('loading');
        // Make all elements visible immediately
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        document.querySelectorAll('.hero--hidden').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    } else {
        setTimeout(initSite, 2200);
    }


    // ---- 2. THEME TOGGLE ----
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const getStoredTheme = () => localStorage.getItem('portfolio-theme');
    const setTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    };

    // Initialize theme
    const storedTheme = getStoredTheme();
    if (storedTheme) {
        setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }


    // ---- 3. CUSTOM CURSOR ----
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024;

    if (!isTouchDevice && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        };
        animateRing();

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [data-tilt], .pill, .cert-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });
    }


    // ---- 4. SCROLL PROGRESS BAR ----
    const scrollProgress = document.getElementById('scroll-progress');
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });


    // ---- 5. NAVBAR ----
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');
    const scrollTopBtn = document.getElementById('scroll-top');

    // Navbar scroll state
    const navObserver = new IntersectionObserver(([entry]) => {
        if (navbar) {
            navbar.classList.toggle('navbar--scrolled', !entry.isIntersecting);
        }
    }, { threshold: 0.1 });

    if (heroSection) navObserver.observe(heroSection);

    // Scroll to top button
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('show', window.scrollY > 500);
        }
    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Active nav link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMobileMenu = () => {
        const isActive = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        mobileMenu.setAttribute('aria-hidden', isActive);
        hamburger.setAttribute('aria-expanded', !isActive);
        document.body.classList.toggle('no-scroll', !isActive);
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) toggleMobileMenu();
            });
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ---- 6. HERO TYPING ANIMATION ----
    const typedTextEl = document.getElementById('typed-text');
    const phrases = [
        'scalable cloud systems',
        'full-stack applications',
        'production-ready APIs',
        'DevOps pipelines'
    ];

    if (typedTextEl) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeDelay = 80;

        const type = () => {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeDelay = 40;
            } else {
                typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeDelay = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeDelay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeDelay = 500;
            }

            setTimeout(type, typeDelay);
        };

        // Start typing after preloader
        setTimeout(type, prefersReducedMotion ? 0 : 2800);
    }


    // ---- 7. HERO GSAP ANIMATIONS ----
    function initHeroAnimations() {
        if (typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        const heroTl = gsap.timeline({ delay: 0.2 });

        heroTl
            .to('.hero__greeting', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
            .to('.hero__name', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')
            .to('.hero__role', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
            .to('.hero__tagline', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
            .to('.hero__actions', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .to('.hero__socials', { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
            .to('.hero__scroll-indicator', { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1');
    }


    // ---- 8. SCROLL REVEAL SYSTEM ----
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseFloat(el.dataset.delay || 0) * 1000;
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('[data-reveal]').forEach(el => {
            revealObserver.observe(el);
        });
    }


    // ---- 9. STAT COUNTER ANIMATION ----
    const statNumbers = document.querySelectorAll('.stat__number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isDecimal = el.classList.contains('stat__number--decimal');
            const duration = 2000;
            const startTime = performance.now();

            const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const current = easedProgress * target;

                el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const statsContainer = document.querySelector('.about__stats');
    if (statsContainer) {
        const statsObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsContainer);
    }


    // ---- 10. TIMELINE SCROLL ANIMATION ----
    const timelineFill = document.getElementById('timeline-fill');
    const timelineSection = document.querySelector('.experience');

    if (timelineFill && timelineSection && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
                const scrolled = (windowHeight - sectionTop) / (sectionHeight + windowHeight);
                const fillPercent = Math.min(Math.max(scrolled * 100, 0), 100);
                timelineFill.style.height = fillPercent + '%';
            }
        }, { passive: true });
    }


    // ---- 11. VANILLA TILT INIT ----
    if (typeof VanillaTilt !== 'undefined' && !isTouchDevice && !prefersReducedMotion) {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        VanillaTilt.init(Array.from(tiltElements), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.12,
            scale: 1.02
        });
    }


    // ---- 12. CONTACT FORM (FORMSPREE) ----
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const subject = formData.get('subject')?.trim();
            const message = formData.get('message')?.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Submit
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormStatus('Something went wrong. Please try again.', 'error');
                }
            } catch {
                showFormStatus('Network error. Please check your connection.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Send Message';
            }
        });
    }

    function showFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form__status form__status--' + type;
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form__status';
        }, 5000);
    }


    // ---- 13. CERTIFICATE MODAL ----
    const certModal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalClose = certModal?.querySelector('.modal__close');
    const modalOverlay = certModal?.querySelector('.modal__overlay');

    const certImages = {
        0: { title: 'AWS Certified Cloud Practitioner', image: 'images/certificates/aws_cloud_foundation.png' },
        1: { title: 'AWS Cloud Architecting', image: 'images/certificates/aws_cloud_essentials.png' },
        2: { title: 'Cybersecurity Essentials', image: 'images/certificates/cybersecurity_essentials.png' },
        3: { title: 'Programming Essentials in Python (PCAP)', image: 'images/certificates/python_essential.png' },
        4: { title: 'Postman API Fundamentals', image: 'images/certificates/postman_api.png' }
    };

    document.querySelectorAll('[data-cert-index]').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.dataset.certIndex;
            const cert = certImages[index];
            if (cert && certModal && modalTitle && modalImage) {
                modalTitle.textContent = cert.title;
                modalImage.src = cert.image;
                modalImage.alt = cert.title;
                certModal.classList.add('active');
                certModal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
            }
        });
    });

    const closeModal = () => {
        if (!certModal) return;
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal?.classList.contains('active')) closeModal();
    });


    // ---- 14. GSAP SCROLL TRIGGER ANIMATIONS ----
    const initScrollAnimations = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        // Skills pills stagger
        document.querySelectorAll('.skills__category').forEach(category => {
            const pills = category.querySelectorAll('.pill');
            if (pills.length) {
                gsap.fromTo(pills,
                    { y: 20, opacity: 0 },
                    {
                        scrollTrigger: { trigger: category, start: 'top 85%', once: true },
                        y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out'
                    }
                );
            }
        });

        // Timeline cards
        document.querySelectorAll('.timeline__item').forEach((item, i) => {
            const card = item.querySelector('.timeline__card');
            if (!card) return;
            const direction = i % 2 === 0 ? -60 : 60;
            gsap.fromTo(card,
                { x: window.innerWidth >= 1024 ? direction : -40, opacity: 0 },
                {
                    scrollTrigger: { trigger: item, start: 'top 85%', once: true },
                    x: 0, opacity: 1, duration: 0.7, ease: 'power2.out'
                }
            );
        });

        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length) {
            gsap.fromTo(projectCards,
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.projects__bento', start: 'top 85%', once: true },
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out'
                }
            );
        }

        // Cert cards
        const certCards = document.querySelectorAll('.cert-card');
        if (certCards.length) {
            gsap.fromTo(certCards,
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.certs__grid', start: 'top 85%', once: true },
                    y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out'
                }
            );
        }
    };

    // Wait for GSAP to load (deferred scripts)
    if (typeof gsap !== 'undefined') {
        initScrollAnimations();
    } else {
        window.addEventListener('load', () => {
            setTimeout(initScrollAnimations, 100);
        });
    }
});
