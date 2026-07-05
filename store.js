/* =====================================================================
   DINARA MATH & IT — Store (state + localStorage persistence)
   ===================================================================== */

const STORAGE_KEY = "dinara_math_it_state_v1";

const XP_PER_LEVEL_BASE = 400;
const XP_LEVEL_GROWTH = 1.18;

function xpNeededForLevel(level){
  return Math.round(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_GROWTH, level - 1));
}

function defaultState(){
  return {
    profile: {
      name: "Динара Ахметова",
      email: "dinara@example.com",
      avatarSeed: "Dinara",
    },
    theme: "light",
    xpTotal: 1240,
    level: 1,
    streak: 7,
    lastActiveDate: null,
    coins: 340,
    lives: 5,
    hoursLearned: 18.5,
    tasksSolved: 32,
    testsCompleted: 9,
    unlockedBadges: ["first-lesson", "first-test", "streak-7"],
    enrolledCourses: {
      "math-derivatives": { progress: 62, completedLessons: ["l1","l2","l3","l4","l5","l6","l7","l8","l9","l10","l11","l12","l13","l14","l15"] },
      "cs-python-basics": { progress: 38, completedLessons: ["l1","l2","l3","l4","l5","l6","l7","l8"] },
      "math-algebra": { progress: 100, completedLessons: [] },
    },
    completedCourses: ["math-algebra"],
    certificates: [
      { courseId: "math-algebra", courseTitle: "Алгебра: от основ до уравнений", date: "2026-05-12" },
    ],
    activity: buildInitialActivity(),
    ideRunsCount: 6,
    graphsBuiltCount: 4,
    testHistory: [],
  };
}

function buildInitialActivity(){
  const days = 182; // ~6 months for heatmap
  const arr = [];
  for(let i = 0; i < days; i++){
    const rand = Math.random();
    let level = 0;
    if(rand > 0.85) level = 3;
    else if(rand > 0.7) level = 2;
    else if(rand > 0.5) level = 1;
    arr.push(level);
  }
  return arr;
}

const Store = {
  state: null,

  load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      this.state = raw ? JSON.parse(raw) : defaultState();
      if(!this.state.testHistory) this.state.testHistory = [];
    }catch(e){
      console.warn("Store load failed, using defaults", e);
      this.state = defaultState();
    }
    this.recalculateLevel();
    return this.state;
  },

  save(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }catch(e){
      console.warn("Store save failed", e);
    }
  },

  reset(){
    this.state = defaultState();
    this.save();
  },

  recalculateLevel(){
    let level = 1;
    let remaining = this.state.xpTotal;
    while(remaining >= xpNeededForLevel(level)){
      remaining -= xpNeededForLevel(level);
      level++;
    }
    this.state.level = level;
    this.state._xpIntoLevel = remaining;
    this.state._xpForNextLevel = xpNeededForLevel(level);
  },

  addXP(amount, reason){
    this.state.xpTotal += amount;
    this.recalculateLevel();
    this.save();
    if(window.Gamification){
      window.Gamification.onXPGain(amount, reason);
    }
    return this.state;
  },

  addCoins(amount){
    this.state.coins += amount;
    this.save();
  },

  unlockBadge(badgeId){
    if(this.state.unlockedBadges.includes(badgeId)) return false;
    this.state.unlockedBadges.push(badgeId);
    this.save();
    return true;
  },

  markLessonDone(courseId, lessonId){
    if(!this.state.enrolledCourses[courseId]){
      this.state.enrolledCourses[courseId] = { progress: 0, completedLessons: [] };
    }
    const enrollment = this.state.enrolledCourses[courseId];
    if(!enrollment.completedLessons.includes(lessonId)){
      enrollment.completedLessons.push(lessonId);
    }
    const course = ALL_COURSES.find(c => c.id === courseId);
    if(course){
      enrollment.progress = Math.min(100, Math.round((enrollment.completedLessons.length / course.lessons) * 100));
      if(enrollment.progress >= 100 && !this.state.completedCourses.includes(courseId)){
        this.state.completedCourses.push(courseId);
        this.issueCertificate(course);
      }
    }
    this.state.hoursLearned = +(this.state.hoursLearned + 0.25).toFixed(1);
    this.save();
  },

  issueCertificate(course){
    this.state.certificates.push({
      courseId: course.id,
      courseTitle: course.title,
      date: new Date().toISOString().slice(0, 10),
    });
  },

  recordTestResult(topic, correctCount, totalCount){
    this.state.testsCompleted += 1;
    this.state.testHistory.push({
      topic, correctCount, totalCount, date: new Date().toISOString(),
    });
    if(correctCount === totalCount){
      this.unlockBadge("perfect-score");
    }
    this.save();
  },

  incTasksSolved(n = 1){
    this.state.tasksSolved += n;
    this.save();
  },

  touchActivityToday(){
    const today = new Date().toDateString();
    if(this.state.lastActiveDate !== today){
      if(this.state.lastActiveDate){
        const prev = new Date(this.state.lastActiveDate);
        const diffDays = Math.round((new Date(today) - prev) / 86400000);
        if(diffDays === 1) this.state.streak += 1;
        else if(diffDays > 1) this.state.streak = 1;
      } else {
        this.state.streak = Math.max(1, this.state.streak);
      }
      this.state.lastActiveDate = today;
      this.state.activity.push(3);
      if(this.state.streak === 7) this.unlockBadge("streak-7");
      if(this.state.streak === 30) this.unlockBadge("streak-30");
      this.save();
    }
  },

  setTheme(theme){
    this.state.theme = theme;
    this.save();
  },
};
