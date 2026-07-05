/* =====================================================================
   DINARA MATH & IT — Profile / Personal Dashboard
   ===================================================================== */

const UIProfile = {
  activeTab: "overview",

  render(){
    this.renderHeader();
    this.bindTabs();
    this.renderActivePanel();
  },

  renderHeader(){
    const s = Store.state;
    document.getElementById("profile-name").textContent = s.profile.name;
    document.getElementById("profile-email").textContent = s.profile.email;
    document.getElementById("profile-level").textContent = s.level;
    document.getElementById("profile-xp-current").textContent = Utils.formatNumber(s._xpIntoLevel);
    document.getElementById("profile-xp-next").textContent = Utils.formatNumber(s._xpForNextLevel);
    document.getElementById("profile-xp-fill").style.width = `${Math.min(100, (s._xpIntoLevel / s._xpForNextLevel) * 100)}%`;
    document.getElementById("profile-streak").textContent = s.streak;
    document.getElementById("header-streak").textContent = s.streak;
  },

  bindTabs(){
    document.querySelectorAll("#profile-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#profile-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.dataset.profileTab;
        this.renderActivePanel();
      });
    });
  },

  renderActivePanel(){
    ["overview", "courses", "progress", "achievements", "certificates", "settings"].forEach(tab => {
      document.getElementById(`profile-panel-${tab}`).classList.toggle("hidden", tab !== this.activeTab);
    });
    if(this.activeTab === "overview") this.renderOverview();
    if(this.activeTab === "courses") this.renderMyCourses();
    if(this.activeTab === "progress") this.renderProgressCharts();
    if(this.activeTab === "achievements") this.renderAchievements();
    if(this.activeTab === "certificates") this.renderCertificates();
    if(this.activeTab === "settings") this.renderSettings();
  },

  renderOverview(){
    const s = Store.state;
    document.getElementById("stat-hours").textContent = s.hoursLearned;
    document.getElementById("stat-tasks").textContent = s.tasksSolved;
    document.getElementById("stat-tests").textContent = s.testsCompleted;
    document.getElementById("stat-badges").textContent = s.unlockedBadges.length;

    const enrolledIds = Object.keys(s.enrolledCourses).filter(id => !s.completedCourses.includes(id));
    const continueBlock = document.getElementById("continue-learning");
    if(enrolledIds.length === 0){
      continueBlock.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>Пока нет активных курсов. Загляните в каталог, чтобы начать обучение!</p></div>`;
    } else {
      const id = enrolledIds[0];
      const course = ALL_COURSES.find(c => c.id === id);
      const progress = s.enrolledCourses[id].progress;
      continueBlock.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:var(--sp-5); flex-wrap:wrap;">
          <div>
            <p style="font-size:var(--fs-xs); color:var(--text-soft); margin-bottom:4px;">Продолжить обучение</p>
            <h4 style="font-size:var(--fs-md);">${Utils.esc(course.title)}</h4>
            <div class="progress-track" style="width:220px; margin-top:var(--sp-2);"><div class="progress-fill" style="width:${progress}%"></div></div>
          </div>
          <button class="btn btn-primary" id="continue-course-btn">Продолжить →</button>
        </div>
      `;
      document.getElementById("continue-course-btn").addEventListener("click", () => {
        Router.navigate("course-detail", { id: course.id });
      });
    }

    this.renderHeatmap();
  },

  renderHeatmap(){
    const el = document.getElementById("activity-heatmap");
    const activity = Store.state.activity.slice(-182);
    el.innerHTML = activity.map(level => `<div class="heat-cell" data-level="${level}"></div>`).join("");
  },

  renderMyCourses(){
    const grid = document.getElementById("my-courses-grid");
    const ids = Object.keys(Store.state.enrolledCourses);
    if(ids.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🎒</div><p>Вы ещё не записаны ни на один курс.</p></div>`;
      return;
    }
    const courses = ids.map(id => ALL_COURSES.find(c => c.id === id)).filter(Boolean);
    grid.innerHTML = courses.map(c => UICourses.courseCardHTML(c)).join("");
    UICourses.bindCourseCardEvents(grid);
  },

  renderProgressCharts(){
    this.drawDirectionsChart();
    this.drawWeeklyChart();
  },

  drawDirectionsChart(){
    const canvas = document.getElementById("chart-directions");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mathCount = Object.keys(Store.state.enrolledCourses).filter(id => id.startsWith("math-")).length;
    const csCount = Object.keys(Store.state.enrolledCourses).filter(id => id.startsWith("cs-")).length;
    const total = Math.max(1, mathCount + csCount);
    const data = [
      { label: "Математика", value: mathCount, color: "#6C5CE7" },
      { label: "Информатика", value: csCount, color: "#00B8A9" },
    ];
    const cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 20;
    let start = -Math.PI / 2;
    data.forEach(d => {
      const angle = (d.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      start += angle;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--surface-bg") || "#fff";
    ctx.fill();
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--color-ink") || "#000";
    ctx.font = "600 20px 'Space Grotesk'";
    ctx.textAlign = "center";
    ctx.fillText(`${total}`, cx, cy + 4);
    ctx.font = "11px 'Inter'";
    ctx.fillText("курсов", cx, cy + 22);
  },

  drawWeeklyChart(){
    const canvas = document.getElementById("chart-weekly");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const days = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
    const values = Store.state.activity.slice(-7).map(v => v * 1.5 + Math.random() * 1);
    const max = Math.max(...values, 1);
    const barWidth = canvas.width / (days.length * 2);
    days.forEach((d, i) => {
      const h = (values[i] / max) * (canvas.height - 50);
      const x = i * (canvas.width / days.length) + barWidth / 2;
      const y = canvas.height - 30 - h;
      const grad = ctx.createLinearGradient(0, y, 0, canvas.height - 30);
      grad.addColorStop(0, "#6C5CE7");
      grad.addColorStop(1, "#00B8A9");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, h, 6) : ctx.rect(x, y, barWidth, h);
      ctx.fill();
      ctx.fillStyle = "#9AA0B4";
      ctx.font = "11px Inter";
      ctx.textAlign = "center";
      ctx.fillText(d, x + barWidth / 2, canvas.height - 10);
    });
  },

  renderAchievements(){
    const grid = document.getElementById("badges-grid");
    grid.innerHTML = BADGES.map(b => {
      const unlocked = Store.state.unlockedBadges.includes(b.id);
      return `
        <div class="badge-item card-glass ${unlocked ? "unlocked" : ""}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-name">${Utils.esc(b.name)}</div>
          <div class="badge-desc">${Utils.esc(b.desc)}</div>
        </div>
      `;
    }).join("");
  },

  renderCertificates(){
    const grid = document.getElementById("certificates-grid");
    const certs = Store.state.certificates;
    if(certs.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">🎓</div><p>Завершите курс, чтобы получить первый сертификат.</p></div>`;
      return;
    }
    grid.innerHTML = certs.map((cert, i) => `
      <div class="certificate-card card-glass">
        <div class="certificate-preview">
          <div>
            <div style="font-size:var(--fs-xs); opacity:0.85; margin-bottom:6px;">СЕРТИФИКАТ</div>
            <div style="font-size:var(--fs-md); font-weight:700;">${Utils.esc(cert.courseTitle)}</div>
          </div>
        </div>
        <p style="font-size:var(--fs-sm); color:var(--text-soft); margin-bottom:var(--sp-3);">Выдан ${cert.date}</p>
        <button class="btn btn-primary btn-sm" data-cert-index="${i}">Скачать PDF</button>
      </div>
    `).join("");
    grid.querySelectorAll("[data-cert-index]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cert = certs[btn.dataset.certIndex];
        Certificates.generate(cert.courseTitle, Store.state.profile.name, cert.date);
      });
    });
  },

  renderSettings(){
    document.getElementById("settings-name").value = Store.state.profile.name;
    document.getElementById("settings-email").value = Store.state.profile.email;
    document.querySelectorAll(".theme-opt").forEach(opt => {
      opt.classList.toggle("active", opt.dataset.themeChoice === Store.state.theme);
      opt.onclick = () => {
        document.querySelectorAll(".theme-opt").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        App.setTheme(opt.dataset.themeChoice);
      };
    });
    document.getElementById("settings-save").onclick = () => {
      Store.state.profile.name = document.getElementById("settings-name").value || Store.state.profile.name;
      Store.state.profile.email = document.getElementById("settings-email").value || Store.state.profile.email;
      Store.save();
      this.renderHeader();
      Utils.toast("Профиль обновлён", "success", "✅");
    };
  },
};
