// =============================== ĐIỀU CHỈNH CHUYỂN TAB ==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // Gọi script tương ứng từng trang
            if (url.includes("home.html")) {
                initSlideshow?.();
                initIntroCar?.();
                initScrollToNews?.();
                testCar?.();
                conTact?.();
            }

            if (url.includes("product.html")) {
                initMainCarV1?.();
                // đợi DOM render xong rồi mới init tính năng sản phẩm
                setTimeout(() => {
                    initCarFeatures?.();
                }, 50);
            }

            if (url.includes("contact.html")) {
                conTact?.();
            }

            if (url.includes("testcar.html")) {
                testCar?.();
            }

        } catch (error) {
            console.error("Lỗi khi tải trang:", error);
            content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
        }
    }

    // Tải trang mặc định
    if (!content.innerHTML.trim()) loadPage("./HOME/home.html");

    // Bắt sự kiện click menu chính
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadPage(link.getAttribute("data-page"));
        });
    });

    // Khởi tạo menu user
    initUserMenu(loadPage);
});


// =============================== MENU USER ==========================
function initUserMenu(loadPage) {
    const userIcon = document.getElementById("userIcon");
    const userOverlay = document.getElementById("userOverlay");
    const userMenu = document.querySelector(".user-menu");
    const logoutBtn = document.getElementById("logoutBtn");
    if (!userIcon || !userOverlay || !userMenu) return;

    // Mở/đóng menu user
    userIcon.addEventListener("click", () => {
        userOverlay.classList.toggle("active");
        userMenu.classList.toggle("active");
    });

    // Đóng khi click ra ngoài
    userOverlay.addEventListener("click", e => {
        if (!e.target.closest(".user-menu") && !e.target.closest("#userIcon")) {
            userOverlay.classList.remove("active");
            userMenu.classList.remove("active");
        }
    });

    // Chuyển trang trong menu user
    userMenu.querySelectorAll("a[data-page]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            loadPage(page);
            userOverlay.classList.remove("active");
            userMenu.classList.remove("active");
        });
    });

    // Logout
    logoutBtn?.addEventListener("click", () => {
        alert("Đã đăng xuất!");
        userOverlay.classList.remove("active");
        userMenu.classList.remove("active");
    });
}


// =============================== DANH SÁCH XE ==========================
function initMainCarV1() {
    const carsContainer = document.querySelector(".list-car");
    if (!carsContainer) return;

    const cars = Array.from(carsContainer.querySelectorAll(".car"));
    const searchInput = document.querySelector(".search-car");
    const brandLinks = document.querySelectorAll(".brand-filter a");
    const btnAsc = document.getElementById("sortAsc");
    const btnDesc = document.getElementById("sortDesc");

    let filteredCars = [...cars];
    let currentBrand = "all";

    function renderCars(list) {
        carsContainer.innerHTML = "";
        list.forEach(car => carsContainer.appendChild(car));
    }

    function filterCars() {
        const searchValue = searchInput?.value.toLowerCase() || "";
        filteredCars = cars.filter(car => {
            const name = car.querySelector(".name-car").textContent.toLowerCase();
            const brand = car.dataset.brand.toLowerCase();
            return (
                (currentBrand === "all" || brand === currentBrand) &&
                name.includes(searchValue)
            );
        });
        renderCars(filteredCars);
    }

    function sortCars(order = "asc") {
        filteredCars.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            return order === "asc" ? priceA - priceB : priceB - priceA;
        });
        renderCars(filteredCars);
    }

    searchInput?.addEventListener("input", filterCars);
    brandLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            brandLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentBrand = link.dataset.brand.toLowerCase();
            filterCars();
        });
    });

    btnAsc?.addEventListener("click", () => sortCars("asc"));
    btnDesc?.addEventListener("click", () => sortCars("desc"));

    filterCars();
}


// =============================== TÍNH NĂNG SẢN PHẨM ==========================

