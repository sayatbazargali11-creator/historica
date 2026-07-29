/* ==================================================================
   PERSONAL PORTFOLIO — SCRIPT.JS
   All interactivity: loader, custom cursor, navbar, smooth scroll,
   hero typing, tilt, timeline progress, gallery lightbox, skills bars,
   counters, testimonial slider, FAQ accordion, contact form, effects.
   Organized into small, independent modules — each wrapped so one
   failing module never blocks the others.
   ================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     0. TOUCH DEVICE DETECTION (disables custom cursor on touch)
     --------------------------------------------------------------- */
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice) document.body.classList.add('touch-device');

  /* ---------------------------------------------------------------
     1. LOADING SCREEN
     --------------------------------------------------------------- */
  (function loaderModule(){
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    if (!loader || !fill) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 300);
      }
      fill.style.width = progress + '%';
    }, 160);

    document.body.style.overflow = 'hidden';
    // Safety net: never trap the user behind the loader
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 1200);
    });
  })();

  /* ---------------------------------------------------------------
     2. CUSTOM CURSOR + MOUSE TRAIL FEEL
     --------------------------------------------------------------- */
  (function cursorModule(){
    if (isTouchDevice) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing(){
      // Ease the ring toward the pointer for a soft trailing feel
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactiveSelectors = 'a, button, .gallery-item, .edu-card, .achieve-card, .project-card, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) ring.classList.remove('is-active');
    });
  })();

  /* ---------------------------------------------------------------
     3. SCROLL PROGRESS BAR
     --------------------------------------------------------------- */
  (function scrollProgressModule(){
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update(){
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ---------------------------------------------------------------
     4. AMBIENT PARTICLES (hero background)
     --------------------------------------------------------------- */
  (function particlesModule(){
    if (typeof particlesJS === 'undefined') return;
    particlesJS('particles-js', {
      particles: {
        number: { value: 46, density: { enable: true, value_area: 900 } },
        color: { value: '#4C5FFF' },
        opacity: { value: 0.18, random: true },
        size: { value: 2.4, random: true },
        line_linked: { enable: true, distance: 140, color: '#4C5FFF', opacity: 0.12, width: 1 },
        move: { enable: true, speed: 0.6, out_mode: 'out' }
      },
      interactivity: {
        events: {
          onhover: { enable: !isTouchDevice, mode: 'grab' },
          resize: true
        },
        modes: { grab: { distance: 160, line_linked: { opacity: 0.25 } } }
      },
      retina_detect: true
    });
  })();

  /* ---------------------------------------------------------------
     5. AOS (scroll reveal) INIT
     --------------------------------------------------------------- */
  (function aosModule(){
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  })();

  /* ---------------------------------------------------------------
     6. NAVBAR — shrink on scroll, active link highlight, drawer
     --------------------------------------------------------------- */
  (function navbarModule(){
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const drawer = document.getElementById('navDrawer');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });

    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open);
      });
      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active link tracking via IntersectionObserver
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.navbar__link, .navbar__drawer-link');
    if (sections.length){
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      sections.forEach(section => observer.observe(section));
    }
  })();

  /* ---------------------------------------------------------------
     7. SMOOTH SCROLL for all [data-scroll] anchor links
     --------------------------------------------------------------- */
  (function smoothScrollModule(){
    document.querySelectorAll('[data-scroll]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navOffset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();

  /* ---------------------------------------------------------------
     8. HERO TYPED.JS HEADLINE
     --------------------------------------------------------------- */
  (function typedModule(){
    const el = document.getElementById('heroTyped');
    if (!el || typeof Typed === 'undefined') return;
    // ✏️ REPLACE: rotating headline phrases
    new Typed('#heroTyped', {
      strings: [
        'a product designer.',
        'a front-end developer.',
        'a lifelong learner.',
        'a builder of calm interfaces.'
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1600,
      loop: true,
      smartBackspace: true
    });
  })();

  /* ---------------------------------------------------------------
     9. VANILLA TILT (photo card + floating shape)
     --------------------------------------------------------------- */
  (function tiltModule(){
    if (isTouchDevice || typeof VanillaTilt === 'undefined') return;
    const targets = document.querySelectorAll('[data-tilt]');
    if (!targets.length) return;
    VanillaTilt.init(targets, {
      max: 8,
      speed: 500,
      glare: true,
      'max-glare': 0.2,
      scale: 1.02
    });
  })();

  /* ---------------------------------------------------------------
     10. TIMELINE SCROLL-FILL PROGRESS
     --------------------------------------------------------------- */
  (function timelineModule(){
    const timeline = document.getElementById('timeline');
    const fill = document.getElementById('timelineFill');
    if (!timeline || !fill) return;

    function update(){
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(viewportH * 0.75 - rect.top, 0), total);
      const percent = total ? (visible / total) * 100 : 0;
      fill.style.height = percent + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------------------------------------------------------
     11. EDUCATION "LEARN MORE" MODALS
     --------------------------------------------------------------- */
  (function modalModule(){
    document.querySelectorAll('.edu-more').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.target);
        if (modal) modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
    document.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', () => {
        const modal = el.closest('.modal');
        if (modal) modal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape'){
        document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));
        document.body.style.overflow = '';
      }
    });
  })();

  /* ---------------------------------------------------------------
     12. GALLERY LIGHTBOX
     --------------------------------------------------------------- */
  (function lightboxModule(){
    const items = Array.from(document.querySelectorAll('.gallery-item img'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (!items.length || !lightbox || !lightboxImg) return;

    let currentIndex = 0;

    function open(index){
      currentIndex = index;
      lightboxImg.src = items[currentIndex].src;
      lightboxImg.alt = items[currentIndex].alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function show(delta){
      currentIndex = (currentIndex + delta + items.length) % items.length;
      lightboxImg.src = items[currentIndex].src;
      lightboxImg.alt = items[currentIndex].alt;
    }

    items.forEach((img, i) => {
      img.closest('.gallery-item').addEventListener('click', () => open(i));
    });
    closeBtn && closeBtn.addEventListener('click', close);
    prevBtn && prevBtn.addEventListener('click', () => show(-1));
    nextBtn && nextBtn.addEventListener('click', () => show(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(-1);
      if (e.key === 'ArrowRight') show(1);
    });
  })();

  /* ---------------------------------------------------------------
     13. SKILLS — ANIMATE PROGRESS BARS ON SCROLL INTO VIEW
     --------------------------------------------------------------- */
  (function skillsModule(){
    const bars = document.querySelectorAll('.skill-bar__fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        const value = parseInt(fill.dataset.value, 10) || 0;
        const percentLabel = fill.closest('.skill-bar').querySelector('.skill-bar__percent');
        requestAnimationFrame(() => { fill.style.width = value + '%'; });

        // Animate the numeric label alongside the bar
        let current = 0;
        const step = Math.max(1, Math.round(value / 40));
        const tick = setInterval(() => {
          current = Math.min(current + step, value);
          if (percentLabel) percentLabel.textContent = current + '%';
          if (current >= value) clearInterval(tick);
        }, 20);

        obs.unobserve(fill);
      });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
  })();

  /* ---------------------------------------------------------------
     14. STATISTICS — ANIMATED COUNTERS (CountUp.js with fallback)
     --------------------------------------------------------------- */
  (function countersModule(){
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10) || 0;

        if (typeof countUp !== 'undefined' && countUp.CountUp) {
          const cu = new countUp.CountUp(el, end, { duration: 2 });
          if (!cu.error) cu.start(); else el.textContent = end;
        } else {
          // Fallback simple counter if CountUp fails to load
          let current = 0;
          const step = Math.max(1, Math.round(end / 60));
          const tick = setInterval(() => {
            current = Math.min(current + step, end);
            el.textContent = current;
            if (current >= end) clearInterval(tick);
          }, 20);
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  })();

  /* ---------------------------------------------------------------
     15. TESTIMONIAL SLIDER
     --------------------------------------------------------------- */
  (function testimonialModule(){
    const track = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    if (!track || !dotsWrap) return;

    const slides = track.children.length;
    let index = 0;
    let autoplay;

    for (let i = 0; i < slides; i++){
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('is-active');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = Array.from(dotsWrap.children);

    function goTo(i){
      index = (i + slides) % slides;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    }
    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    nextBtn && nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

    function resetAutoplay(){
      clearInterval(autoplay);
      autoplay = setInterval(next, 6000);
    }
    resetAutoplay();
  })();

  /* ---------------------------------------------------------------
     16. FAQ ACCORDION
     --------------------------------------------------------------- */
  (function accordionModule(){
    document.querySelectorAll('.accordion__item').forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      const panel = item.querySelector('.accordion__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all siblings for a clean single-open accordion
        item.parentElement.querySelectorAll('.accordion__item.is-open').forEach(openItem => {
          if (openItem !== item){
            openItem.classList.remove('is-open');
            openItem.querySelector('.accordion__panel').style.maxHeight = null;
          }
        });

        if (isOpen){
          item.classList.remove('is-open');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  })();

  /* ---------------------------------------------------------------
     17. CONTACT FORM (front-end only demo submission)
     --------------------------------------------------------------- */
  (function contactFormModule(){
    const form = document.getElementById('contactForm');
    const note = document.getElementById('contactFormNote');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // ✏️ REPLACE: connect this to your real form backend / email service
      if (note) {
        note.textContent = 'Thanks! Your message has been noted — I\'ll get back to you soon.';
      }
      form.reset();
    });
  })();

  /* ---------------------------------------------------------------
     18. BACK TO TOP BUTTON
     --------------------------------------------------------------- */
  (function toTopModule(){
    const btn = document.getElementById('toTop');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* ---------------------------------------------------------------
     19. RIPPLE EFFECT ON BUTTONS
     --------------------------------------------------------------- */
  (function rippleModule(){
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e){
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  })();

  /* ---------------------------------------------------------------
     20. GSAP SCROLLTRIGGER — SUBTLE PARALLAX ON HERO SHAPES
     --------------------------------------------------------------- */
  (function parallaxModule(){
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.float-shape, .float-dot').forEach((el, i) => {
      gsap.to(el, {
        y: (i % 2 === 0) ? -60 : 60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    });

    gsap.to('.hero__glow--a', {
      y: 80, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  })();

  /* ---------------------------------------------------------------
     21. FOOTER YEAR
     --------------------------------------------------------------- */
  (function footerYearModule(){
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();

});