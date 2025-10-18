const menuLinks = document.querySelectorAll('.content nav a');
const popup = document.getElementById('popupMsg');

menuLinks.forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text === 'xã hội' || text === 'thông tin khác') {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Ngăn nhảy trang
            popup.classList.add('show');

            // 2 giây sau ẩn đi
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2000);
        });
    }
});
