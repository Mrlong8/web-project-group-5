window.updateAuthUI = function () {
    const loginBtn = document.getElementById("loginBtn");
    const userIcon = document.getElementById("userIcon");

    // đọc trạng thái từ localStorage (an toàn khi dùng module)
    const logged = localStorage.getItem('activeLogin');

    if (loginBtn) loginBtn.style.display = logged ? '' : 'none';
    if (userIcon) userIcon.style.display = logged ? 'none' : '';
};



// =============================== CHUYỂN TAB ==========================
document.addEventListener("DOMContentLoaded", () => {
    window.updateAuthUI();

    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a[data-page]");

    // (Trong đoạn DOMContentLoaded của main.js) — thay phần loadPage hiện tại bằng đoạn sau
    async function loadPage(url) {
        try {
            const content = document.getElementById("content");
            const pageFolder = url.split("/")[1]?.toUpperCase() || "HOME";
            const baseName = url.split("/")[2]?.split(".")[0] || "home";

            // Xóa CSS cũ
            const existingLink = document.getElementById("page-style");
            if (existingLink) existingLink.remove();

            // Load HTML
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // Load CSS tương ứng
            const cssFile = `../${pageFolder}/${baseName}.css`;
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = cssFile;
            css.id = "page-style";
            document.head.appendChild(css);

            // Xóa JS cũ
            const existingScript = document.getElementById("page-script");
            if (existingScript) existingScript.remove();

            // Load JS tương ứng
            const jsFile = `../${pageFolder}/${baseName}.js`;
            const script = document.createElement("script");
            script.src = jsFile;
            script.id = "page-script";
            document.body.appendChild(script);

            // Khi script load xong thì gọi init
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

            window.currentPage = pageFolder;
            window.loadPage = loadPage;

        } catch (error) {
            console.error("❌ Lỗi khi tải trang:", error);
            document.getElementById("content").innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
        }
    }

    // expose globally (in case above didn't run)
    window.loadPage = window.loadPage || loadPage;


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

    window.addEventListener('storage', (e) => {
        if (e.key === 'activeLogin') {
            window.updateAuthUI();
        }
    });
});

//handle login button

// =============================== MENU USER ==========================
function initUserMenu(loadPage) {
    const userIcon = document.getElementById("userIcon");
    const userOverlay = document.getElementById("userOverlay");
    const userMenu = document.querySelector(".user-menu");
    const logoutBtn = document.getElementById("logoutBtn");

    // 🧩 Thêm nút Edit vào menu người dùng
    if (userMenu && !document.getElementById("editBtn")) {
        const editBtn = document.createElement("button");
        editBtn.id = "editBtn";
        editBtn.textContent = "Edit";
        editBtn.style.background = "#d62828";
        editBtn.style.color = "#fff";
        editBtn.style.border = "none";
        editBtn.style.padding = "8px 16px";
        editBtn.style.margin = "10px auto";
        editBtn.style.borderRadius = "8px";
        editBtn.style.display = "block";
        editBtn.style.cursor = "pointer";
        editBtn.style.width = "80%";
        userMenu.appendChild(editBtn);
    }


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
        localStorage.setItem('activeLogin', '1');
        alert("Đã đăng xuất!");
        userOverlay.classList.remove("active");
        userMenu.classList.remove("active");
        window.updateAuthUI();
    });
}
// Edit button behavior
document.addEventListener('click', (e) => {
    if (e.target.closest('#editBtn')) {
        const page = window.currentPage || 'HOME';
        if (page === 'PRODUCT' || page === 'NEWS') {
            // bật/tắt chế độ edit bằng class trên #content
            const contentEl = document.getElementById('content');
            contentEl.classList.toggle('edit-mode');
            alert('Chế độ chỉnh sửa: ' + (contentEl.classList.contains('edit-mode') ? 'BẬT' : 'TẮT'));
            // pages PRODUCT/NEWS cần lắng nghe class edit-mode để hiển thị UI thêm/xóa/sửa
        } else {
            alert('Chức năng này không áp dụng cho trang này.');
        }
    }
});

