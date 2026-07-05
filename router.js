/* =====================================================================
   DINARA MATH & IT — Router (hash-based SPA navigation)
   ===================================================================== */

const Router = {
  currentView: "home",
  currentParams: {},

  routes: {
    "home": () => window.UIHome && window.UIHome.render(),
    "courses": () => window.UICourses && window.UICourses.renderCatalog(),
    "course-detail": (params) => window.UICourses && window.UICourses.renderDetail(params.id),
    "lesson": (params) => window.UILesson && window.UILesson.render(params.courseId, params.lessonId),
    "profile": () => window.UIProfile && window.UIProfile.render(),
    "tools": (params) => window.UITools && window.UITools.render(params.tool),
    "calc-quadratic": () => window.UITools && window.UITools.render("calc-quadratic"),
    "calc-percent": () => window.UITools && window.UITools.render("calc-percent"),
    "calc-fractions": () => window.UITools && window.UITools.render("calc-fractions"),
    "calc-matrix": () => window.UITools && window.UITools.render("calc-matrix"),
    "calc-vector": () => window.UITools && window.UITools.render("calc-vector"),
    "calc-derivative": () => window.UITools && window.UITools.render("calc-derivative"),
    "calc-integral": () => window.UITools && window.UITools.render("calc-integral"),
    "calc-base": () => window.UITools && window.UITools.render("calc-base"),
    "ide": () => window.UITools && window.UITools.render("ide"),
    "graphing": () => window.UITools && window.UITools.render("graphing"),
    "ent": () => window.UIEnt && window.UIEnt.render(),
    "leaderboard": () => window.UILeaderboard && window.UILeaderboard.render(),
  },

  viewForRoute(route){
    if(route.startsWith("calc-") || route === "ide" || route === "graphing") return "tools";
    return this.routes[route] ? route : "home";
  },

  init(){
    window.addEventListener("hashchange", () => this.handleHash());
    this.handleHash();
  },

  handleHash(){
    const hash = window.location.hash.replace("#/", "") || "home";
    const [route, queryStr] = hash.split("?");
    const params = {};
    if(queryStr){
      new URLSearchParams(queryStr).forEach((v, k) => { params[k] = v; });
    }
    this.navigateInternal(route || "home", params);
  },

  navigate(route, params = {}){
    let hash = `#/${route}`;
    const query = new URLSearchParams(params).toString();
    if(query) hash += `?${query}`;
    window.location.hash = hash;
  },

  navigateInternal(route, params){
    const view = this.viewForRoute(route);
    this.currentView = view;
    this.currentParams = params;

    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const viewEl = document.getElementById(`view-${view}`);
    if(viewEl) viewEl.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.nav === view);
    });

    const handler = this.routes[route] || this.routes["home"];
    try{
      handler(params);
    }catch(e){
      console.error(`Route "${route}" failed to render`, e);
    }

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    document.getElementById("mobile-nav").classList.remove("open");
    document.getElementById("search-overlay").classList.remove("open");

    setTimeout(() => {
      Utils.initScrollReveal();
      Utils.initCounters();
      Utils.initRipples();
    }, 30);

    if(window.Store) Store.touchActivityToday();
  },
};

/* Global nav click delegation */
document.addEventListener("click", (e) => {
  const navEl = e.target.closest("[data-nav]");
  if(navEl){
    e.preventDefault();
    Router.navigate(navEl.dataset.nav);
  }
});
