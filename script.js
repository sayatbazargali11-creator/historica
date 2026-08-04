/* =========================================================================
   SAYAT MATH — script.js
   Bilingual (kk / en) engine + all interactive behaviour.
   Language state is carried in the URL (?lang=kk|en) rather than storage,
   so it survives navigation between pages without relying on localStorage.
   ========================================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     1. TRANSLATION DICTIONARY
     ----------------------------------------------------------------------- */
  const DICT = {
    en: {
      "nav.home": "Home",
      "nav.courses": "Courses",
      "nav.tests": "Tests",
      "nav.about": "About Us",
      "nav.contact": "Contact",
      "nav.cta": "Start free trial",

      "hero.eyebrow": "Online mathematics academy",
      "hero.title.l1": "Where numbers",
      "hero.title.l2": "become instinct.",
      "hero.desc": "SAYAT MATH pairs a structured, olympiad-tested curriculum with live tutors, so learners move from memorising formulas to actually thinking in mathematics — one clear step at a time.",
      "hero.cta": "Book a free diagnostic",
      "hero.link": "See how the method works",
      "hero.stat1.num": "5,000+",
      "hero.stat1.label": "Active students",
      "hero.stat2.num": "98%",
      "hero.stat2.label": "Exam pass rate",
      "hero.stat3.num": "4.9/5",
      "hero.stat3.label": "Parent rating",
      "hero.card1.title": "Live class",
      "hero.card1.sub": "Algebra II · today, 18:00",
      "hero.card2.title": "Streak: 41 days",
      "hero.card2.sub": "Keep it going",

      "students.eyebrow": "Outstanding students",
      "students.title": "Proof the method works.",
      "students.desc": "A rolling wall of learners who turned consistent practice into national results — updated every season.",

      "courses.eyebrow": "Curriculum",
      "courses.title": "Pick a track, not just a class.",
      "courses.desc": "Every course is a full track from diagnostic to mastery test, built around Kazakhstan's school programme and international olympiad standards.",
      "courses.viewall": "View full curriculum",
      "courses.level.beginner": "Beginner",
      "courses.level.intermediate": "Intermediate",
      "courses.level.advanced": "Advanced",
      "courses.enroll": "Enroll",
      "courses.perlevel": "level",

      "c1.title": "Arithmetic Foundations",
      "c1.desc": "Number sense, fractions and ratios built through visual, game-based practice for grades 3–5.",
      "c2.title": "Algebra I & II",
      "c2.desc": "Equations, functions and graphs — the exact toolkit needed for national exams and beyond.",
      "c3.title": "Geometry & Proof",
      "c3.desc": "From compass constructions to formal proof, taught through Kazakh ornamental geometry.",
      "c4.title": "Probability & Statistics",
      "c4.desc": "Real-world data literacy: distributions, expectation, and decision-making under uncertainty.",
      "c5.title": "Olympiad Problem Solving",
      "c5.desc": "Combinatorics, number theory and invariants for students aiming at national competitions.",
      "c6.title": "Calculus Foundations",
      "c6.desc": "Limits, derivatives and integrals introduced with intuition first, notation second.",

      "stats.title": "Numbers that hold up.",
      "stats.s1.num": "5,000+",
      "stats.s1.label": "Students taught",
      "stats.s2.num": "98%",
      "stats.s2.label": "Success rate",
      "stats.s3.num": "150+",
      "stats.s3.label": "Video lessons",
      "stats.s4.num": "20+",
      "stats.s4.label": "Teachers",

      "testi.eyebrow": "Families & students",
      "testi.title": "What changed for them.",
      "t1.text": "My son used to guess his way through algebra. Six months in, he explains the steps to me now — the geometry sessions built from Kazakh ornament patterns are what finally made it click.",
      "t1.name": "Aigerim Bekova",
      "t1.role": "Parent, grade 8 student",
      "t2.text": "The diagnostic actually found my weak spots instead of just labelling me 'average'. I moved from a national olympiad reserve list to a bronze medal in one season.",
      "t2.name": "Nurlan Saparov",
      "t2.role": "Student, grade 11",
      "t3.text": "As a teacher myself, I was skeptical of another online academy. The pacing and the live feedback loop is genuinely better than what I could offer one-on-one.",
      "t3.name": "Dana Yerimbetova",
      "t3.role": "Parent & school teacher",

      "footer.desc": "An online mathematics academy built in Kazakhstan, teaching mathematical thinking — not just formulas — to students of every level.",
      "footer.explore": "Explore",
      "footer.company": "Academy",
      "footer.legal": "Legal",
      "footer.privacy": "Privacy policy",
      "footer.terms": "Terms of use",
      "footer.cookies": "Cookie policy",
      "footer.rights": "All rights reserved.",
      "footer.careers": "Careers",
      "footer.press": "Press",
      "footer.blog": "Blog",
      "footer.faq": "FAQ",

      "page.courses.eyebrow": "Full curriculum",
      "page.courses.title": "Every course, one clear path.",
      "page.courses.desc": "Filter by level, compare tracks, and see exactly what each course covers before you enroll.",
      "filter.all": "All courses",
      "filter.beginner": "Beginner",
      "filter.intermediate": "Intermediate",
      "filter.advanced": "Advanced",
      "syllabus.eyebrow": "Curriculum map",
      "syllabus.title": "How a track is structured.",
      "syl1.title": "Diagnostic & goal setting",
      "syl1.body": "Every learner starts with a 45-minute adaptive diagnostic that maps strengths and gaps against the national programme, then sets a 12-week goal with their mentor.",
      "syl2.title": "Guided foundations",
      "syl2.body": "Short video lessons paired with worked examples build the underlying number sense and notation fluency before any timed practice begins.",
      "syl3.title": "Live problem-solving sessions",
      "syl3.body": "Twice-weekly live classes with a teacher, capped at 8 students, focused on reasoning out loud rather than watching a lecture passively.",
      "syl4.title": "Weekly mastery checks",
      "syl4.body": "Short, low-stakes quizzes track retention and automatically resurface topics that are fading from memory using spaced repetition.",
      "syl5.title": "Mock exam & certification",
      "syl5.body": "A full-length timed mock exam under real conditions, reviewed one-on-one, followed by a certificate of completion for the track.",

      "page.tests.eyebrow": "Practice & assessment",
      "page.tests.title": "Test what you actually know.",
      "page.tests.desc": "Short, focused quizzes with instant feedback — pick a topic below and see your score in under five minutes.",
      "test1.tag": "Algebra",
      "test1.title": "Linear Equations Check",
      "test1.desc": "8 questions covering one and two-variable linear equations and word problems.",
      "test2.tag": "Geometry",
      "test2.title": "Angles & Triangles",
      "test2.desc": "8 questions on angle relationships, triangle properties and the Pythagorean theorem.",
      "test3.tag": "Arithmetic",
      "test3.title": "Fractions & Ratios",
      "test3.desc": "8 questions on operations with fractions, proportion and percentage problems.",
      "test.meta.questions": "8 questions",
      "test.meta.time": "~5 min",
      "test.meta.level": "Grades 6–9",
      "quiz.start": "Start test",
      "quiz.question": "Question",
      "quiz.of": "of",
      "quiz.next": "Next question",
      "quiz.finish": "See results",
      "quiz.retake": "Retake test",
      "quiz.back": "Back to tests",
      "quiz.result.title": "Nicely done.",
      "quiz.result.desc": "Here's how you did — review any topic you missed in the course library.",
      "quiz.score": "Score",

      "page.about.eyebrow": "About the academy",
      "page.about.title": "Built by people who love the subject.",
      "page.about.desc": "SAYAT MATH started as after-school tutoring in Almaty and grew into a full online academy — the teaching philosophy hasn't changed.",
      "mission.eyebrow": "Our mission",
      "mission.title": "Mathematics as a way of thinking, not a subject to survive.",
      "mission.body": "Most students meet mathematics as a set of procedures to memorise for a test. We teach it as a language for reasoning clearly — a skill that outlasts any single exam. Every lesson is built around a real question first, and a formula second.",
      "values.eyebrow": "What we hold to",
      "values.title": "Three principles behind every lesson.",
      "v1.title": "Understanding before speed",
      "v1.desc": "We never trade comprehension for a faster answer. Speed is what happens naturally once a concept is genuinely understood.",
      "v2.title": "Small live classes",
      "v2.desc": "Capped at 8 students so every learner is asked to reason out loud, not just watch a lecture happen.",
      "v3.title": "Local roots, global standard",
      "v3.desc": "Aligned with Kazakhstan's national programme, benchmarked against international olympiad problem sets.",
      "team.eyebrow": "The people",
      "team.title": "Meet a few of the teachers.",
      "tm1.name": "Yerlan Tastanov",
      "tm1.role": "Founder · Geometry lead",
      "tm2.name": "Aliya Nurgaliyeva",
      "tm2.role": "Algebra & Olympiad coach",
      "tm3.name": "Miras Kaliev",
      "tm3.role": "Statistics & Data",
      "tm4.name": "Zhanna Omarova",
      "tm4.role": "Head of Curriculum",
      "timeline.eyebrow": "How we got here",
      "timeline.title": "A short history.",
      "tl1.year": "2019",
      "tl1.title": "After-school tutoring in Almaty",
      "tl1.body": "Started with two teachers and eleven students in a rented classroom, focused purely on olympiad preparation.",
      "tl2.year": "2021",
      "tl2.title": "First online cohort",
      "tl2.body": "Moved teaching online out of necessity, then discovered live small-group classes worked even better remotely.",
      "tl3.year": "2023",
      "tl3.title": "Full curriculum launch",
      "tl3.body": "Released the complete track system from arithmetic foundations through calculus, aligned to the national programme.",
      "tl4.year": "2026",
      "tl4.title": "5,000 students, 20 teachers",
      "tl4.body": "Grew into a full academy while keeping every live class capped at eight students.",

      "page.contact.eyebrow": "Get in touch",
      "page.contact.title": "Questions before you enroll?",
      "page.contact.desc": "Send us a message and a member of the academy team will reply within one working day.",
      "contact.info.title": "Contact details",
      "contact.phone.label": "Phone",
      "contact.email.label": "Email",
      "contact.address.label": "Address",
      "contact.address.value": "Al-Farabi Ave 71, Almaty, Kazakhstan",
      "contact.hours.label": "Office hours",
      "contact.hours.value": "Mon–Sat, 09:00–19:00",
      "form.name": "Full name",
      "form.name.ph": "Your name",
      "form.email": "Email",
      "form.email.ph": "you@example.com",
      "form.phone": "Phone",
      "form.phone.ph": "+7 (7__) ___-__-__",
      "form.topic": "Topic",
      "form.topic.enroll": "Enrollment question",
      "form.topic.pricing": "Pricing",
      "form.topic.partnership": "Partnership",
      "form.topic.other": "Other",
      "form.message": "Message",
      "form.message.ph": "Tell us a little about your goals...",
      "form.submit": "Send message",
      "form.note": "By sending this form you agree to be contacted by SAYAT MATH about your enquiry.",
      "form.success": "Message sent — we'll reply within one working day."
    },

    kk: {
      "nav.home": "Басты бет",
      "nav.courses": "Курстар",
      "nav.tests": "Тесттер",
      "nav.about": "Біз туралы",
      "nav.contact": "Байланыс",
      "nav.cta": "Тегін сабаққа жазылу",

      "hero.eyebrow": "Онлайн математика академиясы",
      "hero.title.l1": "Сандар қалай",
      "hero.title.l2": "инстинктке айналады.",
      "hero.desc": "SAYAT MATH олимпиадалық стандартпен тексерілген құрылымды бағдарламаны тірі мұғалімдермен ұштастырады — оқушылар формуланы жаттаудан нағыз математикалық ойлауға қарай нақты қадаммен көшеді.",
      "hero.cta": "Тегін диагностикаға жазылу",
      "hero.link": "Әдіс қалай жұмыс істейді",
      "hero.stat1.num": "5 000+",
      "hero.stat1.label": "Белсенді оқушы",
      "hero.stat2.num": "98%",
      "hero.stat2.label": "Емтихан табыстылығы",
      "hero.stat3.num": "4.9/5",
      "hero.stat3.label": "Ата-аналар бағасы",
      "hero.card1.title": "Тірі сабақ",
      "hero.card1.sub": "Алгебра II · бүгін, 18:00",
      "hero.card2.title": "Серия: 41 күн",
      "hero.card2.sub": "Жалғастыра беріңіз",

      "students.eyebrow": "Үздік оқушылар",
      "students.title": "Әдістің жұмыс істейтінінің дәлелі.",
      "students.desc": "Тұрақты жаттығуды ұлттық нәтижеге айналдырған оқушылар қабырғасы — әр маусым сайын жаңарып тұрады.",

      "courses.eyebrow": "Оқу бағдарламасы",
      "courses.title": "Жай сабақ емес, толық бағыт таңдаңыз.",
      "courses.desc": "Әр курс — диагностикадан меңгеру тестіне дейінгі толық жол, Қазақстанның мектеп бағдарламасы мен халықаралық олимпиада стандарттарына негізделген.",
      "courses.viewall": "Толық бағдарламаны көру",
      "courses.level.beginner": "Бастауыш",
      "courses.level.intermediate": "Орта деңгей",
      "courses.level.advanced": "Жоғары деңгей",
      "courses.enroll": "Жазылу",
      "courses.perlevel": "деңгей",

      "c1.title": "Арифметика негіздері",
      "c1.desc": "3–5 сынып оқушыларына арналған сан сезімі, бөлшектер мен қатынастар — ойын арқылы, көрнекі түрде.",
      "c2.title": "Алгебра I & II",
      "c2.desc": "Теңдеулер, функциялар және графиктер — ұлттық емтихандарға және одан әрі қажет нақты құралдар.",
      "c3.title": "Геометрия және дәлелдеу",
      "c3.desc": "Циркуль құрылымдарынан формальды дәлелдеуге дейін — қазақ ою-өрнек геометриясы арқылы.",
      "c4.title": "Ықтималдық және статистика",
      "c4.desc": "Нақты өмірдегі деректерді түсіну: үлестірімдер, күтілетін мән және белгісіздік жағдайындағы шешім қабылдау.",
      "c5.title": "Олимпиадалық есептер",
      "c5.desc": "Ұлттық жарыстарға ұмтылған оқушыларға арналған комбинаторика, сандар теориясы және инварианттар.",
      "c6.title": "Математикалық анализ негіздері",
      "c6.desc": "Шектер, туынды және интеграл алдымен интуиция, содан кейін белгілеу арқылы түсіндіріледі.",

      "stats.title": "Дәлелденген сандар.",
      "stats.s1.num": "5 000+",
      "stats.s1.label": "Оқытылған оқушы",
      "stats.s2.num": "98%",
      "stats.s2.label": "Табыстылық деңгейі",
      "stats.s3.num": "150+",
      "stats.s3.label": "Бейне сабақ",
      "stats.s4.num": "20+",
      "stats.s4.label": "Мұғалім",

      "testi.eyebrow": "Отбасылар мен оқушылар",
      "testi.title": "Олар үшін не өзгерді.",
      "t1.text": "Ұлым бұрын алгебраны болжап шешетін. Алты айдан кейін маған қадамдарды өзі түсіндіреді — қазақ ою-өрнегінен құрылған геометрия сабақтары нәтижені әкелді.",
      "t1.name": "Айгерім Бекова",
      "t1.role": "8-сынып оқушысының анасы",
      "t2.text": "Диагностика мені жай ғана 'орташа' деп таңбаламай, нақты әлсіз тұстарымды тапты. Бір маусымда ұлттық олимпиада резервінен қола медальға дейін өстім.",
      "t2.name": "Нұрлан Сапаров",
      "t2.role": "11-сынып оқушысы",
      "t3.text": "Мұғалім ретінде тағы бір онлайн академияға күмәнмен қарадым. Бірақ қарқыны мен кері байланыс жүйесі мен жеке ұсына алатыннан шынымен жақсы екен.",
      "t3.name": "Дана Еримбетова",
      "t3.role": "Ата-ана және мектеп мұғалімі",

      "footer.desc": "Қазақстанда құрылған онлайн математика академиясы — барлық деңгейдегі оқушыларға тек формуланы емес, математикалық ойлауды үйретеді.",
      "footer.explore": "Шолу",
      "footer.company": "Академия",
      "footer.legal": "Құқықтық",
      "footer.privacy": "Құпиялылық саясаты",
      "footer.terms": "Қолдану шарттары",
      "footer.cookies": "Cookie саясаты",
      "footer.rights": "Барлық құқықтар қорғалған.",
      "footer.careers": "Мансап",
      "footer.press": "Баспасөз",
      "footer.blog": "Блог",
      "footer.faq": "Жиі қойылатын сұрақтар",

      "page.courses.eyebrow": "Толық бағдарлама",
      "page.courses.title": "Әр курс — бір анық жол.",
      "page.courses.desc": "Деңгей бойынша сүзіп, бағыттарды салыстырыңыз және жазылу алдында әр курстың мазмұнын толық көріңіз.",
      "filter.all": "Барлық курстар",
      "filter.beginner": "Бастауыш",
      "filter.intermediate": "Орта деңгей",
      "filter.advanced": "Жоғары деңгей",
      "syllabus.eyebrow": "Бағдарлама картасы",
      "syllabus.title": "Бағыт қалай құрылған.",
      "syl1.title": "Диагностика және мақсат қою",
      "syl1.body": "Әр оқушы 45 минуттық бейімделген диагностикадан басталады, ол ұлттық бағдарламаға қатысты күшті және әлсіз тұстарды анықтайды, содан кейін тьютормен бірге 12 апталық мақсат қойылады.",
      "syl2.title": "Бағдарланған негіздер",
      "syl2.body": "Қысқа бейне сабақтар мен шешілген мысалдар уақыт өлшенетін жаттығу басталғанға дейін сан сезімі мен белгілеу біліктілігін қалыптастырады.",
      "syl3.title": "Тірі есеп шығару сабақтары",
      "syl3.body": "Аптасына екі рет, 8 оқушымен шектелген тірі сабақтар — дәрісті пассивті тыңдау емес, дауыстап ойлауға негізделген.",
      "syl4.title": "Апта сайынғы меңгеру тексерісі",
      "syl4.body": "Қысқа, қауіпсіз сынақтар есте сақтауды қадағалайды және аралық қайталау арқылы ұмытылып бара жатқан тақырыптарды автоматты түрде қайта көрсетеді.",
      "syl5.title": "Сынақ емтихан және сертификат",
      "syl5.body": "Нақты жағдайда өтетін толық көлемді сынақ емтихан, жеке талданады, содан кейін бағыт бойынша аяқтау сертификаты беріледі.",

      "page.tests.eyebrow": "Жаттығу және бағалау",
      "page.tests.title": "Нені білетініңізді тексеріңіз.",
      "page.tests.desc": "Қысқа, нақты тесттер жедел кері байланыспен — төменнен тақырып таңдап, бес минуттан аз уақытта нәтижеңізді көріңіз.",
      "test1.tag": "Алгебра",
      "test1.title": "Сызықтық теңдеулер тексерісі",
      "test1.desc": "Бір және екі айнымалы сызықтық теңдеулер мен мәтіндік есептерге арналған 8 сұрақ.",
      "test2.tag": "Геометрия",
      "test2.title": "Бұрыштар мен үшбұрыштар",
      "test2.desc": "Бұрыш қатынастары, үшбұрыш қасиеттері және Пифагор теоремасына арналған 8 сұрақ.",
      "test3.tag": "Арифметика",
      "test3.title": "Бөлшектер мен қатынастар",
      "test3.desc": "Бөлшектермен амалдар, пропорция және пайыз есептеріне арналған 8 сұрақ.",
      "test.meta.questions": "8 сұрақ",
      "test.meta.time": "~5 мин",
      "test.meta.level": "6–9 сынып",
      "quiz.start": "Тестті бастау",
      "quiz.question": "Сұрақ",
      "quiz.of": "/",
      "quiz.next": "Келесі сұрақ",
      "quiz.finish": "Нәтижені көру",
      "quiz.retake": "Тестті қайта тапсыру",
      "quiz.back": "Тесттерге оралу",
      "quiz.result.title": "Жақсы нәтиже.",
      "quiz.result.desc": "Нәтижеңіз мынада — жіберген тақырыптарды курс кітапханасынан қайталаңыз.",
      "quiz.score": "Ұпай",

      "page.about.eyebrow": "Академия туралы",
      "page.about.title": "Пәнді жанымен сүйетін адамдар құрған.",
      "page.about.desc": "SAYAT MATH Алматыдағы сабақтан тыс репетиторлықтан басталып, толыққанды онлайн академияға айналды — оқыту философиясы өзгерген жоқ.",
      "mission.eyebrow": "Біздің миссия",
      "mission.title": "Математика — жаттап алатын пән емес, ойлау тәсілі.",
      "mission.body": "Көптеген оқушылар үшін математика — емтиханға жаттайтын процедуралар жиынтығы. Біз оны нақты ойлау тілі ретінде оқытамыз — бұл кез келген жалғыз емтиханнан да ұзаққа созылатын дағды. Әр сабақ алдымен нақты сұрақтан, содан кейін ғана формуладан құралады.",
      "values.eyebrow": "Біз ұстанатын нәрсе",
      "values.title": "Әр сабақтың негізіндегі үш қағида.",
      "v1.title": "Жылдамдықтан бұрын түсіну",
      "v1.desc": "Біз ешқашан жылдам жауапты түсінуге айырбастамаймыз. Ұғым шынымен түсінілген кезде жылдамдық өздігінен пайда болады.",
      "v2.title": "Шағын тірі сабақтар",
      "v2.desc": "8 оқушымен шектелген, себебі әр оқушы тек дәрісті тыңдамай, дауыстап ойлауы керек.",
      "v3.title": "Жергілікті тамыр, әлемдік стандарт",
      "v3.desc": "Қазақстанның ұлттық бағдарламасына сәйкестендірілген, халықаралық олимпиада есептерімен салыстырылған.",
      "team.eyebrow": "Ұжым",
      "team.title": "Мұғалімдерімізбен танысыңыз.",
      "tm1.name": "Ерлан Тастанов",
      "tm1.role": "Негізін қалаушы · Геометрия жетекшісі",
      "tm2.name": "Алия Нұрғалиева",
      "tm2.role": "Алгебра және олимпиада бапкері",
      "tm3.name": "Мирас Калиев",
      "tm3.role": "Статистика және деректер",
      "tm4.name": "Жанна Омарова",
      "tm4.role": "Оқу бағдарламасы жетекшісі",
      "timeline.eyebrow": "Даму жолы",
      "timeline.title": "Қысқаша тарих.",
      "tl1.year": "2019",
      "tl1.title": "Алматыдағы сабақтан тыс репетиторлық",
      "tl1.body": "Жалға алынған сыныпта екі мұғалім және он бір оқушымен, тек олимпиадаға дайындыққа бағытталып басталды.",
      "tl2.year": "2021",
      "tl2.title": "Алғашқы онлайн ағым",
      "tl2.body": "Оқыту қажеттіліктен онлайнға көшті, содан кейін шағын топтармен тірі сабақтардың қашықтан да тіпті жақсырақ жұмыс істейтіні анықталды.",
      "tl3.year": "2023",
      "tl3.title": "Толық бағдарламаның іске қосылуы",
      "tl3.body": "Арифметика негіздерінен математикалық анализге дейінгі толық бағыттар жүйесі ұлттық бағдарламаға сәйкес шығарылды.",
      "tl4.year": "2026",
      "tl4.title": "5 000 оқушы, 20 мұғалім",
      "tl4.body": "Әр тірі сабақты сегіз оқушымен шектеп ұстай отырып, толыққанды академияға айналды.",

      "page.contact.eyebrow": "Байланысқа шығу",
      "page.contact.title": "Жазылу алдында сұрақтарыңыз бар ма?",
      "page.contact.desc": "Хабарлама жіберіңіз — академия тобының мүшесі бір жұмыс күні ішінде жауап береді.",
      "contact.info.title": "Байланыс деректері",
      "contact.phone.label": "Телефон",
      "contact.email.label": "Электрондық пошта",
      "contact.address.label": "Мекенжай",
      "contact.address.value": "Әл-Фараби даңғылы 71, Алматы, Қазақстан",
      "contact.hours.label": "Жұмыс уақыты",
      "contact.hours.value": "Дс–Сб, 09:00–19:00",
      "form.name": "Аты-жөні",
      "form.name.ph": "Атыңыз",
      "form.email": "Электрондық пошта",
      "form.email.ph": "siz@example.com",
      "form.phone": "Телефон",
      "form.phone.ph": "+7 (7__) ___-__-__",
      "form.topic": "Тақырып",
      "form.topic.enroll": "Жазылу туралы сұрақ",
      "form.topic.pricing": "Баға туралы",
      "form.topic.partnership": "Серіктестік",
      "form.topic.other": "Басқа",
      "form.message": "Хабарлама",
      "form.message.ph": "Мақсаттарыңыз туралы қысқаша жазыңыз...",
      "form.submit": "Хабарлама жіберу",
      "form.note": "Бұл форманы жіберу арқылы SAYAT MATH сізбен сұрауыңыз бойынша хабарласуға келісім бересіз.",
      "form.success": "Хабарлама жіберілді — бір жұмыс күні ішінде жауап береміз."
    }
  };

  /* -----------------------------------------------------------------------
     2. LANGUAGE ENGINE
     ----------------------------------------------------------------------- */
  function getLangFromURL() {
    const p = new URLSearchParams(window.location.search);
    const l = p.get("lang");
    return l === "kk" || l === "en" ? l : null;
  }

  function detectDefaultLang() {
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("kk") ? "kk" : "en";
  }

  let currentLang = getLangFromURL() || detectDefaultLang();

  function applyTranslations(lang) {
    const dict = DICT[lang] || DICT.en;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    // keep internal links carrying the current language
    document.querySelectorAll('a[href$=".html"], a[data-internal]').forEach((a) => {
      try {
        const url = new URL(a.getAttribute("href"), window.location.href);
        if (url.origin === window.location.origin) {
          url.searchParams.set("lang", lang);
          a.setAttribute("href", url.pathname.split("/").pop() + url.search + url.hash);
        }
      } catch (e) { /* ignore malformed hrefs like #id */ }
    });
  }

  function setLang(lang) {
    currentLang = lang;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
    applyTranslations(lang);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (btn) setLang(btn.getAttribute("data-lang"));
  });

  /* -----------------------------------------------------------------------
     3. HEADER: scroll shadow + mobile nav
     ----------------------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    const closeBtn = document.querySelector(".mobile-nav-close");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", () => mobileNav.classList.add("open"));
      closeBtn && closeBtn.addEventListener("click", () => mobileNav.classList.remove("open"));
      mobileNav.addEventListener("click", (e) => {
        if (e.target === mobileNav) mobileNav.classList.remove("open");
      });
    }
  }

  /* -----------------------------------------------------------------------
     4. SCROLL REVEAL
     ----------------------------------------------------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .reveal-scale");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------------------
     5. ANIMATED COUNTERS
     ----------------------------------------------------------------------- */
  function initCounters() {
    const nums = document.querySelectorAll(".stat-num[data-target]");
    if (!nums.length) return;
    const animate = (el) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US")) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------------------
     6. TESTIMONIAL SLIDER
     ----------------------------------------------------------------------- */
  function initTestimonials() {
    const shell = document.querySelector(".testi-shell");
    if (!shell) return;
    const slides = Array.from(shell.querySelectorAll(".testi-slide"));
    const dots = Array.from(shell.querySelectorAll(".testi-dots button"));
    let index = 0;
    let timer = null;

    function show(i) {
      slides.forEach((s, si) => s.classList.toggle("active", si === i));
      dots.forEach((d, di) => d.classList.toggle("active", di === i));
      index = i;
    }
    function next() { show((index + 1) % slides.length); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }
    dots.forEach((d, i) => d.addEventListener("click", () => { show(i); restart(); }));
    const prevBtn = shell.querySelector(".testi-prev");
    const nextBtn = shell.querySelector(".testi-next");
    prevBtn && prevBtn.addEventListener("click", () => { show((index - 1 + slides.length) % slides.length); restart(); });
    nextBtn && nextBtn.addEventListener("click", () => { next(); restart(); });
    show(0);
    restart();
  }

  /* -----------------------------------------------------------------------
     7. SYLLABUS ACCORDION (courses.html)
     ----------------------------------------------------------------------- */
  function initSyllabus() {
    document.querySelectorAll(".syl-item").forEach((item) => {
      const head = item.querySelector(".syl-head");
      const body = item.querySelector(".syl-body");
      head.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".syl-item.open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".syl-body").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        body.style.maxHeight = !isOpen ? body.scrollHeight + "px" : null;
      });
    });
  }

  /* -----------------------------------------------------------------------
     8. COURSE FILTER (courses.html)
     ----------------------------------------------------------------------- */
  function initFilters() {
    const chips = document.querySelectorAll(".filter-chip");
    if (!chips.length) return;
    const cards = document.querySelectorAll(".course-grid-full .course-card");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const level = chip.getAttribute("data-filter");
        cards.forEach((card) => {
          const show = level === "all" || card.getAttribute("data-level") === level;
          card.hidden = !show;
        });
      });
    });
  }

  /* -----------------------------------------------------------------------
     9. QUIZ ENGINE (tests.html)
     ----------------------------------------------------------------------- */
  const QUIZ_BANK = {
    algebra: [
      { q: { en: "Solve for x: 3x + 7 = 22", kk: "x-ті тап: 3x + 7 = 22" }, opts: { en: ["3", "5", "7", "15"], kk: ["3", "5", "7", "15"] }, correct: 1 },
      { q: { en: "Solve for x: 2x − 9 = 5", kk: "x-ті тап: 2x − 9 = 5" }, opts: { en: ["2", "5", "7", "9"], kk: ["2", "5", "7", "9"] }, correct: 2 },
      { q: { en: "If 5x = 45, what is x?", kk: "5x = 45 болса, x неге тең?" }, opts: { en: ["5", "8", "9", "12"], kk: ["5", "8", "9", "12"] }, correct: 2 },
      { q: { en: "Solve: x/4 + 3 = 10", kk: "Шеш: x/4 + 3 = 10" }, opts: { en: ["21", "24", "28", "31"], kk: ["21", "24", "28", "31"] }, correct: 2 },
      { q: { en: "A book costs 2x + 5 tenge. If it costs 25, what is x?", kk: "Кітап 2x + 5 теңге тұрады. Ол 25 теңге болса, x неге тең?" }, opts: { en: ["8", "9", "10", "12"], kk: ["8", "9", "10", "12"] }, correct: 2 },
      { q: { en: "Solve: 4(x − 2) = 16", kk: "Шеш: 4(x − 2) = 16" }, opts: { en: ["4", "6", "8", "10"], kk: ["4", "6", "8", "10"] }, correct: 1 },
      { q: { en: "Which value of x makes 6x = 3x + 12 true?", kk: "6x = 3x + 12 теңдігі қай x-те дұрыс?" }, opts: { en: ["2", "3", "4", "6"], kk: ["2", "3", "4", "6"] }, correct: 2 },
      { q: { en: "Solve: 7 − x = 2", kk: "Шеш: 7 − x = 2" }, opts: { en: ["3", "5", "9", "−5"], kk: ["3", "5", "9", "−5"] }, correct: 1 }
    ],
    geometry: [
      { q: { en: "How many degrees are in a straight angle?", kk: "Жазыңқы бұрышта неше градус бар?" }, opts: { en: ["90°", "120°", "180°", "360°"], kk: ["90°", "120°", "180°", "360°"] }, correct: 2 },
      { q: { en: "The angles of a triangle always sum to:", kk: "Үшбұрыш бұрыштарының қосындысы әрқашан:" }, opts: { en: ["90°", "180°", "270°", "360°"], kk: ["90°", "180°", "270°", "360°"] }, correct: 1 },
      { q: { en: "A right triangle has legs 3 and 4. What is the hypotenuse?", kk: "Тікбұрышты үшбұрыштың катеттері 3 және 4. Гипотенузасы қандай?" }, opts: { en: ["5", "6", "7", "12"], kk: ["5", "6", "7", "12"] }, correct: 0 },
      { q: { en: "Two angles that sum to 90° are called:", kk: "Қосындысы 90° болатын екі бұрыш қалай аталады:" }, opts: { en: ["Supplementary", "Complementary", "Adjacent", "Vertical"], kk: ["Толықтауыш", "Іргелес", "Тік бұрыштық", "Вертикаль"] }, correct: 1 },
      { q: { en: "An equilateral triangle has how many equal sides?", kk: "Тең қабырғалы үшбұрыштың неше қабырғасы тең?" }, opts: { en: ["1", "2", "3", "0"], kk: ["1", "2", "3", "0"] }, correct: 2 },
      { q: { en: "If two angles are vertical angles, they are always:", kk: "Егер екі бұрыш вертикаль бұрыштар болса, олар әрқашан:" }, opts: { en: ["Equal", "Supplementary", "Complementary", "Unrelated"], kk: ["Тең", "Толықтауыш", "Іргелес", "Байланыссыз"] }, correct: 0 },
      { q: { en: "A leg of a right triangle is 6, hypotenuse is 10. Find the other leg.", kk: "Тікбұрышты үшбұрыштың бір катеті 6, гипотенузасы 10. Екінші катетін тап." }, opts: { en: ["6", "7", "8", "9"], kk: ["6", "7", "8", "9"] }, correct: 2 },
      { q: { en: "The sum of interior angles of a quadrilateral is:", kk: "Төртбұрыштың ішкі бұрыштарының қосындысы:" }, opts: { en: ["180°", "270°", "360°", "540°"], kk: ["180°", "270°", "360°", "540°"] }, correct: 2 }
    ],
    arithmetic: [
      { q: { en: "1/2 + 1/4 = ?", kk: "1/2 + 1/4 = ?" }, opts: { en: ["1/6", "2/6", "3/4", "1"], kk: ["1/6", "2/6", "3/4", "1"] }, correct: 2 },
      { q: { en: "What is 3/5 as a percentage?", kk: "3/5 бөлшегі пайызбен қанша?" }, opts: { en: ["35%", "50%", "60%", "65%"], kk: ["35%", "50%", "60%", "65%"] }, correct: 2 },
      { q: { en: "2/3 × 3/4 = ?", kk: "2/3 × 3/4 = ?" }, opts: { en: ["1/2", "5/7", "6/7", "2"], kk: ["1/2", "5/7", "6/7", "2"] }, correct: 0 },
      { q: { en: "A shirt costs 4000₸. At 25% off, what's the sale price?", kk: "Көйлек 4000₸ тұрады. 25% жеңілдікпен бағасы қанша болады?" }, opts: { en: ["3000₸", "3200₸", "3500₸", "2800₸"], kk: ["3000₸", "3200₸", "3500₸", "2800₸"] }, correct: 0 },
      { q: { en: "Simplify: 8/12", kk: "Ықшамдаңыз: 8/12" }, opts: { en: ["1/2", "2/3", "3/4", "4/6"], kk: ["1/2", "2/3", "3/4", "4/6"] }, correct: 1 },
      { q: { en: "What ratio is equivalent to 4:6?", kk: "4:6 қатынасына тең қатынасты табыңыз" }, opts: { en: ["1:2", "2:3", "3:4", "6:8"], kk: ["1:2", "2:3", "3:4", "6:8"] }, correct: 1 },
      { q: { en: "5 out of 20 students failed. What percent passed?", kk: "20 оқушының 5-і сынақтан өтпеді. Неше пайызы өтті?" }, opts: { en: ["25%", "60%", "75%", "80%"], kk: ["25%", "60%", "75%", "80%"] }, correct: 2 },
      { q: { en: "3/8 + 1/8 = ?", kk: "3/8 + 1/8 = ?" }, opts: { en: ["1/2", "4/16", "1/4", "4/8"], kk: ["1/2", "4/16", "1/4", "4/8"] }, correct: 0 }
    ]
  };

  function initQuiz() {
    const panel = document.querySelector(".quiz-panel");
    const cards = document.querySelectorAll(".test-card");
    if (!panel || !cards.length) return;

    let bankKey = null;
    let qIndex = 0;
    let score = 0;
    let answered = false;

    const els = {
      intro: panel.querySelector(".quiz-intro"),
      body: panel.querySelector(".quiz-body"),
      result: panel.querySelector(".quiz-result"),
      progressLabel: panel.querySelector(".quiz-progress-label"),
      progressFill: panel.querySelector(".quiz-progress-fill"),
      question: panel.querySelector(".quiz-question"),
      options: panel.querySelector(".quiz-options"),
      nextBtn: panel.querySelector(".quiz-next-btn"),
      scorePill: panel.querySelector(".quiz-score-pill"),
      retakeBtn: panel.querySelector(".quiz-retake-btn"),
      backBtns: panel.querySelectorAll(".quiz-back-btn"),
      ringNum: panel.querySelector(".ring-num"),
      ringFg: panel.querySelector(".ring-fg")
    };

    function startQuiz(key) {
      bankKey = key;
      qIndex = 0;
      score = 0;
      answered = false;
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      els.result.hidden = true;
      els.body.hidden = false;
      renderQuestion();
    }

    function renderQuestion() {
      const bank = QUIZ_BANK[bankKey];
      const item = bank[qIndex];
      const dict = DICT[currentLang];
      els.progressLabel.textContent = `${dict["quiz.question"]} ${qIndex + 1} ${dict["quiz.of"]} ${bank.length}`;
      els.progressFill.style.width = ((qIndex) / bank.length * 100) + "%";
      els.question.textContent = item.q[currentLang];
      els.options.innerHTML = "";
      answered = false;
      els.nextBtn.textContent = qIndex === bank.length - 1 ? dict["quiz.finish"] : dict["quiz.next"];
      els.nextBtn.disabled = true;
      const letters = ["A", "B", "C", "D"];
      item.opts[currentLang].forEach((optText, i) => {
        const b = document.createElement("button");
        b.className = "quiz-option";
        b.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${optText}</span>`;
        b.addEventListener("click", () => selectOption(b, i, item.correct));
        els.options.appendChild(b);
      });
      els.scorePill.textContent = `${dict["quiz.score"]}: ${score}/${bank.length}`;
    }

    function selectOption(btn, i, correctIndex) {
      if (answered) return;
      answered = true;
      const allBtns = els.options.querySelectorAll(".quiz-option");
      allBtns.forEach((b, bi) => {
        b.disabled = true;
        if (bi === correctIndex) b.classList.add("correct");
        else if (bi === i) b.classList.add("wrong");
      });
      if (i === correctIndex) score++;
      els.nextBtn.disabled = false;
      els.scorePill.textContent = `${DICT[currentLang]["quiz.score"]}: ${score}/${QUIZ_BANK[bankKey].length}`;
    }

    function goNext() {
      const bank = QUIZ_BANK[bankKey];
      if (qIndex < bank.length - 1) {
        qIndex++;
        renderQuestion();
      } else {
        finish();
      }
    }

    function finish() {
      const bank = QUIZ_BANK[bankKey];
      const pct = Math.round((score / bank.length) * 100);
      els.body.hidden = true;
      els.result.hidden = false;
      els.progressFill.style.width = "100%";
      const circumference = 2 * Math.PI * 66;
      els.ringFg.style.strokeDasharray = circumference;
      els.ringFg.style.strokeDashoffset = circumference;
      requestAnimationFrame(() => {
        els.ringFg.style.transition = "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)";
        els.ringFg.style.strokeDashoffset = circumference - (circumference * pct) / 100;
      });
      els.ringNum.textContent = pct + "%";
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => startQuiz(card.getAttribute("data-bank")));
    });
    els.nextBtn && els.nextBtn.addEventListener("click", goNext);
    els.retakeBtn && els.retakeBtn.addEventListener("click", () => startQuiz(bankKey));
    els.backBtns.forEach((btn) => btn.addEventListener("click", () => {
      panel.hidden = true;
      document.querySelector(".test-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  /* -----------------------------------------------------------------------
     10. CONTACT FORM (contact.html)
     ----------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector("#contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = document.querySelector(".form-success");
      success.classList.add("show");
      form.reset();
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* -----------------------------------------------------------------------
     11. INIT
     ----------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(currentLang);
    initHeader();
    initReveal();
    initCounters();
    initTestimonials();
    initSyllabus();
    initFilters();
    initQuiz();
    initContactForm();
  });
})();