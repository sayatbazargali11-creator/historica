// ==========================================================================
// --- EDUSER STYLE LIVE UNIVERSITIES FILTER (SEARCH + CITY MULTISELECT) ---
// ==========================================================================
function filterUniversities() {
    const searchQuery = document.getElementById('uniSearchInput').value.toLowerCase().trim();
    const selectedCity = document.getElementById('uniCitySelect').value;
    const allUniCards = document.querySelectorAll('.uni-premium-card');

    allUniCards.forEach(card => {
        const cardCity = card.getAttribute('data-city');
        const cardCode = card.getAttribute('data-code');
        const keywords = card.getAttribute('data-keywords') || '';

        const matchesCity = (selectedCity === 'all' || cardCity === selectedCity);
        const matchesSearch = (searchQuery === '' || 
                               cardCode.includes(searchQuery) || 
                               keywords.includes(searchQuery));

        if (matchesCity && matchesSearch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
// ==========================================================================
// --- UNIVERSITIES DETAILED MODAL ENGINE (EDUSER PRESETS) ---
// ==========================================================================

// Имитациялық толық деректер қоры (Әр ЖОО кодына байланысты мамандықтар мен мәліметтер)
const vuzExtendedDatabase = {
    "001": {
        majors: [
            { name: "Жалпы медицина", subjects: "Биология + Химия", score: "122 балл" },
            { name: "Педиатрия", subjects: "Биология + Химия", score: "115 балл" },
            { name: "Стоматология", subjects: "Биология + Химия", score: "131 балл" }
        ],
        dormitory: "Иә (3 студенттер үйі)",
        site: "amu.edu.kz",
        infrastructure: "Заманауи клиникалық орталықтар, симуляциялық госпиталь"
    },
    "032": {
        majors: [
            { name: "Халықаралық қатынастар", subjects: "Дүниежүзі тарихы + Шет тілі", score: "118 балл" },
            { name: "Ақпараттық жүйелер", subjects: "Математика + Информатика", score: "108 балл" },
            { name: "Құқықтану", subjects: "Адам. Қоғам. Құқық + Тарих", score: "112 балл" }
        ],
        dormitory: "Иә (9 жатақхана кешені)",
        site: "enu.kz",
        infrastructure: "Ғылыми кітапхана, Олимпиадалық жүзу бассейні, IT-Hub"
    },
    "024": {
        majors: [
            { name: "Ақпараттық қауіпсіздік", subjects: "Математика + Информатика", score: "110 балл" },
            { name: "Бағдарламалық инженерия", subjects: "Математика + Informтика", score: "114 балл" },
            { name: "Робототехника және Мехатроника", subjects: "Математика + Физика", score: "92 балл" }
        ],
        dormitory: "Иә (5 жатақхана бар)",
        site: "satbayev.university",
        infrastructure: "Фаблаб зертханалары, Халықаралық жасыл технологиялар орталығы"
    },
    "522": {
        majors: [
            { name: "Computer Science (КД)", subjects: "Математика + Информатика", score: "119 балл" },
            { name: "Cybersecurity", subjects: "Математика + Информатика", score: "116 балл" },
            { name: "Big Data Analytics", subjects: "Математика + Информатика", score: "105 ball" }
        ],
        dormitory: "Иә (Заманауи Smart-жатақхана)",
        site: "astanait.edu.kz",
        infrastructure: "CISCO, Huawei, Microsoft академиялық орталықтары"
    }
};

// Модальды терезені ашу және мазмұнды толтыру функциясы
function openUniModal(vuzCode, vuzName, vuzCity, vuzMilitary) {
    const modalOverlay = document.getElementById('uniDetailsModal');
    const modalContent = document.getElementById('uniModalContent');
    
    // Егер базада бұл ВУЗ нақты жазылмаса, дефолтты мамандықтар тізімін шығарамыз
    const details = vuzExtendedDatabase[vuzCode] || {
        majors: [
            { name: "Ақпараттық технологиялар", subjects: "Математика + Информатика", score: "95 балл" },
            { name: "Экономика және Менеджмент", subjects: "Математика + География", score: "88 балл" },
            { name: "Шет тілі: Екі шет тілі", subjects: "Шет тілі + Тарих", score: "102 балл" }
        ],
        dormitory: "Иә (Сұраныс бойынша беріледі)",
        site: "ats.edu.kz",
        infrastructure: "Студенттік коворкинг, Оқу залы, Спорт кешені"
    };

    // Мамандықтар HTML кодын құрастыру
    let majorsHtml = '';
    details.majors.forEach(major => {
        majorsHtml += `
            <div class="major-row-item">
                <div class="major-name-block">
                    <span class="major-title-text">${major.name}</span>
                    <span class="major-subjects-text"><i class="fa-regular fa-compass"></i> Бейіндік пәндер: ${major.subjects}</span>
                </div>
                <div class="major-grant-badge">Грант шегі: ${major.score}</div>
            </div>
        `;
    });

    // Модаль ішін толық толтыру
    modalContent.innerHTML = `
        <div class="modal-uni-header">
            <div class="modal-uni-meta">
                <span class="uni-code-badge">КОД: ${vuzCode}</span>
                <span class="uni-city-tag"><i class="fa-solid fa-location-dot"></i> ${vuzCity}</span>
            </div>
            <h3 class="modal-uni-title">${vuzName}</h3>
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-graduation-cap"></i> Танымал мамандықтар мен Грант баллдары</div>
        <div class="modal-majors-list">
            ${majorsHtml}
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-circle-info"></i> Университет мүмкіндіктері</div>
        <div class="modal-features-grid">
            <div class="feature-modal-card">
                <i class="fa-solid fa-hotel"></i>
                <div><strong>Жатақхана:</strong><br>${details.dormitory}</div>
            </div>
            <div class="feature-modal-card">
                <i class="fa-solid fa-shield-halved"></i>
                <div><strong>Әскери кафедра:</strong><br>${vuzMilitary}</div>
            </div>
            <div class="feature-modal-card">
                <i class="fa-solid fa-laptop-code"></i>
                <div><strong>Инфрақұрылым:</strong><br>${details.infrastructure}</div>
            </div>
            <div class="feature-modal-card">
                <i class="fa-solid fa-earth-americas"></i>
                <div><strong>Ресми сайт:</strong><br><a href="https://${details.site}" target="_blank" style="color:var(--accent-green); font-weight:600;">${details.site}</a></div>
            </div>
        </div>
    `;

    // Модальды көрсету
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Артқы бет айналып кетпеуі үшін
}

// Модальды жабу функциясы
function closeUniModal(event, forced = false) {
    const modalOverlay = document.getElementById('uniDetailsModal');
    if (forced || event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Карточкалардағы сілтемелерді басу оқиғасын тіркеу (Жүйелік делегация)
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const moreLink = e.target.closest('.uni-more-link');
        if (moreLink) {
            const card = moreLink.closest('.uni-premium-card');
            if (card) {
                const code = card.getAttribute('data-code');
                const name = card.querySelector('.uni-title').textContent;
                const city = card.querySelector('.uni-city-tag').textContent.trim();
                
                // Әскери кафедра мәліметін табу
                const stats = card.querySelectorAll('.uni-stat-pill');
                let military = 'Жоқ';
                stats.forEach(pill => {
                    if(pill.textContent.includes('Әскери')) {
                        military = pill.textContent.replace('Әскери кафедра:', '').trim();
                    }
                });

                openUniModal(code, name, city, military);
            }
        }
    });
});