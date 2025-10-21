document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.querySelector("#fullname").value.trim();
        const phone = form.querySelector("#phone").value.trim();
        const email = form.querySelector("#email").value.trim();
        const message = form.querySelector("#message").value.trim();

        if (!name || !phone || !email || !message) {
            showToast("⚠️ Vui lòng nhập đầy đủ thông tin!", "error");
            return;
        }

        form.classList.add("sending");
        const btn = form.querySelector(".contact-send");
        btn.textContent = "Đang gửi...";

        setTimeout(() => {
            showToast("✅ Gửi liên hệ thành công! Cảm ơn bạn ❤️", "success");
            form.reset();
            btn.textContent = "Gửi đi";
            form.classList.remove("sending");
        }, 1200);
    });
});

function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.classList.remove("show"), 2500);
    setTimeout(() => toast.remove(), 3000);
}
// ================= CONTACT PAGE =================
const ContactPage = {
    init() {
        const form = document.getElementById("contactForm");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = form.querySelector("#fullname").value.trim();
            const phone = form.querySelector("#phone").value.trim();
            const email = form.querySelector("#email").value.trim();
            const message = form.querySelector("#message").value.trim();

            if (!name || !phone || !email || !message) {
                showToast("⚠️ Vui lòng nhập đầy đủ thông tin!", "error");
                return;
            }

            const btn = form.querySelector(".contact-send");
            btn.textContent = "Đang gửi...";
            form.classList.add("sending");

            setTimeout(() => {
                showToast("✅ Gửi liên hệ thành công! Cảm ơn bạn ❤️", "success");
                form.reset();
                btn.textContent = "Gửi đi";
                form.classList.remove("sending");
            }, 1000);
        });
    }
};

// Thông báo dạng toast
function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.classList.remove("show"), 2500);
    setTimeout(() => toast.remove(), 3000);
}

// Đăng ký ContactPage vào global để main.js gọi
window.ContactPage = ContactPage;
