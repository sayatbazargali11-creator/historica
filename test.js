// ==========================================================================
// --- LIVE SEARCH & FILTER FOR TEST HUB ---
// ==========================================================================

let activeSubjectTabFilter = 'all';

function tabFilterSubject(subjectCode, elementRef) {
    const allPillButtons = document.querySelectorAll('.pill-btn');
    allPillButtons.forEach(btn => btn.classList.remove('active-pill'));
    if (elementRef) elementRef.classList.add('active-pill');
    
    activeSubjectTabFilter = subjectCode;
    filterHubTests();
}

function filterHubTests() {
    const rawSearchQuery = document.getElementById('testSearchInput').value.toLowerCase().trim();
    const allTargetCards = document.querySelectorAll('.test-cyber-card');

    allTargetCards.forEach(card => {
        const itemSubject = card.getAttribute('data-subject');
        const searchKeywords = card.getAttribute('data-keywords');

        const matchesSubjectTab = (activeSubjectTabFilter === 'all' || itemSubject === activeSubjectTabFilter);
        const matchesSearchString = (rawSearchQuery === '' || searchKeywords.includes(rawSearchQuery));

        if (matchesSubjectTab && matchesSearchString) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}