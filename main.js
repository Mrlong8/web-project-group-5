// =============================== CHUYỂN TAB ==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;
        } catch (error) {
            console.error("Lỗi khi tải trang:", error);
            content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
        }
    }

    if (!content.innerHTML.trim()) loadPage("./HOME/home.html");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadPage(link.dataset.page);
        });
    });

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
