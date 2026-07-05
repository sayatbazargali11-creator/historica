/* =====================================================================
   DINARA MATH & IT — Gamification Engine
   ===================================================================== */

const Gamification = {
  lastKnownLevel: null,

  onXPGain(amount, reason){
    if(this.lastKnownLevel === null) this.lastKnownLevel = Store.state.level;
    if(Store.state.level > this.lastKnownLevel){
      this.lastKnownLevel = Store.state.level;
      Utils.toast(`Новый уровень: ${Store.state.level}! 🎉`, "success", "🆙");
      Utils.fireConfetti();
    }
    this.refreshHeaderXP();
    this.checkBadgeConditions();
  },

  refreshHeaderXP(){
    document.getElementById("header-streak").textContent = Store.state.streak;
    if(Router.currentView === "profile" && window.UIProfile) UIProfile.renderHeader();
  },

  checkBadgeConditions(){
    const s = Store.state;
    const newlyUnlocked = [];

    if(s.tasksSolved >= 100 && Store.unlockBadge("hundred-tasks")) newlyUnlocked.push("hundred-tasks");
    if(s.completedCourses.length >= 1 && Store.unlockBadge("first-course")) newlyUnlocked.push("first-course");
    const mathDone = s.completedCourses.filter(id => id.startsWith("math-")).length;
    const csDone = s.completedCourses.filter(id => id.startsWith("cs-")).length;
    if(mathDone >= 5 && Store.unlockBadge("math-master")) newlyUnlocked.push("math-master");
    if(csDone >= 5 && Store.unlockBadge("code-master")) newlyUnlocked.push("code-master");
    if(s.ideRunsCount >= 20 && Store.unlockBadge("ide-explorer")) newlyUnlocked.push("ide-explorer");
    if(s.graphsBuiltCount >= 15 && Store.unlockBadge("graph-artist")) newlyUnlocked.push("graph-artist");

    const hour = new Date().getHours();
    if(hour >= 0 && hour < 5 && Store.unlockBadge("night-owl")) newlyUnlocked.push("night-owl");
    if(hour >= 5 && hour < 7 && Store.unlockBadge("early-bird")) newlyUnlocked.push("early-bird");

    newlyUnlocked.forEach(badgeId => {
      const badge = BADGES.find(b => b.id === badgeId);
      if(badge){
        Utils.toast(`Новое достижение: ${badge.name} ${badge.icon}`, "success", "🏅");
      }
    });
    if(newlyUnlocked.length && Router.currentView === "profile" && UIProfile.activeTab === "achievements"){
      UIProfile.renderAchievements();
    }
  },

  incIdeRuns(){
    Store.state.ideRunsCount++;
    Store.save();
    this.checkBadgeConditions();
  },

  incGraphsBuilt(){
    Store.state.graphsBuiltCount++;
    Store.save();
    this.checkBadgeConditions();
  },
};

/* =====================================================================
   Leaderboard View
   ===================================================================== */
const UILeaderboard = {
  render(){
    const list = document.getElementById("leaderboard-list");
    const merged = [...LEADERBOARD, { name: `${Store.state.profile.name} (вы)`, xp: Store.state.xpTotal, avatarSeed: Store.state.profile.avatarSeed, isMe: true }]
      .sort((a, b) => b.xp - a.xp);

    list.innerHTML = merged.map((entry, i) => `
      <div class="leaderboard-row" style="${entry.isMe ? "background:var(--color-violet-soft); border-radius:var(--radius-md);" : ""}">
        <div class="leaderboard-rank">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</div>
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=${entry.avatarSeed}" alt="">
        <div class="leaderboard-name">${Utils.esc(entry.name)}</div>
        <div class="leaderboard-xp">${Utils.formatNumber(entry.xp)} XP</div>
      </div>
    `).join("");
  },
};
