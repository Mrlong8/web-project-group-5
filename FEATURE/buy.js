// buy.js
document.addEventListener('DOMContentLoaded', () => {
    const selected = JSON.parse(localStorage.getItem('selectedBuy') || 'null');
    const buyImg = document.getElementById('buyImg');
    const buyName = document.getElementById('buyName');
    const buyBrand = document.getElementById('buyBrand');
    const buyEngine = document.getElementById('buyEngine');
    const buyPrice = document.getElementById('buyPrice');
    const payBtn = document.getElementById('payBtn');
    const backBtn = document.getElementById('backBtn');
    const qrModal = document.getElementById('qrModal');
    const qrImg = document.getElementById('qrImg');
    const qrClose = document.getElementById('qrClose');

    function formatPrice(num) {
        return Number(num).toLocaleString('vi-VN') + ' VND';
    }

    if (selected) {
        buyImg.src = selected.img || '';
        buyName.textContent = selected.name || '';
        buyBrand.textContent = selected.brand || '';
        buyEngine.textContent = selected.engine || '';
        buyPrice.textContent = formatPrice(selected.price || 0);
    } else {
        // nếu không có dữ liệu nào -> lấy từ cart (nếu có) đầu tiên
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length) {
            const first = cart[0];
            buyImg.src = first.img || '';
            buyName.textContent = first.name || '';
            buyBrand.textContent = first.brand || '';
            buyEngine.textContent = first.engine || '';
            buyPrice.textContent = formatPrice(first.price || 0);
        } else {
            buyName.textContent = 'Không có xe để mua';
            payBtn.disabled = true;
        }
    }

    payBtn?.addEventListener('click', () => {
        // validate form simple
        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        if (!name || !phone || !address) {
            alert('Vui lòng điền thông tin người mua');
            return;
        }

        // tạo chuỗi thanh toán và hiển thị QR (dùng Google Chart API để generate QR img)
        const payData = `name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&amount=${(selected || {}).price || 0}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payData)}`;

        qrImg.src = qrUrl;
        qrModal.classList.remove('hidden');
    });

    qrClose?.addEventListener('click', () => qrModal.classList.add('hidden'));
    qrModal?.addEventListener('click', e => { if (e.target === qrModal) qrModal.classList.add('hidden'); });

    backBtn?.addEventListener('click', () => {
        // Nếu đang chạy trong hệ thống index (có hàm loadPage)
        if (window.loadPage) {
            window.loadPage('./PRODUCT/product.html');
        } else {
            // Nếu mở buy.html trực tiếp (không qua index)
            window.location.href = '../index.html#product';
            // hoặc quay về index rồi tự mở tab PRODUCT
        }
    });

});
