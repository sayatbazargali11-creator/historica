/* =====================================================================
   DINARA MATH & IT — Home View Rendering
   ===================================================================== */

const UIHome = {
  render(){
    this.renderPopularCourses();
    this.renderReviews();
    this.bindCarousel();
    this.bindDirectionCards();
  },

  renderPopularCourses(){
    const track = document.getElementById("popular-courses-track");
    const popular = [...ALL_COURSES].sort((a, b) => b.students - a.students).slice(0, 8);
    track.innerHTML = popular.map(c => UICourses.courseCardHTML(c)).join("");
    UICourses.bindCourseCardEvents(track);
  },

  renderReviews(){
    const grid = document.getElementById("home-reviews");
    grid.innerHTML = REVIEWS.map(r => `
      <div class="review-card card-glass reveal-up">
        <div class="review-head">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=${r.avatarSeed}" alt="${Utils.esc(r.name)}">
          <div>
            <div class="review-name">${Utils.esc(r.name)}</div>
            <div class="review-course">${Utils.esc(r.course)}</div>
          </div>
        </div>
        <p class="review-text">«${Utils.esc(r.text)}»</p>
      </div>
    `).join("");
  },

  bindCarousel(){
    const track = document.getElementById("popular-courses-track");
    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
    if(prev._bound) return;
    prev.addEventListener("click", () => track.scrollBy({ left: -340, behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: 340, behavior: "smooth" }));
    prev._bound = true;
  },

  bindDirectionCards(){
    document.querySelectorAll(".direction-card").forEach(card => {
      card.addEventListener("click", () => {
        window._pendingDirectionFilter = card.dataset.direction;
      });
    });
  },
};
