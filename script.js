            document.addEventListener('DOMContentLoaded', () => {

                const select = (el, all = false) => all ? [...document.querySelectorAll(el)] : document.querySelector(el);

                const header = select('#header');
                const menuToggle = select('#menu-toggle');
                const navLinks = select('.nav-links');
                const backToTopButton = select('#back-to-top');
                const currentYearSpan = select('#current-year');
                const preloader = select('#preloader');
                const sections = select('main section[id]', true);
                const navLiLinks = select('#header .nav-links li a', true);
                const scrollDownIndicator = select('.scroll-down-indicator');
                const fabNav = select('#fab-nav');
                const fabButton = select('.fab-button');
                const fabOptions = select('.fab-options');
                const projectModal = select('#project-modal');
                const projectModalClose = select('.project-modal-close');
                const projectDetailButtons = select('.project-details-btn', true);

                let isMenuOpen = false;
                let isFabOpen = false;
                let isParticlesLoaded = false;
                let swiperInstance = null;

                const projectData = {
                    proj1: { title: "Xpert-Fans E-commerce", img: "https://m.media-amazon.com/images/I/51HDagPWLlL._AC_UF894,1000_QL80_.jpg", tags: ["javaScript", "Bootstrap", "Aos Animation", "jQuery"], description: "A E-commerce Website of Ceiling Fans, Srand Fans, Brackets Fans Fully Responsive.You can Contact Us And You Can Give Feedback Know About Us How We Start Xpert Fans", link: "https://github.com/MHassanDeveloper/Xpert-Fans" },
                    proj2: { title: "The World of Ai", img: "https://media.geeksforgeeks.org/wp-content/uploads/20240319155102/what-is-ai-artificial-intelligence.webp", tags: ["JavaScript", "Html 5", "CSS 3", "Aos Animation"], description: "I have Explain Ai in this Website in Fully Detail.You Can Know About Ai What is Ai ann How it works.", link: "https://github.com/MHassanDeveloper/Ai" },
                    proj3: { title: "Sherazi Watch", img: "https://theluxuryplaybook.com/wp-content/uploads/2024/04/How-to-invest-in-Luxury-Watches-2024-Guide.webp", tags: ["Ai", "CSS3", "GSAP", "JavaScript"], description: "A Luxuary Watch Store Where You Can Purchase Your Dream Watch And also you can customize Your Watch", link: "https://github.com/MHassanDeveloper/Sherazi-Watch" },
                    // proj4: { title: "Social Pulse Aggregator", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80", tags: ["Node.js", "MongoDB", "Express", "API"], description: "Created a dynamic web application that fetches and aggregates content from multiple social media APIs (Twitter, GitHub, etc.), presenting them in a unified and customizable feed using Node.js and MongoDB.", link: "#" }
                };


                function showSite() {
                    if (preloader) {
                        gsap.to(preloader, { opacity: 0, duration: 0.7, onComplete: () => preloader.remove() });
                    }
                    document.body.style.overflow = '';
                    initAnimations();
                    highlightNav();
                    loadParticles();
                    initSwiper();
                    initTilt();
                }

                window.addEventListener('load', () => setTimeout(showSite, 600));
                setTimeout(() => { if (preloader && preloader.style.opacity !== '0') showSite(); }, 3500);


                const handleScroll = () => {
                    const scrollY = window.scrollY;
                    const headerHeight = header ? header.offsetHeight : 70;

                    header?.classList.toggle('sticky', scrollY > 80);
                    backToTopButton?.classList.toggle('visible', scrollY > 300);
                    highlightNav(scrollY, headerHeight);

                    if (isFabOpen) {
                        isFabOpen = false;
                        fabNav?.classList.remove('active');
                    }
                };
                window.addEventListener('scroll', handleScroll, { passive: true });

                function highlightNav(scrollY = window.scrollY, headerHeight = header?.offsetHeight ?? 70) {
                    let currentSectionId = '';
                    const offset = headerHeight + 60;
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        if (scrollY >= sectionTop - offset) {
                            currentSectionId = section.getAttribute('id');
                        }
                    });

                    if (!currentSectionId && scrollY < (sections[0]?.offsetTop ?? 0) - offset) {
                        currentSectionId = 'hero';
                    }

                    navLiLinks.forEach(a => {
                        a.classList.remove('active');
                        if (a.getAttribute('href') === `#${currentSectionId}`) {
                            a.classList.add('active');
                        }
                    });
                    select('.fab-options a', true).forEach(a => {
                        a.style.backgroundColor = ''; a.style.color = '';
                        if (a.getAttribute('href') === `#${currentSectionId}`) {
                            a.style.backgroundColor = 'var(--link-color)'; a.style.color = 'var(--bg-color)';
                        }
                    });
                }


                if (menuToggle && navLinks) {
                    menuToggle.addEventListener('click', () => {
                        isMenuOpen = !isMenuOpen;
                        navLinks.classList.toggle('active', isMenuOpen);
                        menuToggle.querySelector('i')?.classList.toggle('fa-bars', !isMenuOpen);
                        menuToggle.querySelector('i')?.classList.toggle('fa-times', isMenuOpen);
                        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
                        gsap.to(menuToggle.querySelector('i'), { rotate: isMenuOpen ? 90 : 0, duration: 0.3 });

                        if (isMenuOpen) {
                            gsap.fromTo(navLinks.querySelectorAll('li'),
                                { opacity: 0, x: 60 },
                                { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, delay: 0.1, ease: 'power3.out' }
                            );
                        }
                    });

                    navLinks.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', () => {
                            if (isMenuOpen) {
                                isMenuOpen = false;
                                navLinks.classList.remove('active');
                                menuToggle.querySelector('i')?.classList.remove('fa-times');
                                menuToggle.querySelector('i')?.classList.add('fa-bars');
                                document.body.style.overflow = '';
                                gsap.to(menuToggle.querySelector('i'), { rotate: 0, duration: 0.3 });
                            }
                        });
                    });

                    document.addEventListener('click', (event) => {
                        if (isMenuOpen && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                            isMenuOpen = false;
                            navLinks.classList.remove('active');
                            menuToggle.querySelector('i')?.classList.remove('fa-times');
                            menuToggle.querySelector('i')?.classList.add('fa-bars');
                            document.body.style.overflow = '';
                            gsap.to(menuToggle.querySelector('i'), { rotate: 0, duration: 0.3 });
                        }
                    });
                }

                if (backToTopButton) {
                    backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
                }
                if (currentYearSpan) {
                    currentYearSpan.textContent = new Date().getFullYear();
                }
                if (scrollDownIndicator) {
                    scrollDownIndicator.addEventListener('click', (e) => {
                        e.preventDefault(); select('#skills')?.scrollIntoView({ behavior: 'smooth' });
                    });
                }


                if (fabButton && fabOptions && fabNav) {
                    fabButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        isFabOpen = !isFabOpen;
                        fabNav.classList.toggle('active', isFabOpen);
                        gsap.to(fabButton.querySelector('i'), { rotate: isFabOpen ? 135 : 0, duration: 0.4 });
                        if (isFabOpen) {
                            gsap.fromTo('.fab-options a', { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.3, ease: 'back.out(1.7)' });
                        }
                    });
                    document.addEventListener('click', (e) => {
                        if (isFabOpen && !fabNav.contains(e.target)) {
                            isFabOpen = false;
                            fabNav.classList.remove('active');
                            gsap.to(fabButton.querySelector('i'), { rotate: 0, duration: 0.4 });
                        }
                    });
                    fabOptions.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', () => {
                            isFabOpen = false;
                            fabNav.classList.remove('active');
                            gsap.to(fabButton.querySelector('i'), { rotate: 0, duration: 0.4 });
                        });
                    });
                }

                const typingElement = select('#typing-effect');
                if (typingElement && typeof Typed !== 'undefined') {
                    new Typed('#typing-effect', {
                        strings: [' A Full Stack Web Developer 😎.', ' An Ai & Python Developer 🙄.','Currently Learning Data Science Machine learning Deep Learning Data Analyst 🧐.', 'A Logic Builder & Tech Enthusiast',],
                        typeSpeed: 60, backSpeed: 40, backDelay: 1800, startDelay: 900, loop: true,
                        smartBackspace: true, cursorChar: '▋', autoInsertCss: true
                    });
                } else if (typingElement) {
                    typingElement.textContent = 'a Web Developer.';
                }


                const particlesContainerId = 'particles-js';
                function loadParticles() {
                    if (select('#' + particlesContainerId) && typeof particlesJS !== 'undefined') {
                        loadParticlesConfig();
                        isParticlesLoaded = true;
                    }
                }

                function loadParticlesConfig() {
                    const particleColor = ["#F5F5F5", "#BDB76B", "#6B8E23", "#CCCCCC"];
                    const lineColor = "#3A3A3A";
                    const particleDensity = 70;
                    const particleSize = 2.8;
                    const particleOpacity = 0.7;
                    const lineOpacity = 0.25;
                    const moveSpeed = 2.2;

                    const config = {
                        particles: {
                            number: { value: particleDensity, density: { enable: true, value_area: 800 } },
                            color: { value: particleColor },
                            shape: { type: "circle" },
                            opacity: { value: particleOpacity, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false } },
                            size: { value: particleSize, random: true, anim: { enable: true, speed: 3, size_min: 0.5, sync: false } },
                            line_linked: { enable: true, distance: 150, color: lineColor, opacity: lineOpacity, width: 1 },
                            move: { enable: true, speed: moveSpeed, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: true, rotateX: 600, rotateY: 1200 } }
                        },
                        interactivity: {
                            detect_on: "canvas",
                            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
                            modes: {
                                grab: { distance: 150, line_linked: { opacity: 0.7 } },
                                push: { particles_nb: 4 }
                            }
                        },
                        retina_detect: true
                    };

                    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                        window.pJSDom[0].pJS.fn.vendors.destroy();
                    }
                    particlesJS(particlesContainerId, config);
                }


                function initSwiper() {
                    if (typeof Swiper !== 'undefined' && select('.swiper-container')) {
                        swiperInstance = new Swiper('.swiper-container', {
                            loop: true,
                            effect: 'coverflow',
                            grabCursor: true,
                            centeredSlides: true,
                            slidesPerView: 'auto',
                            coverflowEffect: {
                                rotate: 30,
                                stretch: 10,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            },
                            autoplay: {
                                delay: 5000,
                                disableOnInteraction: false,
                            },
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                            },
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                        });
                    }
                }

                function initTilt() {
                    if (typeof $ !== 'undefined' && typeof $.fn.tilt !== 'undefined') {
                        $('[data-tilt]').tilt({
                            glare: true,
                            maxGlare: .3,
                            perspective: 1000
                        });
                    }
                }

                function initAnimations() {
                    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                        select('.animate-on-scroll, .animate-hero', true).forEach(el => {
                            el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('animated');
                        });
                        return;
                    }
                    gsap.registerPlugin(ScrollTrigger);
                    ScrollTrigger.defaults({ toggleActions: "play none none none", start: "top 90%" });

                    gsap.to(".animate-hero", { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5, ease: "expo.out" });

                    select('.section-bg-parallax', true).forEach(bg => {
                        gsap.to(bg, {
                            backgroundPosition: `center 60%`,
                            ease: "none",
                            scrollTrigger: { trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: 1.5 }
                        });
                    });

                    gsap.utils.toArray('.animate-on-scroll').forEach((element, i) => {
                        const isCard = element.classList.contains('skill-card') || element.classList.contains('project-card');
                        // const isTimelineItem = element.classList.contains('timeline-item'); // Timeline removed
                        const isContactIcon = element.classList.contains('contact-icon');

                        gsap.fromTo(element,
                            { opacity: 0, y: 70 },
                            {
                                opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
                                scrollTrigger: { trigger: element, start: "top 85%" },
                                // delay: isCard ? i * 0.06 : (isTimelineItem ? 0.1 : (isContactIcon ? i * 0.08 : 0)),
                                delay: isCard ? i * 0.06 : (isContactIcon ? i * 0.08 : 0),
                                onComplete: () => element.classList.add('animated')
                            }
                        );
                    });

                    gsap.from(".section-title::after", {
                        scaleX: 0, transformOrigin: 'center center', duration: 1.2, ease: "expo.out",
                        scrollTrigger: { trigger: ".section-title", start: "top 88%" }
                    });

                    // Timeline animation removed
                    /* if (select('.timeline-container')) {
                         ScrollTrigger.batch(".timeline-item", {
                            start: "top 80%",
                            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }),
                         });
                    } */
                }

                function openModal(projectId) {
                    const data = projectData[projectId];
                    if (!data || !projectModal) return;

                    select('#modal-title').textContent = data.title;
                    select('#modal-image').src = data.img;
                    select('#modal-image').alt = data.title;
                    select('#modal-description p').textContent = data.description;
                    select('#modal-link').href = data.link;

                    const tagsContainer = select('#modal-tags');
                    tagsContainer.innerHTML = '';
                    data.tags.forEach(tagText => {
                        const tagEl = document.createElement('span');
                        tagEl.classList.add('tag');
                        tagEl.textContent = tagText;
                        tagsContainer.appendChild(tagEl);
                    });

                    projectModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }

                function closeModal() {
                    if (!projectModal) return;
                    projectModal.classList.remove('active');
                    document.body.style.overflow = '';
                }

                projectDetailButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const card = button.closest('.project-card');
                        const projectId = card?.dataset.projectId;
                        if (projectId) openModal(projectId);
                    });
                });

                projectModalClose?.addEventListener('click', closeModal);
                projectModal?.addEventListener('click', (e) => {
                    if (e.target === projectModal) closeModal();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && projectModal?.classList.contains('active')) closeModal();
                });

            });