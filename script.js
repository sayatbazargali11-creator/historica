(function(){
  "use strict";

  /* ---------------------------------------------------------
     CONFIG — event date/time (Astana local time)
     --------------------------------------------------------- */
  var EVENT_DATE = new Date("2026-09-25T19:00:00+05:00");

  /* ---------------------------------------------------------
     Preloader
     --------------------------------------------------------- */
  window.addEventListener("load", function(){
    var pre = document.getElementById("preloader");
    setTimeout(function(){ pre.classList.add("done"); }, 900);
    setTimeout(function(){ pre.style.display = "none"; }, 1700);
  });

  /* ---------------------------------------------------------
     Scroll progress + nav state + reveal + timeline fill + fab
     --------------------------------------------------------- */
  var progressEl = document.getElementById("scrollProgress");
  var nav = document.getElementById("siteNav");
  var fabTop = document.getElementById("fabTop");
  var timelineFill = document.getElementById("timelineFill");
  var timelineEl = document.querySelector(".timeline");
  var revealEls = document.querySelectorAll("[data-reveal]");

  function onScroll(){
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressEl.style.width = pct + "%";

    nav.classList.toggle("scrolled", scrollTop > 40);
    fabTop.classList.toggle("show", scrollTop > 600);

    if (timelineEl){
      var rect = timelineEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height;
      var visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
      var fillPct = total > 0 ? (visible / total) * 100 : 0;
      timelineFill.style.height = fillPct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  fabTop.addEventListener("click", function(){
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  /* ---------------------------------------------------------
     Cursor glow (desktop only)
     --------------------------------------------------------- */
  var glow = document.getElementById("cursorGlow");
  if (matchMedia("(hover:hover)").matches){
    window.addEventListener("mousemove", function(e){
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      glow.classList.add("active");
    });
    window.addEventListener("mouseleave", function(){ glow.classList.remove("active"); });
  }

  /* ---------------------------------------------------------
     Hero floating particles
     --------------------------------------------------------- */
  var particleHost = document.getElementById("heroParticles");
  var particleCount = window.innerWidth < 700 ? 18 : 36;
  for (var i=0; i<particleCount; i++){
    var p = document.createElement("span");
    p.className = "p";
    var size = (Math.random()*3 + 1).toFixed(1);
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = (Math.random()*100) + "%";
    p.style.bottom = "-10px";
    p.style.animationDuration = (Math.random()*14 + 10) + "s";
    p.style.animationDelay = (Math.random()*10) + "s";
    particleHost.appendChild(p);
  }

  /* ---------------------------------------------------------
     Countdown
     --------------------------------------------------------- */
  var cdDays = document.getElementById("cdDays");
  var cdHours = document.getElementById("cdHours");
  var cdMinutes = document.getElementById("cdMinutes");
  var cdSeconds = document.getElementById("cdSeconds");

  function pad(n){ return String(n).padStart(2,"0"); }

  function tickEl(el, newVal){
    if (el.textContent === newVal) return;
    el.textContent = newVal;
    el.classList.add("tick");
    setTimeout(function(){ el.classList.remove("tick"); }, 250);
  }

  function updateCountdown(){
    var now = new Date();
    var diff = EVENT_DATE - now;
    if (diff <= 0){
      tickEl(cdDays,"00"); tickEl(cdHours,"00"); tickEl(cdMinutes,"00"); tickEl(cdSeconds,"00");
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    tickEl(cdDays, pad(d));
    tickEl(cdHours, pad(h));
    tickEl(cdMinutes, pad(m));
    tickEl(cdSeconds, pad(s));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------------------------------------------------
     Modal helpers
     --------------------------------------------------------- */
  function openModal(modal){
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".modal").forEach(function(modal){
    modal.querySelectorAll("[data-close]").forEach(function(btn){
      btn.addEventListener("click", function(){ closeModal(modal); });
    });
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape"){
      document.querySelectorAll(".modal.open").forEach(closeModal);
    }
  });

  /* ---------------------------------------------------------
     Ticket modal: view-only, fullscreen zoom/pan/download
     (ticket image lives on the server at assets/tickets/ticket.jpg)
     --------------------------------------------------------- */
  var ticketModal = document.getElementById("ticketModal");
  var openTicketBtn = document.getElementById("openTicketBtn");
  var tmImage = document.getElementById("tmImage");
  var zoomInBtn = document.getElementById("zoomInBtn");
  var zoomOutBtn = document.getElementById("zoomOutBtn");
  var zoomResetBtn = document.getElementById("zoomResetBtn");
  var viewerFrame = document.getElementById("tmViewerFrame");

  var zoomLevel = 1;
  var panX = 0, panY = 0, dragging = false, startX, startY;

  function setZoom(z){
    zoomLevel = Math.min(Math.max(z, 0.5), 4);
    tmImage.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + zoomLevel + ")";
    zoomResetBtn.textContent = Math.round(zoomLevel*100) + "%";
  }

  openTicketBtn.addEventListener("click", function(){
    zoomLevel = 1; panX = 0; panY = 0;
    setZoom(1);
    openModal(ticketModal);
    fireConfetti();
  });

  zoomInBtn.addEventListener("click", function(){ setZoom(zoomLevel + 0.25); });
  zoomOutBtn.addEventListener("click", function(){ setZoom(zoomLevel - 0.25); });
  zoomResetBtn.addEventListener("click", function(){ zoomLevel=1; panX=0; panY=0; setZoom(1); });

  viewerFrame.addEventListener("wheel", function(e){
    e.preventDefault();
    setZoom(zoomLevel + (e.deltaY < 0 ? 0.15 : -0.15));
  }, { passive:false });

  viewerFrame.addEventListener("mousedown", function(e){
    dragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
  });
  window.addEventListener("mousemove", function(e){
    if (!dragging) return;
    panX = e.clientX - startX; panY = e.clientY - startY;
    setZoom(zoomLevel);
  });
  window.addEventListener("mouseup", function(){ dragging = false; });

  // touch pinch/drag (simple)
  var lastTouchDist = null;
  viewerFrame.addEventListener("touchstart", function(e){
    if (e.touches.length === 1){
      dragging = true; startX = e.touches[0].clientX - panX; startY = e.touches[0].clientY - panY;
    } else if (e.touches.length === 2){
      lastTouchDist = touchDist(e.touches);
    }
  }, { passive:true });
  viewerFrame.addEventListener("touchmove", function(e){
    if (e.touches.length === 1 && dragging){
      panX = e.touches[0].clientX - startX; panY = e.touches[0].clientY - startY;
      setZoom(zoomLevel);
    } else if (e.touches.length === 2){
      var d = touchDist(e.touches);
      if (lastTouchDist){ setZoom(zoomLevel + (d - lastTouchDist) * 0.005); }
      lastTouchDist = d;
    }
  }, { passive:true });
  viewerFrame.addEventListener("touchend", function(){ dragging=false; lastTouchDist=null; });
  function touchDist(t){
    var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx*dx + dy*dy);
  }

  /* ---------------------------------------------------------
     Music toggle
     --------------------------------------------------------- */
  var musicFab = document.getElementById("musicFab");
  var bgMusic = document.getElementById("bgMusic");
  var musicUserStopped = false; // true only if user explicitly paused via the fab

  musicFab.addEventListener("click", function(){
    if (bgMusic.paused){
      musicUserStopped = false;
      bgMusic.play().catch(function(){ /* no audio file provided yet */ });
      musicFab.classList.add("playing");
    } else {
      musicUserStopped = true;
      bgMusic.pause();
      musicFab.classList.remove("playing");
    }
  });

  /* ---------------------------------------------------------
     Auto-start music on first scroll down
     Most browsers block audio-with-sound autoplay until the user
     interacts with the page. A scroll counts as that interaction
     in Chrome/Firefox/Edge, so we try to play on the first
     scroll event and keep retrying (silently) until it succeeds
     or the user manually pauses it.
     --------------------------------------------------------- */
  var lastScrollY = window.scrollY || document.documentElement.scrollTop;

  function tryAutoStartMusic(){
    if (musicUserStopped || !bgMusic.paused) return;
    bgMusic.play().then(function(){
      musicFab.classList.add("playing");
    }).catch(function(){ /* still blocked by the browser, will retry on next scroll */ });
  }

  window.addEventListener("scroll", function(){
    var currentY = window.scrollY || document.documentElement.scrollTop;
    if (currentY > lastScrollY){ // only trigger on scroll DOWN
      tryAutoStartMusic();
    }
    lastScrollY = currentY;
  }, { passive:true });

  /* ---------------------------------------------------------
     Confetti (canvas, lightweight)
     --------------------------------------------------------- */
  var canvas = document.getElementById("confettiCanvas");
  var ctx = canvas.getContext("2d");
  function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  var confettiColors = ["#c9a227", "#e8c766", "#9c3247", "#f3ead9"];
  function fireConfetti(){
    var pieces = [];
    var count = window.innerWidth < 700 ? 60 : 110;
    for (var i=0;i<count;i++){
      pieces.push({
        x: canvas.width/2 + (Math.random()-0.5)*200,
        y: canvas.height*0.3,
        vx: (Math.random()-0.5)*9,
        vy: Math.random()*-9 - 3,
        size: Math.random()*6+4,
        color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
        rot: Math.random()*Math.PI,
        vr: (Math.random()-0.5)*0.3,
        gravity: 0.28
      });
    }
    var frame = 0;
    function loop(){
      frame++;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      var alive = false;
      pieces.forEach(function(p){
        p.vy += p.gravity;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.y < canvas.height + 1) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
        ctx.restore();
      });
      if (alive && frame < 260){
        requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0,0,canvas.width,canvas.height);
      }
    }
    loop();
  }

  /* ---------------------------------------------------------
     Congrats chime — a short cheerful arpeggio built with the
     Web Audio API (no external mp3 needed, so it always works).
     --------------------------------------------------------- */
  function playCongratsChime(){
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var actx = new Ctx();
      var notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
      notes.forEach(function(freq, i){
        var start = actx.currentTime + i * 0.11;
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
        osc.connect(gain).connect(actx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) { /* Web Audio not available — fail silently */ }
  }

  /* ---------------------------------------------------------
     Congrats section: celebrate button + one-time auto burst
     --------------------------------------------------------- */
  var celebrateBtn = document.getElementById("celebrateBtn");
  if (celebrateBtn){
    celebrateBtn.addEventListener("click", function(){
      fireConfetti();
      playCongratsChime();
    });
    celebrateBtn.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        fireConfetti();
        playCongratsChime();
      }
    });
  }

  var congratsSection = document.getElementById("congrats");
  if (congratsSection && "IntersectionObserver" in window){
    var congratsFired = false;
    var congratsObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting && !congratsFired){
          congratsFired = true;
          fireConfetti();
          congratsObserver.unobserve(congratsSection);
        }
      });
    }, { threshold: 0.5 });
    congratsObserver.observe(congratsSection);
  }

})();



