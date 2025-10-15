// ===============================ĐIỀU CHỈNH CHUYỂN TAB==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // ✅ Sau khi nội dung trang được load xong, kiểm tra nếu là home thì khởi tạo phân trang
            if (url.includes("home.html")) {
                initPagination();
            }

        } catch (error) {
            content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
            console.error("Lỗi khi tải trang:", error);
        }
    }


    // Mặc định load HOME trước
    loadPage("./HOME/home.html");

    // Khi click menu
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Xóa class active cũ
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Lấy trang cần load
            const page = link.getAttribute("data-page");
            loadPage(page);
        });
    });
});

//============================== ĐIỀU CHỈNH ẨN HIỆN MENU====================================== 
$(document).ready(() => {
    const $menu = $(".menu-head ul");
    const $btn = $("#btn");

    // Toggle menu khi click nút
    $btn.click(() => {
        if (window.innerWidth <= 800) {
            $menu.toggleClass("show");
        }
    });

    // Khi resize màn hình
    $(window).resize(() => {
        if (window.innerWidth > 800) {
            $menu.removeClass("show"); // xóa class show

        }
    });
});

// ==========================ĐIỀU CHỈNH DANH SÁCH XE ===================
function initPagination() {
    const cars = document.querySelectorAll(".list-car .car");
    const prevBtn = document.querySelector(".prevBtn");
    const nextBtn = document.querySelector(".nextBtn");

    if (cars.length === 0 || !prevBtn || !nextBtn) return;
    // kiểm tra có đủ điều kiện chạy không

    let carsPerPage = window.innerWidth <= 1200 ? 1 : 3;
    let currentPage = 1;
    let totalPages = Math.ceil(cars.length / carsPerPage);

    // hàm hiển thị xe của 1 trang 
    function showPage(page) {
        // Giữ currentPage trong giới hạn
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        cars.forEach(car => car.classList.remove("show-car"));
        const start = (page - 1) * carsPerPage;
        const end = start + carsPerPage;

        for (let i = start; i < end && i < cars.length; i++) {
            cars[i].classList.add("show-car");
        }

        prevBtn.disabled = (page === 1);
        nextBtn.disabled = (page === totalPages);
        currentPage = page;
    }

    function updatePaginationOnResize() {
        const newCarsPerPage = window.innerWidth <= 1200 ? 1 : 3;
        if (newCarsPerPage !== carsPerPage) {
            carsPerPage = newCarsPerPage;
            totalPages = Math.ceil(cars.length / carsPerPage);

            // Giữ currentPage hợp lệ
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            showPage(currentPage);
        }
    }

    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    window.addEventListener("resize", updatePaginationOnResize);

    showPage(currentPage);
}
