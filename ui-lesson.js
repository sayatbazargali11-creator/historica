/* =====================================================================
   DINARA MATH & IT — Lesson Page
   ===================================================================== */

const UILesson = {
  currentCourse: null,
  currentLessonId: null,
  activeTab: "theory",
  testState: null,

  flattenLessons(course){
    const flat = [];
    course.curriculum.forEach(mod => mod.lessons.forEach(l => flat.push(l)));
    return flat;
  },

  render(courseId, lessonId){
    const course = ALL_COURSES.find(c => c.id === courseId);
    const root = document.getElementById("lesson-root");
    if(!course){
      root.innerHTML = `<div class="container page-pad"><div class="empty-state"><p>Урок не найден.</p></div></div>`;
      return;
    }
    this.currentCourse = course;
    const flat = this.flattenLessons(course);
    const lesson = flat.find(l => l.id === lessonId) || flat[0];
    this.currentLessonId = lesson.id;
    this.activeTab = "theory";

    const idx = flat.findIndex(l => l.id === lesson.id);
    const prevLesson = flat[idx - 1];
    const nextLesson = flat[idx + 1];
    const enrollment = Store.state.enrolledCourses[course.id];

    root.innerHTML = `
      <div class="container">
        <div class="lesson-topbar">
          <div>
            <button class="btn btn-ghost btn-sm" id="back-to-course">← ${Utils.esc(course.title)}</button>
          </div>
          <div class="progress-track" style="width:200px;">
            <div class="progress-fill" style="width:${enrollment ? enrollment.progress : 0}%"></div>
          </div>
        </div>

        <div class="lesson-layout">
          <div>
            <h1 style="font-size:var(--fs-xl); margin-bottom:var(--sp-5);">${Utils.esc(lesson.title)}</h1>

            <div class="lesson-tabs">
              <button class="tab-btn active" data-tab="theory">Теория</button>
              <button class="tab-btn" data-tab="practice">Практика</button>
              <button class="tab-btn" data-tab="test">Тест</button>
              <button class="tab-btn" data-tab="faq">Обсуждение</button>
            </div>

            <div id="lesson-tab-content"></div>

            <div class="nav-lesson-btns">
              <button class="btn btn-ghost" id="prev-lesson-btn" ${!prevLesson ? "disabled" : ""}>← Предыдущий урок</button>
              <button class="btn btn-primary" id="mark-done-btn">Отметить как пройденный</button>
              <button class="btn btn-ghost" id="next-lesson-btn" ${!nextLesson ? "disabled" : ""}>Следующий урок →</button>
            </div>
          </div>

          <aside class="lesson-sidebar card-glass">
            <div style="padding: var(--sp-4) var(--sp-4) 0;">
              <p style="font-weight:600; font-size:var(--fs-sm);">Содержание курса</p>
            </div>
            <div class="sidebar-lesson-list">
              ${flat.map(l => {
                const done = enrollment && enrollment.completedLessons.includes(l.id);
                return `
                <div class="sidebar-lesson-item ${l.id === lesson.id ? "current" : ""}" data-lesson-id="${l.id}">
                  <span>${done ? "✅" : "⚪"}</span>
                  <span style="flex:1;">${Utils.esc(l.title)}</span>
                </div>`;
              }).join("")}
            </div>
          </aside>
        </div>
      </div>
    `;

    this.renderTabContent(lesson);
    this.bindEvents(course, lesson, prevLesson, nextLesson);
  },

  renderTabContent(lesson){
    const container = document.getElementById("lesson-tab-content");
    if(this.activeTab === "theory") container.innerHTML = this.theoryHTML(lesson);
    else if(this.activeTab === "practice") container.innerHTML = this.practiceHTML(lesson);
    else if(this.activeTab === "test") container.innerHTML = this.testHTML(lesson);
    else container.innerHTML = this.faqHTML();

    if(this.activeTab === "theory") this.bindVideoControls();
    if(this.activeTab === "test") this.bindTestEvents(lesson);
    if(this.activeTab === "practice") this.bindPracticeEvents(lesson);
  },

  theoryHTML(lesson){
    return `
      <div class="video-player">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="white" opacity="0.85"><circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.15)"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>
        <div class="video-controls">
          <button id="video-play-btn">▶</button>
          <div class="video-progress" id="video-progress-track"><div class="video-progress-fill" id="video-progress-fill"></div></div>
          <span class="mono" id="video-time" style="font-size:12px;">02:14 / 07:40</span>
          <select class="speed-select" id="video-speed">
            <option>0.75x</option>
            <option selected>1x</option>
            <option>1.25x</option>
            <option>1.5x</option>
            <option>2x</option>
          </select>
        </div>
      </div>
      <div class="lesson-theory">
        <p>В этом уроке разбирается ключевая идея темы «${Utils.esc(lesson.title)}». Мы рассмотрим определение, разберём пример пошагово и закрепим материал в практическом блоке.</p>
        <div class="formula-block">f(x + h) − f(x)&nbsp;&nbsp;&nbsp;&nbsp;f'(x) = lim ────────────────<br>h→0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;h</div>
        <p>Обратите внимание на связь между графическим представлением и алгебраическим выводом — понимание обеих сторон одной идеи закрепляет материал значительно лучше, чем механическое запоминание формулы.</p>
      </div>
    `;
  },

  bindVideoControls(){
    const playBtn = document.getElementById("video-play-btn");
    const track = document.getElementById("video-progress-track");
    const fill = document.getElementById("video-progress-fill");
    let playing = false;
    playBtn.addEventListener("click", () => {
      playing = !playing;
      playBtn.textContent = playing ? "⏸" : "▶";
      Utils.toast(playing ? "Видео воспроизводится" : "Пауза", "info", "🎬");
    });
    track.addEventListener("click", (e) => {
      const rect = track.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    });
  },

  practiceHTML(lesson){
    return `
      <div class="card-glass" style="padding:var(--sp-6);">
        <h3 style="font-size:var(--fs-md); margin-bottom:var(--sp-3);">Интерактивное задание</h3>
        <p style="color:var(--text-soft); font-size:var(--fs-sm); margin-bottom:var(--sp-5);">Реши задачу ниже и нажми «Проверить». Если не получается — открой подсказку.</p>
        <p style="font-family:var(--font-mono); margin-bottom:var(--sp-4);">Найдите производную функции f(x) = 3x² + 2x</p>
        <input type="text" class="text-field" id="practice-answer" placeholder="Введите ответ, например: 6x + 2" style="width:100%; margin-bottom:var(--sp-4);">
        <div style="display:flex; gap:var(--sp-3); margin-bottom:var(--sp-4);">
          <button class="btn btn-primary" id="practice-check-btn">Проверить</button>
          <button class="btn btn-ghost" id="practice-hint-btn">💡 Подсказка</button>
        </div>
        <div id="practice-feedback"></div>
        <div id="practice-hint" class="hidden" style="margin-top:var(--sp-3); color:var(--text-soft); font-size:var(--fs-sm);">
          Подсказка: используйте правило d/dx[xⁿ] = n·xⁿ⁻¹ для каждого слагаемого отдельно.
        </div>
      </div>
    `;
  },

  bindPracticeEvents(){
    const checkBtn = document.getElementById("practice-check-btn");
    const hintBtn = document.getElementById("practice-hint-btn");
    if(!checkBtn) return;
    checkBtn.addEventListener("click", () => {
      const val = document.getElementById("practice-answer").value.replace(/\s/g, "").toLowerCase();
      const feedback = document.getElementById("practice-feedback");
      const correctAnswers = ["6x+2", "2+6x"];
      if(correctAnswers.includes(val)){
        feedback.innerHTML = `<p style="color:var(--color-success); margin-top:var(--sp-3);">✅ Верно! Отличная работа.</p>`;
        Store.incTasksSolved(1);
        Store.addXP(15, "practice");
        Utils.toast("+15 XP за решённую задачу", "success", "⭐");
      } else {
        feedback.innerHTML = `<p style="color:var(--color-danger); margin-top:var(--sp-3);">❌ Пока не то. Попробуй ещё раз или открой подсказку.</p>`;
      }
    });
    hintBtn.addEventListener("click", () => {
      document.getElementById("practice-hint").classList.remove("hidden");
    });
  },

  testHTML(lesson){
    const bank = getQuestionBank(this.currentCourse.direction, this.currentCourse.slug);
    this.testState = {
      questions: bank,
      answers: new Array(bank.length).fill(null),
      submitted: false,
      timeLeft: 90,
    };
    return `
      <div class="card-glass" style="padding:var(--sp-6);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--sp-5);">
          <h3 style="font-size:var(--fs-md);">Тест по теме</h3>
          <span class="test-timer" id="test-timer-display">01:30</span>
        </div>
        <div id="test-questions-list">
          ${bank.map((q, i) => `
            <div class="test-question" data-q-index="${i}">
              <p style="font-weight:600;">${i + 1}. ${Utils.esc(q.q)}</p>
              <div class="test-options">
                ${q.options.map((opt, oi) => `
                  <div class="test-option" data-option-index="${oi}">${Utils.esc(opt)}</div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-primary" id="submit-test-btn" style="margin-top:var(--sp-5);">Завершить тест</button>
        <div id="test-result-container"></div>
      </div>
    `;
  },

  bindTestEvents(lesson){
    const container = document.getElementById("lesson-tab-content");
    if(!container.querySelector("#test-questions-list")) return;

    container.querySelectorAll(".test-question").forEach(qEl => {
      const qIndex = parseInt(qEl.dataset.qIndex, 10);
      qEl.querySelectorAll(".test-option").forEach(optEl => {
        optEl.addEventListener("click", () => {
          if(this.testState.submitted) return;
          qEl.querySelectorAll(".test-option").forEach(o => o.classList.remove("selected"));
          optEl.classList.add("selected");
          this.testState.answers[qIndex] = parseInt(optEl.dataset.optionIndex, 10);
        });
      });
    });

    this.testTimerInterval && clearInterval(this.testTimerInterval);
    const timerDisplay = document.getElementById("test-timer-display");
    this.testTimerInterval = setInterval(() => {
      if(!this.testState || this.testState.submitted){ clearInterval(this.testTimerInterval); return; }
      this.testState.timeLeft--;
      const m = Math.floor(this.testState.timeLeft / 60).toString().padStart(2, "0");
      const s = (this.testState.timeLeft % 60).toString().padStart(2, "0");
      timerDisplay.textContent = `${m}:${s}`;
      if(this.testState.timeLeft <= 0){
        clearInterval(this.testTimerInterval);
        this.submitTest();
      }
    }, 1000);

    document.getElementById("submit-test-btn").addEventListener("click", () => this.submitTest());
  },

  submitTest(){
    if(!this.testState || this.testState.submitted) return;
    this.testState.submitted = true;
    clearInterval(this.testTimerInterval);

    let correctCount = 0;
    this.testState.questions.forEach((q, i) => {
      const qEl = document.querySelector(`.test-question[data-q-index="${i}"]`);
      const selected = this.testState.answers[i];
      qEl.querySelectorAll(".test-option").forEach((optEl, oi) => {
        if(oi === q.correct) optEl.classList.add("correct");
        else if(oi === selected) optEl.classList.add("wrong");
      });
      if(selected === q.correct) correctCount++;
    });

    const total = this.testState.questions.length;
    const pct = Math.round((correctCount / total) * 100);
    document.getElementById("test-result-container").innerHTML = `
      <div class="test-result-card">
        <div class="test-result-score">${pct}%</div>
        <p style="color:var(--text-soft); margin: var(--sp-3) 0 var(--sp-5);">Правильных ответов: ${correctCount} из ${total}</p>
        <button class="btn btn-ghost" id="retry-test-btn">Пройти ещё раз</button>
      </div>
    `;
    document.getElementById("retry-test-btn").addEventListener("click", () => {
      this.renderTabContent({ title: "" });
    });

    Store.recordTestResult(this.currentCourse.title, correctCount, total);
    const xpGain = 10 + correctCount * 5;
    Store.addXP(xpGain, "test");
    Utils.toast(`Тест завершён: +${xpGain} XP`, pct >= 80 ? "success" : "info", "📝");
    if(pct === 100) Utils.fireConfetti();
  },

  faqHTML(){
    return `
      <div class="card-glass" style="padding:var(--sp-6);">
        <p style="color:var(--text-soft); font-size:var(--fs-sm);">Раздел обсуждения появится здесь после того, как ученики начнут оставлять вопросы к этому уроку. Пока можно написать преподавателю напрямую через раздел «Поддержка».</p>
      </div>
    `;
  },

  bindEvents(course, lesson, prevLesson, nextLesson){
    document.getElementById("back-to-course").addEventListener("click", () => {
      Router.navigate("course-detail", { id: course.id });
    });

    document.querySelectorAll("#lesson-tab-content, .lesson-tabs .tab-btn").length;
    document.querySelectorAll(".lesson-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".lesson-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.dataset.tab;
        this.renderTabContent(lesson);
      });
    });

    document.getElementById("mark-done-btn").addEventListener("click", () => {
      Store.markLessonDone(course.id, lesson.id);
      Store.addXP(20, "lesson");
      Utils.toast("Урок отмечен как пройденный (+20 XP)", "success", "✅");
      if(Store.state.completedCourses.includes(course.id)){
        Utils.fireConfetti();
        Utils.toast("Курс завершён! Сертификат готов в профиле 🎓", "success", "🎉");
      }
      this.render(course.id, lesson.id);
    });

    if(prevLesson){
      document.getElementById("prev-lesson-btn").addEventListener("click", () => {
        Router.navigate("lesson", { courseId: course.id, lessonId: prevLesson.id });
      });
    }
    if(nextLesson){
      document.getElementById("next-lesson-btn").addEventListener("click", () => {
        Router.navigate("lesson", { courseId: course.id, lessonId: nextLesson.id });
      });
    }

    document.querySelectorAll(".sidebar-lesson-item").forEach(item => {
      item.addEventListener("click", () => {
        Router.navigate("lesson", { courseId: course.id, lessonId: item.dataset.lessonId });
      });
    });
  },
};
