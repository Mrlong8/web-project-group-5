const HomePage = {
    init() {
        /* ==================== SLIDE SHOW ==================== */
        const slides = document.querySelectorAll(".banner-slide");
        const dotsContainer = document.getElementById("bannerDots");
        const prevBtn = document.getElementById("btnPrev");
        const nextBtn = document.getElementById("btnNext");

        if (slides.length) {
            let current = 0;
            let autoTimer;

            slides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.className = "banner-dot" + (i === 0 ? " active" : "");
                dot.addEventListener("click", () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll(".banner-dot");

            function showSlide(i) {
                slides.forEach((slide, idx) => {
                    slide.style.opacity = idx === i ? "1" : "0";
                    slide.style.transition = "opacity 1s ease-in-out";
                });
                dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
            }

            function goToSlide(i) {
                current = (i + slides.length) % slides.length;
                showSlide(current);
                resetAuto();
            }

            function nextSlide() { goToSlide(current + 1); }
            function prevSlide() { goToSlide(current - 1); }

            function autoPlay() { autoTimer = setInterval(nextSlide, 3000); }
            function resetAuto() { clearInterval(autoTimer); autoPlay(); }

            nextBtn?.addEventListener("click", nextSlide);
            prevBtn?.addEventListener("click", prevSlide);
            showSlide(current);
            autoPlay();
        }

        /* ==================== HÀNH VI NÚT CHUYỂN TRANG ==================== */
        function triggerMenuPage(path) {
            const link = document.querySelector(`.menu-head a[data-page="${path}"]`);
            if (link) link.click();
            else if (typeof window.loadPage === "function") window.loadPage(path);
            else window.location.href = path;
        }

        document.querySelector(".discover-home")?.addEventListener("click", e => {
            e.preventDefault();
            triggerMenuPage("./PRODUCT/product.html");
        });

        document.querySelectorAll(".home-service-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                triggerMenuPage("./CONTACT/contact.html");
            });
        });

        document.querySelector(".home-news-more-btn")?.addEventListener("click", e => {
            e.preventDefault();
            triggerMenuPage("./NEWS/news.html");
        });

        // Nút trên banner -> lướt xuống dịch vụ
        document.querySelectorAll(".banner-overlay .cta").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                document.querySelector(".home-service-section")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });

        /* ==================== 3 XE QUẢNG CÁO ==================== */
        const cars = document.querySelectorAll("#introCar img");
        cars.forEach(car => {
            car.addEventListener("mouseenter", () => {
                cars.forEach(c => c.classList.remove("active", "dim"));
                car.classList.add("active");
                cars.forEach(c => { if (c !== car) c.classList.add("dim"); });
            });
            car.addEventListener("mouseleave", () => {
                cars.forEach(c => c.classList.remove("active", "dim"));
            });
        });

        /* ==================== FORM LÁI THỬ ==================== */
        const testForm = document.getElementById("testDriveForm");
        if (testForm) {
            testForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = testForm.querySelector("#name").value.trim();
                const phone = testForm.querySelector("#phone").value.trim();
                const car = testForm.querySelector("#car").value;

                if (!name || !phone || !car) {
                    alert("⚠️ Vui lòng điền đầy đủ thông tin trước khi gửi!");
                    return;
                }

                alert("✅ Cảm ơn bạn đã đăng ký lái thử! Chúng tôi sẽ liên hệ sớm nhất.");
                testForm.reset();
            });
        }

        console.log("✅ HomePage initialized successfully");
    }
};

window.HomePage = HomePage;
