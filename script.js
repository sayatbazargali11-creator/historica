 // --- SPA SECTION SWITCHER (ДИНАМИКАЛЫҚ БЕТТЕРДІ АУЫСТЫРУ) ---
        function switchView(viewId) {
            const views = document.querySelectorAll('.app-view');
            views.forEach(view => {
                view.classList.remove('active-view');
            });

            const activeView = document.getElementById(viewId);
            if(activeView) {
                activeView.classList.add('active-view');
            }

            const menuItems = document.querySelectorAll('.nav-menu li');
            menuItems.forEach(item => item.classList.remove('active'));

            const shortName = viewId.replace('-view', '');
            const currentMenuItem = document.getElementById(`menu-${shortName}`);
            if(currentMenuItem) {
                currentMenuItem.classList.add('active');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ТОЛЫҚ ЭКРАНДЫ МОБИЛЬДІ МӘЗІР БАСҚАРУЫ
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navMenu = document.getElementById('navMenu');

        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navMenu.classList.toggle('open');
            
            if (navMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // FAQ СҰРАҚ-ЖАУАП АККОРДЕОНЫ
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.faq-item').forEach(el => {
                    if (el !== item) el.classList.remove('open');
                });
                item.classList.toggle('open');
            });
        });

        // --- ИНТЕРАКТИВТІ ТЕСТ ЛОГИКАСЫ (ЖАҢАРТЫЛҒАН) ---
        let currentQuestionIdx = 1;
        const totalQuestions = 5;

        function goToQuestion(qNum) {
            currentQuestionIdx = qNum;
            updateTestUI();
        }

        function navigateQuestion(direction) {
            currentQuestionIdx += direction;
            if(currentQuestionIdx < 1) currentQuestionIdx = 1;
            if(currentQuestionIdx > totalQuestions) currentQuestionIdx = totalQuestions;
            updateTestUI();
        }

        function updateTestUI() {
            // Сұрақ блоктарын ауыстыру
            document.querySelectorAll('.question-block').forEach(block => {
                block.classList.remove('active-question');
            });
            document.getElementById(`qBlock-${currentQuestionIdx}`).classList.add('active-question');

            // Сидбар батырмаларын жаңарту
            const sidebarBtns = document.querySelectorAll('#testQuestionsSidebar .test-num-btn');
            sidebarBtns.forEach((btn, idx) => {
                btn.classList.remove('current');
                if((idx + 1) === currentQuestionIdx) {
                    btn.classList.add('current');
                }
            });

            // Прогресс мәтінін жаңарту
            document.getElementById('questionProgressCounter').innerText = `Сұрақ ${currentQuestionIdx} / ${totalQuestions}`;

            // Навигациялық батырмалар күйі
            document.getElementById('prevQuestionBtn').disabled = (currentQuestionIdx === 1);
            if(currentQuestionIdx === totalQuestions) {
                document.getElementById('nextQuestionBtn').innerHTML = 'Аяқтау <i class="fa-solid fa-flag-checkered" style="margin-left:6px;"></i>';
                document.getElementById('nextQuestionBtn').setAttribute('onclick', 'finishTest()');
            } else {
                document.getElementById('nextQuestionBtn').innerHTML = 'Келесі сұрақ <i class="fa-solid fa-arrow-right" style="margin-left: 6px;"></i>';
                document.getElementById('nextQuestionBtn').setAttribute('onclick', 'navigateQuestion(1)');
            }
        }

        function selectOption(element, qNum) {
            const parent = element.parentElement;
            parent.querySelectorAll('.option-box').forEach(box => {
                box.classList.remove('active');
                const check = box.querySelector('.check-circle');
                if(check) {
                    check.innerHTML = '';
                    check.style.borderColor = 'var(--glass-border)';
                    check.style.background = 'transparent';
                }
            });
            
            element.classList.add('active');
            const currentCheck = element.querySelector('.check-circle');
            if(currentCheck) {
                currentCheck.innerHTML = '<i class="fa-solid fa-check"></i>';
                currentCheck.style.borderColor = 'var(--accent-green)';
                currentCheck.style.background = 'var(--accent-gradient)';
                currentCheck.style.color = 'white';
                currentCheck.style.display = 'flex';
                currentCheck.style.alignItems = 'center';
                currentCheck.style.justifyContent = 'center';
                currentCheck.style.fontSize = '11px';
            }

            // Бүйірлік панельде жауап берілгенін белгілеу
            const sidebarBtns = document.querySelectorAll('#testQuestionsSidebar .test-num-btn');
            if(sidebarBtns[qNum - 1]) {
                sidebarBtns[qNum - 1].classList.add('answered');
            }
        }

        function finishTest() {
            alert('Тест сәтті аяқталды! Сіздің нәтижеңіз өңделуде.');
        }

        // Таймерді іске қосу (35 минут)
        let duration = 35 * 60;
        const timerDisplay = document.getElementById('timerClock');
        setInterval(() => {
            let minutes = Math.floor(duration / 60);
            let seconds = duration % 60;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            if(timerDisplay) {
                timerDisplay.textContent = `${minutes}:${seconds}`;
            }
            if (--duration < 0) {
                duration = 0;
            }
        }, 1000);

        // КАУІПСІЗДІК: Көшіруді бұғаттау
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            alert('Осы платформадан мәтінді көшіруге тыйым салынған! / Копирование текста на платформе запрещено!');
        });

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });