/**
 * SAYAT MATH — Interactive Engine (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Loading Screen Handler */
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, 500);
    });

    /* 2. Custom Cursor Glow Effect */
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    /* 3. Scroll Progress Indicator */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    /* 4. Sticky Header with Glassmorphism Blur */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 5. Mobile Navigation Menu Toggle */
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('open');
    });

    /* 6. Dynamic Typing Animation Effect */
    const typingElement = document.getElementById('typing-text');
    const phrases = ["Жоғары нәтиже", "140+ Балл", "Тез әрі оңай", "Авторлық әдіс"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

    /* 7. Animated Counter Algorithm */
    const counters = document.querySelectorAll('.counter');
    let animatedCounters = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + "+";
                }
            };
            updateCounter();
        });
    }

    /* 8. Intersection Observer for Animations & Counters */
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('hero-dashboard') && !animatedCounters) {
                    startCounters();
                    animatedCounters = true;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .hero-dashboard').forEach(el => observer.observe(el));

    /* 9. Interactive Platform Tabs System */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    /* 10. Demo Video Overlay Controller */
    const videoOverlay = document.getElementById('video-overlay');
    const playBtn = document.getElementById('play-btn');
    const demoIframe = document.getElementById('demo-iframe');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const src = demoIframe.getAttribute('data-src');
            demoIframe.setAttribute('src', src);
            videoOverlay.style.display = 'none';
        });
    }

    /* 11. Custom Slider for Reviews Section */
    const wrapper = document.getElementById('reviews-wrapper');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = wrapper.children[0].offsetWidth + 32;
        wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < wrapper.children.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    /* 12. Accordion Component Toggle */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = null;
                });
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* 13. 3D Tilt Effect for Glass Cards */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });

});