/* =====================================================================
   DINARA MATH & IT — Utilities
   ===================================================================== */

const Utils = {

  /* ---- Toast notifications ---- */
  toast(message, type = "info", icon = ""){
    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add("leaving");
      setTimeout(() => el.remove(), 400);
    }, 3200);
  },

  /* ---- Number formatting ---- */
  formatNumber(n){
    return new Intl.NumberFormat("ru-RU").format(n);
  },

  formatPrice(n){
    if(n === 0) return "Бесплатно";
    return `${this.formatNumber(n)} ₸`;
  },

  levelLabel(level){
    const labels = { beginner: "Начинающий", intermediate: "Средний", advanced: "Продвинутый" };
    return labels[level] || level;
  },

  directionLabel(direction){
    return direction === "math" ? "Математика" : "Информатика";
  },

  /* ---- Animated counters ---- */
  animateCounter(el, target, decimal = 0, duration = 1400){
    const start = 0;
    const startTime = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      el.textContent = decimal > 0 ? (value / Math.pow(10, decimal)).toFixed(decimal) : Math.round(value).toString();
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = decimal > 0 ? (target / Math.pow(10, decimal)).toFixed(decimal) : target.toString();
    }
    requestAnimationFrame(tick);
  },

  initCounters(root = document){
    const counters = root.querySelectorAll("[data-count]");
    if(typeof IntersectionObserver === "undefined"){
      // No observer support: just show final numbers immediately instead of
      // leaving them stuck at their placeholder "0".
      counters.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const decimal = parseInt(el.dataset.decimal || "0", 10);
        el.textContent = decimal > 0 ? (target / Math.pow(10, decimal)).toFixed(decimal) : target.toString();
      });
      return;
    }
    try{
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const decimal = parseInt(el.dataset.decimal || "0", 10);
            this.animateCounter(el, target, decimal);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => obs.observe(c));
    }catch(e){
      console.warn("initCounters failed, showing static values", e);
      counters.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        el.textContent = target.toString();
      });
    }
  },

  /* ---- Scroll reveal ---- */
  initScrollReveal(root = document){
    const items = root.querySelectorAll(".reveal-up");
    if(typeof IntersectionObserver === "undefined"){
      // No observer support: leave elements in their default fully-visible
      // state (see animations.css) — never gate content behind a feature
      // that might not exist.
      return;
    }
    try{
      document.documentElement.classList.add("js-reveal-ready");
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      items.forEach(i => {
        // Elements already marked in-view (from a previous render pass)
        // don't need to be re-armed — avoids re-hiding visible content.
        if(!i.classList.contains("in-view")) obs.observe(i);
      });
      // Safety net: if an element somehow never intersects (e.g. hidden
      // inside a view that isn't shown yet), reveal it anyway after a
      // short delay so content is never permanently stuck invisible.
      setTimeout(() => {
        items.forEach(i => i.classList.add("in-view"));
      }, 2500);
    }catch(e){
      console.warn("initScrollReveal failed, revealing content directly", e);
      document.documentElement.classList.remove("js-reveal-ready");
    }
  },

  /* ---- Ripple effect ---- */
  attachRipple(el){
    el.classList.add("ripple");
    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      const circle = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      circle.className = "ripple-circle";
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  },

  initRipples(root = document){
    try{
      root.querySelectorAll(".btn, .tab-btn, .tool-card, .direction-card").forEach(el => {
        if(!el._rippleAttached){
          this.attachRipple(el);
          el._rippleAttached = true;
        }
      });
    }catch(e){
      console.warn("initRipples failed (non-critical)", e);
    }
  },

  /* ---- Confetti ---- */
  fireConfetti(){
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#6C5CE7", "#00B8A9", "#FF6B6B", "#F5A623"];
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      r: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: -6 + Math.random() * 12,
    }));
    let frame = 0;
    const maxFrames = 180;
    function draw(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      frame++;
      if(frame < maxFrames) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  },

  /* ---- Debounce ---- */
  debounce(fn, delay = 250){
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /* ---- Simple template escape ---- */
  esc(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  /* ---- Query helper ---- */
  qs(sel, root = document){ return root.querySelector(sel); },
  qsa(sel, root = document){ return Array.from(root.querySelectorAll(sel)); },
};
