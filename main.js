window.updateAuthUI = function () {
    const loginBtn = document.getElementById("loginBtn");
    const userIcon = document.getElementById("userIcon");

    const logged = localStorage.getItem('activeLogin');
    if (loginBtn) loginBtn.style.display = logged ? '' : 'none';
    if (userIcon) userIcon.style.display = logged ? 'none' : '';
};

// =============================== CHUYỂN TAB ==========================
document.addEventListener("DOMContentLoaded", () => {
    window.updateAuthUI();

    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a[data-page]");

    // ==================== LOAD PAGE ====================
    async function loadPage(url) {
        try {
            const content = document.getElementById("content");
            const pageFolder = url.split("/")[1]?.toUpperCase() || "HOME";
            const baseName = url.split("/")[2]?.split(".")[0] || "home";

            // 🔹 Xóa CSS cũ
            document.getElementById("page-style")?.remove();

            // 🔹 Load HTML
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // 🔹 Load CSS tương ứng
            const cssFile = `./${pageFolder}/${baseName}.css`;
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = cssFile;
            css.id = "page-style";
            document.head.appendChild(css);

            // 🔹 Xóa JS cũ
            document.getElementById("page-script")?.remove();

            // 🔹 Load JS tương ứng
            const jsFile = `./${pageFolder}/${baseName}.js`;
            const script = document.createElement("script");
            script.src = jsFile;
            script.id = "page-script";
            script.onload = () => {
                if (pageFolder === "PRODUCT" && window.ProductPage) ProductPage.init();
                else if (pageFolder === "NEWS" && window.NewsPage) NewsPage.init();
                else if (pageFolder === "CONTACT" && window.ContactPage) ContactPage.init();
                else if (pageFolder === "HOME" && window.HomePage) HomePage.init();
                else if (pageFolder === "FEATURE") {
                    if (url.includes("shopcart") && window.ShopCartPage) ShopCartPage.init();
                    if (url.includes("buy") && window.BuyPage) BuyPage.init();
                }
            };
            document.body.appendChild(script);

            window.currentPage = pageFolder;
            window.loadPage = loadPage;
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {
            console.error("❌ Lỗi khi tải trang:", error);
            document.getElementById("content").innerHTML =
                `<p style="color:red;">Không tải được trang: ${url}</p>`;
        }
    }

    // Expose global
    window.loadPage = window.loadPage || loadPage;

    // 🏠 Tải trang mặc định
    if (!content.innerHTML.trim()) loadPage("./HOME/home.html");

    // 🔗 Bắt sự kiện menu
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadPage(link.dataset.page);
        });
    });

    // 👤 Menu người dùng
    initUserMenu(loadPage);

    // Cập nhật UI khi thay đổi localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === 'activeLogin') {
            window.updateAuthUI();
        }
    });
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

    // 🌙 Nút chuyển chế độ sáng/tối
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        const isDark = localStorage.getItem("theme") === "dark";
        if (isDark) {
            document.body.classList.add("dark-mode");
            themeToggle.innerHTML = '<i class="fa fa-sun"></i> LIGHT MODE';
        }

        themeToggle.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("dark-mode");
            const dark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", dark ? "dark" : "light");
            themeToggle.innerHTML = dark
                ? '<i class="fa fa-sun"></i> LIGHT MODE'
                : '<i class="fa fa-moon"></i> DARK MODE';
        });
    }


    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem('activeLogin');
        alert("Đã đăng xuất!");
        userOverlay.classList.remove("active");
        userMenu.classList.remove("active");
        window.updateAuthUI();
    });
}

// =============================== NÚT EDIT ==========================
document.addEventListener('click', (e) => {
    if (e.target.closest('#editBtn')) {
        const page = window.currentPage || 'HOME';

        if (page === 'PRODUCT') {
            const contentEl = document.getElementById('content');
            contentEl.classList.toggle('edit-mode');
            alert('🛠️ Chế độ chỉnh sửa: ' +
                (contentEl.classList.contains('edit-mode') ? 'BẬT' : 'TẮT'));
        } else {
            alert('⚠️ Chức năng này chỉ áp dụng cho trang PRODUCT!');
        }
    }
});
