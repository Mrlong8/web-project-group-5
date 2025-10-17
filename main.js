// ===============================ĐIỀU CHỈNH CHUYỂN TAB==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            // Xử lý sau khi load home
            if (url.includes("home.html")) {
                initSlideshow();
                initIntroCar();
                initScrollToNews();
                testCar();
                conTact();
            }

            // Xử lý sau khi load product
            if (url.includes("product.html")) {
                initMainCar();
                initMainCarV1();
            }



        } catch (error) {
            content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
            console.error("Lỗi khi tải trang:", error);
        }
    }


    // Mặc định load HOME trước
    if (!document.getElementById("content").innerHTML.trim()) {
        loadPage("./HOME/home.html");
    }

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

// ===============================ĐIỀU CHỈNH CHUYỂN TAB==========================
window.loadPage = async function (url) {
    const content = document.getElementById("content");
    try {
        const response = await fetch(url);
        const html = await response.text();
        content.innerHTML = html;

        // Xử lý sau khi load home
        if (url.includes("home.html")) {
            initSlideshow();
            initIntroCar();
            initScrollToNews();
        }

        // Xử lý sau khi load product
        if (url.includes("product.html")) {
            initMainCar();
            initMainCarV1();
        }
    } catch (error) {
        content.innerHTML = `<p style="color:red;">Không tải được trang: ${url}</p>`;
        console.error("Lỗi khi tải trang:", error);
    }
};

//============================== ĐIỀU CHỈNH ẨN HIỆN MENU======================================
$(document).ready(() => {
    const $menu = $(".menu-head ul");
    const $btn = $("#btn");

    // Toggle menu khi click ☰
    $btn.click(() => {
        if (window.innerWidth <= 800) {
            $menu.toggleClass("show");
        }
    });

    // Khi resize lớn hơn 800px -> ẩn menu
    $(window).resize(() => {
        if (window.innerWidth > 800) {
            $menu.removeClass("show");
        }
    });

    // Khi click 1 mục menu -> đóng menu
    $(".menu-head ul li a").click(() => {
        if (window.innerWidth <= 800) {
            $menu.removeClass("show");
        }
    });
});



// ==========================ĐIỀU CHỈNH DANH SÁCH XE ===================
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
        const searchValue = searchInput.value.toLowerCase();
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

    searchInput.addEventListener("input", filterCars);

    brandLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            brandLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            currentBrand = link.dataset.brand.toLowerCase();
            filterCars();
        });
    });

    btnAsc.addEventListener("click", () => sortCars("asc"));
    btnDesc.addEventListener("click", () => sortCars("desc"));

    filterCars();
}


// =====================================Quảng CÁo================================

function initSlideshow() {
    const track = document.getElementById('bannerTrack');
    if (!track) return; // nếu chưa load trang home thì thoát

    const slides = Array.from(track.children);
    const banner = document.getElementById('toyotaBanner');
    const prevBtn = document.getElementById('btnPrev');
    const nextBtn = document.getElementById('btnNext');
    const dotsContainer = document.getElementById('bannerDots');

    const origCount = slides.length;
    const firstClone = slides[0].cloneNode(true);
    firstClone.classList.add('clone');
    track.appendChild(firstClone);

    let currentIndex = 0;
    let isTransitioning = false;
    let interval = null;
    const AUTO_MS = 3000;

    // tạo dots
    dotsContainer.innerHTML = "";
    for (let i = 0; i < origCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'banner-dot' + (i === 0 ? ' active' : '');
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
            resetAuto();
        });
        dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.children);

    function updateDots() {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function setTranslateByIndex(i, animate = true) {
        track.style.transition = animate
            ? 'transform 900ms cubic-bezier(.22,.98,.36,1)'
            : 'none';
        track.style.transform = `translateX(${-i * 100}%)`;
    }

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        setTranslateByIndex(currentIndex, true);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        setTranslateByIndex(currentIndex, true);
    }

    track.addEventListener('transitionend', () => {
        if (currentIndex >= origCount) {
            track.style.transition = 'none';
            currentIndex = 0;
            track.style.transform = `translateX(0%)`;
        } else if (currentIndex < 0) {
            track.style.transition = 'none';
            currentIndex = origCount - 1;
            track.style.transform = `translateX(${-currentIndex * 100}%)`;
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = 'transform 900ms cubic-bezier(.22,.98,.36,1)';
                isTransitioning = false;
            });
        });
        updateDots();
    });

    nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });

    banner.addEventListener('mouseenter', stopAuto);
    banner.addEventListener('mouseleave', startAuto);

    function startAuto() {
        stopAuto();
        interval = setInterval(nextSlide, AUTO_MS);
    }

    function stopAuto() {
        if (interval) clearInterval(interval);
    }

    function resetAuto() {
        stopAuto();
        startAuto();
    }

    setTranslateByIndex(0, false);
    updateDots();
    startAuto();
}

