// =============================== CHUYỂN TAB ==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            // 🧭 Xác định tên trang (HOME / PRODUCT / CONTACT / NEWS)
            const pageFolder = url.split("/")[1]?.toUpperCase() || "HOME";
            const cssFile = `../${pageFolder}/${pageFolder.toLowerCase()}.css`;

            // 🧹 Xóa CSS trang cũ (nếu có)
            const existingLink = document.getElementById("page-style");
            if (existingLink) existingLink.remove();

            // 📥 Tải nội dung HTML
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // 🎨 Thêm CSS tương ứng
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = cssFile;
            css.id = "page-style";
            document.head.appendChild(css);

            // 🚀 Gọi module tương ứng
            if (pageFolder === "PRODUCT") ProductPage?.init?.();
            else if (pageFolder === "NEWS") NewsPage?.init?.();
            else if (pageFolder === "CONTACT") ContactPage?.init?.();
            else if (pageFolder === "HOME") HomePage?.init?.();

        } catch (error) {
            console.error("❌ Lỗi khi tải trang:", error);
            content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
        }
    }

    // 🏠 Tải mặc định trang HOME khi mở web
    if (!content.innerHTML.trim()) loadPage("./HOME/home.html");

    // 🔗 Sự kiện click menu
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadPage(link.dataset.page);
        });
    });

    // 👤 Khởi tạo menu người dùng
    initUserMenu(loadPage);
});

// =============================== MENU USER ==========================
function initUserMenu(loadPage) {
    const userIcon = document.getElementById("userIcon");
    const userOverlay = document.getElementById("userOverlay");
    const userMenu = document.querySelector(".user-menu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!userIcon || !userOverlay || !userMenu) return;

    userIcon.addEventListener("click", () => {
        userOverlay.classList.toggle("active");
        userMenu.classList.toggle("active");
    });

    userOverlay.addEventListener("click", e => {
        if (!e.target.closest(".user-menu") && !e.target.closest("#userIcon")) {
            userOverlay.classList.remove("active");
            userMenu.classList.remove("active");
        }
    });

    userMenu.querySelectorAll("a[data-page]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            loadPage(link.dataset.page);
            userOverlay.classList.remove("active");
            userMenu.classList.remove("active");
        });
    });

    logoutBtn?.addEventListener("click", () => {
        alert("Đã đăng xuất!");
        userOverlay.classList.remove("active");
        userMenu.classList.remove("active");
    });
}
