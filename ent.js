/* =====================================================================
   DINARA MATH & IT — ЕНТ Exam Preparation
   ===================================================================== */

const UIEnt = {
  activeSubject: "math",

  render(){
    this.renderSubjects();
    this.renderTopicsAndMockTest();
  },

  renderSubjects(){
    const wrap = document.getElementById("ent-subjects");
    wrap.innerHTML = ENT_SUBJECTS.map(s => `
      <button class="ent-subject-card card-glass ${s.id === this.activeSubject ? "active" : ""}" data-subject="${s.id}">
        <div style="font-size:28px; margin-bottom:8px;">${s.icon}</div>
        <div style="font-weight:600;">${Utils.esc(s.title)}</div>
      </button>
    `).join("");
    wrap.querySelectorAll("[data-subject]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeSubject = btn.dataset.subject;
        this.render();
      });
    });
  },

  renderTopicsAndMockTest(){
    const root = document.getElementById("ent-panel-root");
    const topics = ENT_TOPICS[this.activeSubject] || [];
    root.innerHTML = `
      <div class="course-detail-body" style="padding-top:0;">
        <div>
          <h3 class="mini-title" style="margin-top:0;">Темы</h3>
          <div class="ent-topic-list">
            ${topics.map((t, i) => `
              <div class="curriculum-item">
                <span class="curriculum-check">${i < 2 ? "✓" : ""}</span>
                <span style="flex:1;">${Utils.esc(t)}</span>
                <span class="mono" style="font-size:var(--fs-xs); color:var(--text-soft);">${8 + i}&nbsp;заданий</span>
              </div>
            `).join("")}
          </div>
        </div>
        <aside class="card-glass" style="padding:var(--sp-6);">
          <h3 style="font-size:var(--fs-md); margin-bottom:var(--sp-3);">Пробный тест</h3>
          <p style="color:var(--text-soft); font-size:var(--fs-sm); margin-bottom:var(--sp-5);">10 вопросов · 5 минут · случайная выборка по теме</p>
          <button class="btn btn-primary btn-block" id="start-mock-test-btn">Начать пробный тест</button>
          <div style="margin-top:var(--sp-6);">
            <h4 style="font-size:var(--fs-sm); margin-bottom:var(--sp-3);">Аналитика ошибок</h4>
            <div id="ent-error-analytics"></div>
          </div>
        </aside>
      </div>
      <div id="ent-mock-test-root" style="margin-top:var(--sp-7);"></div>
    `;
    this.renderErrorAnalytics();
    document.getElementById("start-mock-test-btn").addEventListener("click", () => this.startMockTest());
  },

  renderErrorAnalytics(){
    const el = document.getElementById("ent-error-analytics");
    const history = Store.state.testHistory.slice(-5);
    if(history.length === 0){
      el.innerHTML = `<p style="font-size:var(--fs-xs); color:var(--text-soft);">Пройдите тест, чтобы увидеть статистику ошибок.</p>`;
      return;
    }
    el.innerHTML = history.map(h => {
      const pct = Math.round((h.correctCount / h.totalCount) * 100);
      return `
        <div style="margin-bottom:var(--sp-3);">
          <div style="display:flex; justify-content:space-between; font-size:var(--fs-xs); margin-bottom:4px;">
            <span>${Utils.esc(h.topic).slice(0, 22)}</span><span>${pct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%; background:${pct >= 70 ? "linear-gradient(90deg,#00B8A9,#6C5CE7)" : "linear-gradient(90deg,#FF6B6B,#F5A623)"}"></div></div>
        </div>
      `;
    }).join("");
  },

  startMockTest(){
    const bank = getQuestionBank(this.activeSubject === "informatics" ? "cs" : "math");
    const questions = [...bank, ...bank].slice(0, 10);
    const root = document.getElementById("ent-mock-test-root");
    this.mockState = { questions, answers: new Array(questions.length).fill(null), timeLeft: 300, submitted: false };

    root.innerHTML = `
      <div class="card-glass" style="padding:var(--sp-6);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--sp-5);">
          <h3 style="font-size:var(--fs-md);">Пробный тест ЕНТ</h3>
          <span class="test-timer" id="mock-timer">05:00</span>
        </div>
        <div id="mock-questions-list">
          ${questions.map((q, i) => `
            <div class="test-question" data-q-index="${i}">
              <p style="font-weight:600;">${i + 1}. ${Utils.esc(q.q)}</p>
              <div class="test-options">
                ${q.options.map((opt, oi) => `<div class="test-option" data-option-index="${oi}">${Utils.esc(opt)}</div>`).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-primary" id="submit-mock-btn" style="margin-top:var(--sp-5);">Завершить тест</button>
        <div id="mock-result-container"></div>
      </div>
    `;
    root.scrollIntoView({ behavior: "smooth" });

    root.querySelectorAll(".test-question").forEach(qEl => {
      const qi = parseInt(qEl.dataset.qIndex, 10);
      qEl.querySelectorAll(".test-option").forEach(optEl => {
        optEl.addEventListener("click", () => {
          if(this.mockState.submitted) return;
          qEl.querySelectorAll(".test-option").forEach(o => o.classList.remove("selected"));
          optEl.classList.add("selected");
          this.mockState.answers[qi] = parseInt(optEl.dataset.optionIndex, 10);
        });
      });
    });

    this.mockInterval && clearInterval(this.mockInterval);
    const timerEl = document.getElementById("mock-timer");
    this.mockInterval = setInterval(() => {
      if(this.mockState.submitted){ clearInterval(this.mockInterval); return; }
      this.mockState.timeLeft--;
      const m = Math.floor(this.mockState.timeLeft / 60).toString().padStart(2, "0");
      const s = (this.mockState.timeLeft % 60).toString().padStart(2, "0");
      timerEl.textContent = `${m}:${s}`;
      if(this.mockState.timeLeft <= 0){ clearInterval(this.mockInterval); this.submitMockTest(); }
    }, 1000);

    document.getElementById("submit-mock-btn").addEventListener("click", () => this.submitMockTest());
  },

  submitMockTest(){
    if(!this.mockState || this.mockState.submitted) return;
    this.mockState.submitted = true;
    clearInterval(this.mockInterval);
    let correct = 0;
    this.mockState.questions.forEach((q, i) => {
      const qEl = document.querySelector(`#mock-questions-list .test-question[data-q-index="${i}"]`);
      const selected = this.mockState.answers[i];
      qEl.querySelectorAll(".test-option").forEach((optEl, oi) => {
        if(oi === q.correct) optEl.classList.add("correct");
        else if(oi === selected) optEl.classList.add("wrong");
      });
      if(selected === q.correct) correct++;
    });
    const total = this.mockState.questions.length;
    const pct = Math.round((correct / total) * 100);
    document.getElementById("mock-result-container").innerHTML = `
      <div class="test-result-card">
        <div class="test-result-score">${pct}%</div>
        <p style="color:var(--text-soft); margin: var(--sp-3) 0;">Правильно: ${correct} из ${total}</p>
      </div>
    `;
    Store.recordTestResult(`ЕНТ: ${ENT_SUBJECTS.find(s => s.id === this.activeSubject).title}`, correct, total);
    Store.addXP(15 + correct * 5, "ent-test");
    if(pct >= 80) Store.unlockBadge("ent-ready");
    this.renderErrorAnalytics();
    if(pct === 100) Utils.fireConfetti();
  },
};