document.addEventListener('DOMContentLoaded', () => {
  const openUnivBtn = document.getElementById('openUnivModalBtn');
  const closeUnivBtn = document.getElementById('closeUnivModalBtn');
  const univBackdrop = document.getElementById('closeUnivModalBackdrop');
  const univModal = document.getElementById('univModal');

  if (openUnivBtn && univModal) {
    openUnivBtn.addEventListener('click', () => {
      univModal.classList.add('open');
      univModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      univModal.classList.remove('open');
      univModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeUnivBtn) closeUnivBtn.addEventListener('click', closeModal);
    if (univBackdrop) univBackdrop.addEventListener('click', closeModal);
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const openVenueBtn = document.getElementById('openQazaqconcertModalBtn');
  const closeVenueBtn = document.getElementById('closeQazaqconcertModalBtn');
  const venueBackdrop = document.getElementById('closeQazaqconcertModalBackdrop');
  const venueModal = document.getElementById('qazaqconcertModal');

  if (openVenueBtn && venueModal) {
    openVenueBtn.addEventListener('click', () => {
      venueModal.classList.add('open');
      venueModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeVenueModal = () => {
      venueModal.classList.remove('open');
      venueModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeVenueBtn) closeVenueBtn.addEventListener('click', closeVenueModal);
    if (venueBackdrop) venueBackdrop.addEventListener('click', closeVenueModal);
  }
});