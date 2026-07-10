// ==========================================================================
// --- LIVE INTERACTIVE BLOG CATEGORY FILTER ---
// ==========================================================================
function filterBlogCategory(categoryName, elementRef) {
    // Смена активного класса у кнопок-таблеток
    const allBlogPills = document.querySelectorAll('.blog-pill');
    allBlogPills.forEach(pill => pill.classList.remove('active'));
    if(elementRef) elementRef.classList.add('active');

    // Фильтрация карточек
    const allBlogCards = document.querySelectorAll('.blog-premium-card');
    allBlogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (categoryName === 'all' || cardCategory === categoryName) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}