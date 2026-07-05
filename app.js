/* =====================================================================
   DINARA MATH & IT — App Bootstrap
   ===================================================================== */

const App = {

  init(){
    try{
      Store.load();
      this.applyTheme(Store.state.theme);
      this.bindThemeToggle();
      this.bindBurgerMenu();
      this.bindSearch();
      this.bindHeaderAvatar();
      Router.init();
      this.refreshHeaderXP();
    }catch(e){
      console.error("App init encountered an error — showing the page anyway.", e);
      // Even if something above failed, make sure at least the home view
      // is visible so the visitor isn't staring at a blank page.
      const homeView = document.getElementById("view-home");
      if(homeView && !document.querySelector(".view.active")) homeView.classList.add("active");
    }finally{
      this.hideLoadingScreen();
    }
  },

  hideLoadingScreen(){
    setTimeout(() => {
      document.getElementById("loading-screen").classList.add("hide");
    }, 500);
  },

  refreshHeaderXP(){
    document.getElementById("header-streak").textContent = Store.state.streak;
  },

  applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme);
    const sunIcon = document.getElementById("theme-icon-sun");
    if(sunIcon){
      sunIcon.style.transform = theme === "dark" ? "rotate(180deg)" : "rotate(0deg)";
    }
  },

  setTheme(theme){
    Store.setTheme(theme);
    this.applyTheme(theme);
    Utils.toast(theme === "dark" ? "Тёмная тема включена" : "Светлая тема включена", "info", theme === "dark" ? "🌙" : "☀️");
  },

  bindThemeToggle(){
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const next = Store.state.theme === "dark" ? "light" : "dark";
      this.setTheme(next);
    });
  },

  bindBurgerMenu(){
    const burger = document.getElementById("burger-btn");
    const nav = document.getElementById("mobile-nav");
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  },

  bindHeaderAvatar(){
    const btn = document.getElementById("avatar-btn");
    const img = document.getElementById("header-avatar");
    if(Store.state.profile.avatarSeed){
      img.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${Store.state.profile.avatarSeed}`;
    }
  },

  bindSearch(){
    const toggleBtn = document.getElementById("search-toggle");
    const overlay = document.getElementById("search-overlay");
    const input = document.getElementById("global-search-input");
    const resultsEl = document.getElementById("search-results");

    toggleBtn.addEventListener("click", () => {
      overlay.classList.toggle("open");
      if(overlay.classList.contains("open")) setTimeout(() => input.focus(), 100);
    });

    const doSearch = Utils.debounce((query) => {
      if(!query){ resultsEl.innerHTML = ""; return; }
      const q = query.toLowerCase();
      const courseMatches = ALL_COURSES.filter(c =>
        c.title.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q)
      ).slice(0, 8);

      if(courseMatches.length === 0){
        resultsEl.innerHTML = `<p style="color:var(--text-soft); font-size:var(--fs-sm);">Ничего не найдено по запросу «${Utils.esc(query)}»</p>`;
        return;
      }

      resultsEl.innerHTML = courseMatches.map(c => `
        <div class="search-result-item" data-course-id="${c.id}">
          <span>${c.direction === "math" ? "📐" : "💻"}</span>
          <div style="flex:1;">
            <div>${Utils.esc(c.title)}</div>
            <div class="srt">${Utils.esc(c.teacher)} · ${Utils.levelLabel(c.level)}</div>
          </div>
        </div>
      `).join("");

      resultsEl.querySelectorAll("[data-course-id]").forEach(item => {
        item.addEventListener("click", () => {
          Router.navigate("course-detail", { id: item.dataset.courseId });
          overlay.classList.remove("open");
          input.value = "";
          resultsEl.innerHTML = "";
        });
      });
    }, 200);

    input.addEventListener("input", (e) => doSearch(e.target.value));

    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape") overlay.classList.remove("open");
    });
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
