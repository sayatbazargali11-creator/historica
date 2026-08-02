/* ==========================================================
   ADRIAN VOSS PORTFOLIO — main script
   Vanilla JS. No dependencies.
   ========================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     LOADER
  --------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
      revealHero();
    }, 1200);
  });

  /* ---------------------------------------------------------
     THEME TOGGLE
  --------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorageGet('theme') || 'dark';
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorageSet('theme', isLight ? 'dark' : 'light');
    flashTransition();
  });

  function flashTransition(){
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:var(--bg);z-index:9998;opacity:0;pointer-events:none;transition:opacity .3s ease;';
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0.0'; });
    setTimeout(() => flash.remove(), 350);
  }

  // safe localStorage wrappers (works even if storage disabled)
  function localStorageGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function localStorageSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  /* ---------------------------------------------------------
     NAVBAR
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive:true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia('(min-width: 901px)').matches) {
    const glow = document.getElementById('cursorGlow');
    const dot = document.getElementById('cursorDot');
    let gx=0, gy=0, dx=0, dy=0;
    window.addEventListener('mousemove', e => { gx=e.clientX; gy=e.clientY; dx=e.clientX; dy=e.clientY; });
    function loopCursor(){
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      requestAnimationFrame(loopCursor);
    }
    loopCursor();

    document.querySelectorAll('a, button, .cert-card, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  }

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS
  --------------------------------------------------------- */
  if (!reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        btn.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------------------------------------------------
     RIPPLE EFFECT ON BUTTONS
  --------------------------------------------------------- */
  document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e){
      const r = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(r.width, r.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size/2) + 'px';
      ripple.style.top = (e.clientY - r.top - size/2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------------
     HERO TYPING EFFECT
  --------------------------------------------------------- */
  const roles = ['Full-Stack Engineer', 'Product Designer', 'Creative Developer', 'Systems Thinker'];
  const roleEl = document.getElementById('heroRole');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIdx];
    if (!deleting){
      charIdx++;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length){ deleting = true; setTimeout(typeLoop, 1600); return; }
    } else {
      charIdx--;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0){ deleting = false; roleIdx = (roleIdx+1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  typeLoop();

  /* ---------------------------------------------------------
     HERO ENTRANCE
  --------------------------------------------------------- */
  function revealHero(){
    document.querySelectorAll('.hero-anim').forEach((el,i) => {
      setTimeout(() => el.classList.add('in'), i*120);
    });
  }

  /* ---------------------------------------------------------
     PARALLAX ON SCROLL (hero visual + bg)
  --------------------------------------------------------- */
  if (!reduceMotion) {
    const heroVisual = document.querySelector('.portrait-frame');
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        if (heroVisual) heroVisual.style.transform = `translateY(${y*0.18}px)`;
        if (heroBg) heroBg.style.transform = `translateY(${y*0.1}px)`;
      }
    }, { passive:true });
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        if (entry.target.classList.contains('counter')) animateCounter(entry.target);
        if (entry.target.classList.contains('skill-card')) fillSkillBar(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => io.observe(el));

  // counters may live inside non-.reveal wrappers (e.g. stat cards) — observe them too
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

  /* ---------------------------------------------------------
     ANIMATED COUNTERS
  --------------------------------------------------------- */
  function animateCounter(el){
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (el.dataset.suffix || '');
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     SKILL BARS
  --------------------------------------------------------- */
  function fillSkillBar(card){
    const fill = card.querySelector('.skill-bar-fill');
    if (fill) fill.style.width = fill.dataset.level + '%';
  }

  /* ---------------------------------------------------------
     PROJECT FILTERS
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------------------------------------------------------
     CERTIFICATES — load from JSON, render, modal
  --------------------------------------------------------- */
  const certGrid = document.getElementById('certGrid');
  const modalOverlay = document.getElementById('certModal');
  const modalContent = document.getElementById('modalContent');

  const sealIcon = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M8.5 13.5 6 22l6-3 6 3-2.5-8.5"></path></svg>`;

  async function loadCertificates(){
    try {
      const res = await fetch('data/certificates.json');
      const certs = await res.json();
      renderCertificates(certs);
    } catch(err){
      certGrid.innerHTML = `<p style="color:var(--text-secondary)">Certificates could not be loaded. Check data/certificates.json.</p>`;
      console.error('Certificate load failed', err);
    }
  }

  function renderCertificates(certs){
    certGrid.innerHTML = certs.map((c, i) => `
      <article class="cert-card reveal" data-index="${i}" tabindex="0" role="button" aria-label="Open certificate: ${escapeHtml(c.title)}">
        <div class="cert-media">
          <img src="${c.image}" alt="${escapeHtml(c.title)}" loading="lazy">
          <div class="cert-seal">${sealIcon}</div>
        </div>
        <div class="cert-body">
          <div class="cert-org">${escapeHtml(c.organization)}</div>
          <h3 class="cert-title">${escapeHtml(c.title)}</h3>
          <div class="cert-date">${escapeHtml(c.date)}</div>
          <p class="cert-desc">${escapeHtml(c.shortDescription)}</p>
          <div class="cert-tags">
            ${c.tags.map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    certGrid.querySelectorAll('.cert-card').forEach(card => {
      io.observe(card);
      const open = () => openModal(certs[card.dataset.index]);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }

  function openModal(c){
    modalContent.innerHTML = `
      <div class="modal-media"><img src="${c.image}" alt="${escapeHtml(c.title)}"></div>
      <button class="modal-close" id="modalCloseBtn" aria-label="Close certificate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal-content">
        <div class="modal-org">${escapeHtml(c.organization)}</div>
        <h2 class="modal-title">${escapeHtml(c.title)}</h2>
        <div class="modal-meta">
          <div class="modal-meta-item">Issued<strong>${escapeHtml(c.date)}</strong></div>
          <div class="modal-meta-item">Credential ID<strong>${escapeHtml(c.credentialId)}</strong></div>
        </div>
        <p class="modal-desc">${escapeHtml(c.fullDescription)}</p>
        <div class="modal-skills">
          ${c.skills.map(s => `<span class="tech-pill">${escapeHtml(s)}</span>`).join('')}
        </div>
        ${c.verifyUrl ? `<div class="modal-verify"><a class="btn btn-ghost btn-sm" href="${c.verifyUrl}" target="_blank" rel="noopener">Verify Credential</a></div>` : ''}
      </div>
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    modalOverlay.dataset.lastFocus = document.activeElement ? 'x' : '';
  }

  function closeModal(){
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });

  loadCertificates();

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* ---------------------------------------------------------
     TESTIMONIAL SLIDER
  --------------------------------------------------------- */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const slides = track.children.length;
  let current = 0;

  for (let i=0; i<slides; i++){
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i===0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
    d.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(d);
  }
  function goToSlide(i){
    current = i;
    track.style.transform = `translateX(-${i*100}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d,idx) => d.classList.toggle('active', idx===i));
  }
  let testiTimer = setInterval(() => goToSlide((current+1)%slides), 5500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(testiTimer));
  track.parentElement.addEventListener('mouseleave', () => { testiTimer = setInterval(() => goToSlide((current+1)%slides), 5500); });

  /* ---------------------------------------------------------
     CONTACT FORM (demo — no backend)
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.textContent = 'Sending…';
    setTimeout(() => {
      formStatus.textContent = `Thanks — your message is ready to send. Connect a form backend (e.g. Formspree) to deliver it.`;
      form.reset();
    }, 900);
  });

  /* ---------------------------------------------------------
     BACK TO TOP
  --------------------------------------------------------- */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------
     ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => navIO.observe(s));

  /* ---------------------------------------------------------
     FLOATING PARTICLES (ambient, cheap)
  --------------------------------------------------------- */
  if (!reduceMotion) {
    const pWrap = document.getElementById('particles');
    const count = window.innerWidth < 700 ? 10 : 22;
    for (let i=0; i<count; i++){
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random()*100 + 'vw';
      p.style.animationDuration = (14 + Math.random()*14) + 's';
      p.style.animationDelay = (Math.random()*14) + 's';
      p.style.opacity = (0.15 + Math.random()*0.35).toFixed(2);
      pWrap.appendChild(p);
    }
  }

  /* ---------------------------------------------------------
     CARD TILT (projects + skills)
  --------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia('(min-width: 901px)').matches) {
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

})();