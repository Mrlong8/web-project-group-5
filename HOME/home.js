const HomePage = {
    init() {
        this.initSlideshow();
        this.initIntroCar();
        this.initScrollToNews();
        console.log("✅ HomePage.init() loaded");
    },

    // =============================== SLIDESHOW & INTRO ==========================
    initSlideshow() {
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
    },

    initIntroCar() {
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
    },

    initScrollToNews() {
        const btns = document.querySelectorAll(".cta");
        const news = document.querySelector(".title-news");
        btns.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                news?.scrollIntoView({ behavior: "smooth" });
            });
        });
    }
};