function initCarFeatures() {
    const cars = document.querySelectorAll(".car");
    const modal = document.getElementById("carDetailModal");

    if (!cars.length || !modal) return; // nếu không có xe hoặc modal, thoát luôn

    const closeBtn = modal.querySelector(".modal-close");
    const compareBtn = document.getElementById("compareBtn");
    const testDriveBtn = modal.querySelector(".test-drive");
    const addCartBtn = document.getElementById("addCartBtn");
    let selectedCars = [];

    // 1️⃣ Click vào xe -> mở modal
    cars.forEach(car => {
        car.addEventListener("click", () => {
            const imgSrc = car.querySelector("img")?.src || "";
            const name = car.querySelector(".name-car")?.textContent || "";
            const brand = car.dataset.brand || "";
            const price = parseInt(car.dataset.price) || 0;
            const info = car.querySelector(".information")?.textContent || "";

            const details = {
                engine: info,
                year: "2024",
                gear: "Tự động 6 cấp",
                color: "Trắng / Đen / Đỏ"
            };

            document.getElementById("carDetailImg").src = imgSrc;
            document.getElementById("carName").textContent = name;
            document.getElementById("carBrand").textContent = brand;
            document.getElementById("carEngine").textContent = details.engine;
            document.getElementById("carPrice").textContent = price.toLocaleString("vi-VN") + " VND";
            document.getElementById("carYear").textContent = details.year;
            document.getElementById("carGear").textContent = details.gear;
            document.getElementById("carColor").textContent = details.color;

            modal.dataset.currentCar = JSON.stringify({ imgSrc, name, brand, price, ...details });
            modal.classList.remove("hidden");
        });
    });

    // 2️⃣ Đóng modal
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // 3️⃣ Đăng ký lái thử
    testDriveBtn?.addEventListener("click", e => {
        e.preventDefault();
        if (typeof loadPage === "function") loadPage("./CONTACT/contact.html");
        modal.classList.add("hidden");
    });

    // 4️⃣ So sánh xe
    compareBtn?.addEventListener("click", () => {
        const currentCar = JSON.parse(modal.dataset.currentCar || null);
        if (!currentCar) return;

        selectedCars.push(currentCar);
        alert(`✅ Đã chọn xe: ${currentCar.name}`);

        if (selectedCars.length === 2) {
            showComparePopup(selectedCars);
            selectedCars = [];
        }
    });

    function showComparePopup(cars) {
        const popup = document.createElement("div");
        popup.classList.add("modal");
        popup.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 style="text-align:center;">So sánh xe</h2>
                <div class="compare-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    ${cars.map(c => `
                        <div class="compare-item" style="border:1px solid #ccc;padding:10px;border-radius:8px;">
                            <img src="${c.imgSrc}" style="width:100%;height:auto;">
                            <h3>${c.name}</h3>
                            <p><strong>Hãng:</strong> ${c.brand}</p>
                            <p><strong>Động cơ:</strong> ${c.engine}</p>
                            <p><strong>Giá:</strong> ${c.price.toLocaleString("vi-VN")} VND</p>
                            <p><strong>Năm:</strong> ${c.year}</p>
                            <p><strong>Hộp số:</strong> ${c.gear}</p>
                            <p><strong>Màu:</strong> ${c.color}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        const close = popup.querySelector(".modal-close");
        close?.addEventListener("click", () => popup.remove());
        popup.addEventListener("click", e => {
            if (e.target === popup) popup.remove();
        });
    }

    // 5️⃣ Thêm vào giỏ hàng
    addCartBtn?.addEventListener("click", () => {
        const currentCar = JSON.parse(modal.dataset.currentCar || null);
        if (!currentCar) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(currentCar);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`✅ Đã thêm "${currentCar.name}" vào giỏ hàng!`);
    });

    console.log("✅ initCarFeatures đã chạy!");
}

// =============================== FORM LIÊN HỆ ==========================
function conTact() {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullname = form.querySelector("#fullname")?.value.trim();
        const phone = form.querySelector("#phone")?.value.trim();
        const email = form.querySelector("#email")?.value.trim();
        const message = form.querySelector("#message")?.value.trim();

        if (!fullname || !phone || !email || !message) {
            alert("⚠️ Vui lòng điền đầy đủ thông tin!");
            return;
        }
        alert(`✅ Cảm ơn ${fullname}! Chúng tôi sẽ liên hệ sớm.`);
        form.reset();
    });
}


// =============================== FORM LÁI THỬ ==========================
function testCar() {
    const form = document.getElementById("testDriveForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("#name").value.trim();
        const phone = form.querySelector("#phone").value.trim();
        const car = form.querySelector("#car").value;
        const date = form.querySelector("#date").value;
        if (!name || !phone || !car || !date) {
            alert("⚠️ Vui lòng điền đầy đủ thông tin!");
            return;
        }
        alert(`✅ Cảm ơn ${name} đã đăng ký lái thử xe ${car}!`);
        form.reset();
    });
}


// =============================== SLIDESHOW & INTRO ==========================
function initSlideshow() {
    const track = document.getElementById("bannerTrack");
    if (!track) return;
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("btnPrev");
    const nextBtn = document.getElementById("btnNext");
    let index = 0;

    function showSlide(i) {
        track.style.transform = `translateX(${-i * 100}%)`;
    }

    prevBtn?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });
    nextBtn?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });

    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 4000);
}

function initIntroCar() {
    const cars = document.querySelectorAll(".intro-car img");
    if (!cars.length) return;
    const prev = document.getElementById("introPrev");
    const next = document.getElementById("introNext");
    let index = 0;

    function showCar(i) {
        cars.forEach((img, idx) => img.classList.toggle("active", idx === i));
    }

    prev?.addEventListener("click", () => {
        index = (index - 1 + cars.length) % cars.length;
        showCar(index);
    });
    next?.addEventListener("click", () => {
        index = (index + 1) % cars.length;
        showCar(index);
    });
}

function initScrollToNews() {
    const btns = document.querySelectorAll(".cta");
    const news = document.querySelector(".title-news");
    btns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            news?.scrollIntoView({ behavior: "smooth" });
        });
    });
}
