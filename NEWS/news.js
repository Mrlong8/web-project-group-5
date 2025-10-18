const NewsPage = {
    init() {
        const menuLinks = document.querySelectorAll('.content nav a');
        const popup = document.getElementById('popupMsg');
        if (!menuLinks.length || !popup) return;

        menuLinks.forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            if (text === 'xã hội' || text === 'thông tin khác') {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    popup.classList.add('show');
                    setTimeout(() => popup.classList.remove('show'), 2000);
                });
            }
        });

        console.log("✅ NewsPage.init() loaded");
    }
};
