/* =====================================================================
   DINARA MATH & IT — Courses Catalog & Detail Page
   ===================================================================== */

const UICourses = {

  filters: {
    direction: "all",
    level: "all",
    duration: "all",
    rating: 0,
    price: "all",
    sort: "popular",
    query: "",
  },

  courseCardHTML(course){
    const enrollment = Store.state.enrolledCourses[course.id];
    const progress = enrollment ? enrollment.progress : 0;
    return `
      <div class="course-card card-glass" data-course-id="${course.id}" style="--cover-a:${course.coverA}; --cover-b:${course.coverB}">
        <div class="course-cover">
          <svg viewBox="0 0 300 150"><path d="M0 100 Q 75 20 150 90 T 300 60" stroke="white" stroke-width="3" fill="none"/></svg>
          <span class="level-badge">${Utils.levelLabel(course.level)}</span>
        </div>
        <div class="course-body">
          <h3>${Utils.esc(course.title)}</h3>
          <p class="course-teacher">${Utils.esc(course.teacher)}</p>
          <div class="course-meta-row">
            <span>⭐ ${course.rating}</span>
            <span>${course.lessons} уроков</span>
            <span>${course.duration}</span>
            <span>${Utils.formatNumber(course.students)} учеников</span>
          </div>
          ${enrollment ? `
            <div class="course-progress-track">
              <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
            </div>
          ` : ""}
          <div class="course-footer">
            <span class="course-price ${course.price === 0 ? "free" : ""}">${Utils.formatPrice(course.price)}</span>
            <button class="btn btn-primary btn-sm course-detail-btn" data-course-id="${course.id}">Подробнее</button>
          </div>
        </div>
      </div>
    `;
  },

  bindCourseCardEvents(root){
    root.querySelectorAll(".course-detail-btn, .course-card").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.dataset.courseId || el.closest(".course-card").dataset.courseId;
        Router.navigate("course-detail", { id });
      });
    });
  },

  renderCatalog(){
    if(window._pendingDirectionFilter){
      this.filters.direction = window._pendingDirectionFilter;
      window._pendingDirectionFilter = null;
      document.querySelectorAll("#direction-switch .tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.filterDirection === this.filters.direction);
      });
    }
    this.bindFilterControls();
    this.applyFiltersAndRender();
  },

  bindFilterControls(){
    if(this._bound) return;
    this._bound = true;

    document.querySelectorAll("#direction-switch .tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#direction-switch .tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.direction = btn.dataset.filterDirection;
        this.applyFiltersAndRender();
      });
    });

    document.getElementById("filter-level").addEventListener("change", (e) => {
      this.filters.level = e.target.value;
      this.applyFiltersAndRender();
    });
    document.getElementById("filter-duration").addEventListener("change", (e) => {
      this.filters.duration = e.target.value;
      this.applyFiltersAndRender();
    });
    document.getElementById("filter-rating").addEventListener("change", (e) => {
      this.filters.rating = parseFloat(e.target.value);
      this.applyFiltersAndRender();
    });
    document.getElementById("filter-price").addEventListener("change", (e) => {
      this.filters.price = e.target.value;
      this.applyFiltersAndRender();
    });
    document.getElementById("filter-sort").addEventListener("change", (e) => {
      this.filters.sort = e.target.value;
      this.applyFiltersAndRender();
    });
  },

  matchesDuration(course, bucket){
    if(bucket === "all") return true;
    if(bucket === "short") return course.durationHours < 3;
    if(bucket === "medium") return course.durationHours >= 3 && course.durationHours <= 8;
    if(bucket === "long") return course.durationHours > 8;
    return true;
  },

  applyFiltersAndRender(){
    const f = this.filters;
    let list = ALL_COURSES.filter(c => {
      if(f.direction !== "all" && c.direction !== f.direction) return false;
      if(f.level !== "all" && c.level !== f.level) return false;
      if(!this.matchesDuration(c, f.duration)) return false;
      if(parseFloat(c.rating) < f.rating) return false;
      if(f.price === "free" && c.price !== 0) return false;
      if(f.price === "paid" && c.price === 0) return false;
      if(f.query && !c.title.toLowerCase().includes(f.query.toLowerCase())) return false;
      return true;
    });

    if(f.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if(f.sort === "new") list.sort((a, b) => b.id.localeCompare(a.id));
    else if(f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else list.sort((a, b) => b.students - a.students);

    document.getElementById("courses-results-count").textContent = `Найдено курсов: ${list.length}`;
    const grid = document.getElementById("courses-grid");
    if(list.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <p>По вашим фильтрам курсов не найдено. Попробуйте изменить условия поиска.</p>
      </div>`;
      return;
    }
    grid.innerHTML = list.map(c => this.courseCardHTML(c)).join("");
    this.bindCourseCardEvents(grid);
  },

  /* ---- Course Detail Page ---- */
  renderDetail(courseId){
    const course = ALL_COURSES.find(c => c.id === courseId);
    const root = document.getElementById("course-detail-root");
    if(!course){
      root.innerHTML = `<div class="container page-pad"><div class="empty-state"><p>Курс не найден.</p></div></div>`;
      return;
    }
    const enrollment = Store.state.enrolledCourses[course.id];
    const progress = enrollment ? enrollment.progress : 0;
    const isCompleted = Store.state.completedCourses.includes(course.id);

    root.innerHTML = `
      <section class="course-banner" style="background:linear-gradient(135deg, ${course.coverA}, ${course.coverB})">
        <div class="container course-banner-inner">
          <div>
            <span class="eyebrow" style="background:rgba(255,255,255,0.2); color:#fff;">${Utils.directionLabel(course.direction)}</span>
            <h1>${Utils.esc(course.title)}</h1>
            <p>${Utils.esc(course.description)}</p>
            <div class="banner-meta">
              <span>⭐ ${course.rating}</span>
              <span>${course.lessons} уроков</span>
              <span>${course.duration}</span>
              <span>${Utils.formatNumber(course.students)} учеников</span>
              <span>${Utils.levelLabel(course.level)}</span>
            </div>
          </div>
          <div class="enroll-card card-glass">
            <div class="enroll-price">${Utils.formatPrice(course.price)}</div>
            <p style="color:var(--text-soft); font-size:var(--fs-sm); margin: var(--sp-3) 0 var(--sp-5);">Преподаватель: ${Utils.esc(course.teacher)}</p>
            ${enrollment ? `
              <div class="progress-track" style="margin-bottom:var(--sp-4);"><div class="progress-fill" style="width:${progress}%"></div></div>
              <p style="font-size:var(--fs-xs); color:var(--text-soft); margin-bottom:var(--sp-4);">Прогресс: ${progress}%</p>
            ` : ""}
            <button class="btn btn-primary btn-block" id="start-course-btn">
              ${enrollment ? "Продолжить обучение" : "Начать обучение"}
            </button>
            ${isCompleted ? `<button class="btn btn-ghost btn-block" style="margin-top:var(--sp-3);" id="view-cert-btn">Посмотреть сертификат</button>` : ""}
          </div>
        </div>
      </section>

      <div class="container course-detail-body">
        <div>
          <h2 class="mini-title" style="margin-top:0;">Программа курса</h2>
          <div class="curriculum-list">
            ${course.curriculum.map(mod => `
              <div style="margin-bottom:var(--sp-4);">
                <p style="font-weight:600; margin-bottom:var(--sp-2); color:var(--color-violet); font-size:var(--fs-sm);">${mod.module}</p>
                ${mod.lessons.map(l => {
                  const done = enrollment && enrollment.completedLessons.includes(l.id);
                  return `
                  <div class="curriculum-item ${done ? "done" : ""}" data-lesson-id="${l.id}" data-course-id="${course.id}">
                    <span class="curriculum-check">${done ? "✓" : ""}</span>
                    <span style="flex:1;">${Utils.esc(l.title)}</span>
                    <span class="mono" style="font-size:var(--fs-xs); color:var(--text-soft);">${l.duration}</span>
                  </div>`;
                }).join("")}
              </div>
            `).join("")}
          </div>

          <h2 class="mini-title">Частые вопросы</h2>
          <div class="faq-list">
            ${this.faqHTML()}
          </div>
        </div>

        <aside>
          <h2 class="mini-title" style="margin-top:0;">Отзывы</h2>
          <div style="display:flex; flex-direction:column; gap:var(--sp-4);">
            ${REVIEWS.slice(0, 3).map(r => `
              <div class="review-card card-glass">
                <div class="review-head">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=${r.avatarSeed}" alt="">
                  <div>
                    <div class="review-name">${Utils.esc(r.name)}</div>
                    <div class="stars">★★★★★</div>
                  </div>
                </div>
                <p class="review-text">«${Utils.esc(r.text)}»</p>
              </div>
            `).join("")}
          </div>
        </aside>
      </div>
    `;

    document.getElementById("start-course-btn").addEventListener("click", () => {
      const firstLesson = course.curriculum[0].lessons[0];
      Router.navigate("lesson", { courseId: course.id, lessonId: firstLesson.id });
    });

    const certBtn = document.getElementById("view-cert-btn");
    if(certBtn){
      certBtn.addEventListener("click", () => Router.navigate("profile"));
    }

    root.querySelectorAll(".curriculum-item").forEach(item => {
      item.addEventListener("click", () => {
        Router.navigate("lesson", { courseId: item.dataset.courseId, lessonId: item.dataset.lessonId });
      });
    });

    root.querySelectorAll(".faq-q").forEach(q => {
      q.addEventListener("click", () => q.closest(".faq-item").classList.toggle("open"));
    });
  },

  faqHTML(){
    const faqs = [
      { q: "Как получить сертификат?", a: "Сертификат генерируется автоматически в формате PDF сразу после прохождения всех уроков и тестов курса — найти его можно в разделе «Сертификаты» личного кабинета." },
      { q: "Можно ли проходить курс в своём темпе?", a: "Да, весь прогресс сохраняется автоматически, и вы можете возвращаться к урокам в любое удобное время." },
      { q: "Что если я не сдам тест с первого раза?", a: "Тесты можно проходить повторно неограниченное количество раз — после каждой попытки показываются правильные ответы и объяснения." },
    ];
    return faqs.map(f => `
      <div class="faq-item">
        <div class="faq-q">${Utils.esc(f.q)} <span>+</span></div>
        <div class="faq-a">${Utils.esc(f.a)}</div>
      </div>
    `).join("");
  },
};