// ===========================ẢNH OTO HOME=======================

// Thêm vào cuối file main.js
function initIntroCar() {
    const cars = document.querySelectorAll('.intro-car img');
    const prev = document.getElementById('introPrev');
    const next = document.getElementById('introNext');
    let index = 0;

    function showCar(i) {
        cars.forEach((img, idx) => {
            img.classList.toggle('active', idx === i);
        });
    }

    prev?.addEventListener('click', () => {
        index = (index - 1 + cars.length) % cars.length;
        showCar(index);
    });

    next?.addEventListener('click', () => {
        index = (index + 1) % cars.length;
        showCar(index);
    });
}




// =====================================tính năng sản phẩm=========================================================
function initMainCar() {
    const cars = document.querySelectorAll(".car");
    const modal = document.getElementById("carDetailModal");
    const closeBtn = modal.querySelector(".modal-close");
    const compareBtn = document.getElementById("compareBtn");
    const testDriveBtn = modal.querySelector(".test-drive");

    let selectedCars = []; // lưu tạm 2 xe để so sánh

    // Gán event click cho từng xe
    cars.forEach(car => {
        car.addEventListener("click", () => {
            const imgSrc = car.querySelector("img").src;
            const name = car.querySelector(".name-car").textContent;
            const brand = car.dataset.brand;
            const price = car.querySelector(".price").textContent;
            const info = car.querySelector(".information").textContent;

            const details = {
                engine: info,
                year: "2024",
                gear: "Tự động 6 cấp",
                color: "Trắng ngọc trai"
            };

            // Gán vào popup
            document.getElementById("carDetailImg").src = imgSrc;
            document.getElementById("carName").textContent = name;
            document.getElementById("carBrand").textContent = brand;
            document.getElementById("carEngine").textContent = details.engine;
            document.getElementById("carPrice").textContent = price;
            document.getElementById("carYear").textContent = details.year;
            document.getElementById("carGear").textContent = details.gear;
            document.getElementById("carColor").textContent = details.color;

            // Lưu dữ liệu hiện tại vào đối tượng để dùng so sánh
            modal.dataset.currentCar = JSON.stringify({
                imgSrc, name, brand, price, info, ...details
            });

            modal.classList.remove("hidden");
        });
    });

    // Đóng modal
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // ==================== Nút đăng ký lái thử ====================
    testDriveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Giống cơ chế chuyển tab đã có
        const content = document.getElementById("content");
        loadPage("./CONTACT/contact.html");
        modal.classList.add("hidden");
    });

    // ==================== Nút so sánh xe ====================
    compareBtn.addEventListener("click", () => {
        const currentCar = JSON.parse(modal.dataset.currentCar);
        if (!currentCar) return;

        // Nếu chưa đủ 2 xe thì thêm vào
        if (selectedCars.length < 2) {
            selectedCars.push(currentCar);
            alert(`Đã chọn xe: ${currentCar.name}`);

            // Nếu đủ 2 xe thì hiển thị popup so sánh
            if (selectedCars.length === 2) {
                showComparePopup(selectedCars);
                selectedCars = []; // reset danh sách
            }
        }
    });

    // ==================== Hàm hiển thị popup so sánh ====================
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
                            <p><strong>Giá:</strong> ${c.price}</p>
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
        close.addEventListener("click", () => popup.remove());
        popup.addEventListener("click", e => {
            if (e.target === popup) popup.remove();
        });
    }
}

// =================================NÚT TRÊN ẢNH =========================
function initScrollToNews() {
    const newsSection = document.querySelector('.title-news');
    if (!newsSection) return; // nếu chưa load thì thôi

    const ctas = document.querySelectorAll('.cta');
    ctas.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // tránh hành vi mặc định
            newsSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ================= CONTACT FORM ==================
function conTact() {
    const form = document.querySelector(".main-col .card form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!fullname || !phone || !email || !message) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc!");
            return;
        }

        alert(`Cảm ơn ${fullname} đã gửi liên hệ!\nChúng tôi sẽ liên hệ bạn sớm.`);
        form.reset();
    });
}

// ================= TEST DRIVE FORM ==================
function testCar() {
    const form = document.getElementById("testDriveForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const car = document.getElementById("car").value;
        const date = document.getElementById("date").value;
        const message = document.getElementById("message").value.trim();

        if (!name || !phone || !car || !date) {
            alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            return;
        }

        alert(`Cảm ơn ${name} đã đăng ký lái thử xe ${car}!\nChúng tôi sẽ liên hệ để xác nhận lịch.`);
        form.reset();
    });
}

// ================= DOM LOAD ==================
document.addEventListener("DOMContentLoaded", () => {
    conTact();
    testCar();
});

