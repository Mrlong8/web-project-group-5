// ===============================ĐIỀU CHỈNH CHUYỂN TAB==========================
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const links = document.querySelectorAll(".menu-head a");

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            content.innerHTML = html;

            if (url.includes("home.html")) {
                // initPagination();
                initSlideshow();
                initIntroCar()
            }

            if (url.includes("product.html")) {
                initMainCar();
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
function initMainCar() {
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

// ============================PRODUCT=======================
function initIntroCar() {
    const container = document.getElementById("introCar");
    if (!container) return;

    const imgs = Array.from(container.querySelectorAll("img"));
    const prevBtn = document.getElementById("introPrev");
    const nextBtn = document.getElementById("introNext");
    if (!imgs.length) return;

    // PRELOAD hover images (tránh delay khi đổi)
    const hoverCache = {};
    imgs.forEach(img => {
        const hoverSrc = img.dataset.hover;
        if (hoverSrc) {
            const im = new Image();
            im.src = hoverSrc;
            hoverCache[hoverSrc] = im;
        }
    });

    let current = 0;
    const total = imgs.length;
    let interval = null;
    const AUTO_MS = 3000;

    // init classes
    imgs.forEach((i) => { i.classList.remove("active", "hovered"); i.style.opacity = ""; });
    imgs[current].classList.add("active");

    function showImage(index) {
        if (index === current) return;
        imgs[current].classList.remove("active", "hovered");
        imgs[index].classList.add("active");
        current = index;
    }

    function nextImage() { showImage((current + 1) % total); }
    function prevImage() { showImage((current - 1 + total) % total); }

    function startAuto() {
        stopAuto();
        interval = setInterval(nextImage, AUTO_MS);
    }
    function stopAuto() {
        if (interval) { clearInterval(interval); interval = null; }
    }

    // navigation
    if (nextBtn) nextBtn.addEventListener("click", () => { nextImage(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevImage(); startAuto(); });

    // HOVER: swap to hover image FAST (preloaded) and add hovered class
    imgs.forEach((img, idx) => {
        const baseSrc = img.getAttribute("src");
        const hoverSrc = img.dataset.hover;

        img.addEventListener("mouseenter", () => {
            stopAuto();
            // nếu hoverSrc tồn tại và đã preload thì đổi src ngay
            if (hoverSrc && hoverCache[hoverSrc] && hoverCache[hoverSrc].complete) {
                img.setAttribute("src", hoverSrc);
            } else if (hoverSrc) {
                // nếu chưa preload hoàn toàn, tạo image tạm để load nhanh và swap khi xong
                const tmp = new Image();
                tmp.onload = () => { img.setAttribute("src", hoverSrc); };
                tmp.src = hoverSrc;
            }
            // phóng to
            img.classList.add("hovered");
            // đồng bộ nếu rê chuột vào ảnh không phải ảnh active => chọn làm active
            showImage(idx);
        });

        img.addEventListener("mouseleave", () => {
            // trả ảnh về bản gốc (chỉ nếu data-hover tồn tại)
            if (hoverSrc) {
                // trả về bản base (tránh lấy src trước khi base biết)
                img.setAttribute("src", baseSrc);
            }
            img.classList.remove("hovered");
            startAuto();
        });
    });

    // Khi thay ảnh tự động, đảm bảo ảnh mới có src base (nếu trước đó đã hover đổi src)
    // Vì khi tự chuyển, chúng ta muốn show bản base (không phải "y" nếu đã hover)
    // Do đó, trước khi showImage, reset src của target thành base nếu cần
    const baseSrcs = imgs.map(img => img.getAttribute("src")); // WARNING: if you changed src attr, this captures current src; so better store initial bases:
    // Let's store original base srcs at init:
    const originalBases = imgs.map(img => img.dataset.originalBase || img.getAttribute("src"));
    // Ensure original stored
    imgs.forEach((img, i) => { img.dataset.originalBase = originalBases[i]; });

    // modify showImage to ensure base src
    function showImage(index) {
        if (index === current) return;
        // ensure previous returns to base
        const prevImg = imgs[current];
        const prevBase = prevImg.dataset.originalBase;
        if (prevBase) prevImg.setAttribute("src", prevBase);
        prevImg.classList.remove("active", "hovered");

        const nextImg = imgs[index];
        const nextBase = nextImg.dataset.originalBase;
        if (nextBase) nextImg.setAttribute("src", nextBase);
        nextImg.classList.add("active");
        current = index;
    }

    // start auto
    startAuto();

    // pause auto when mouse enters whole container (not just image)
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
}
