const ContactPage = {
    init() {
        this.initContactForm();
        this.initTestDriveForm();
        console.log("✅ ContactPage.init() loaded");
    },

    // =============================== FORM LIÊN HỆ ==========================
    initContactForm() {
        const form = document.querySelector("form#contactForm");
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
    },

    // =============================== FORM LÁI THỬ ==========================
    initTestDriveForm() {
        const form = document.getElementById("testDriveForm");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = form.querySelector("#name")?.value.trim();
            const phone = form.querySelector("#phone")?.value.trim();
            const car = form.querySelector("#car")?.value.trim();
            const date = form.querySelector("#date")?.value.trim();

            if (!name || !phone || !car || !date) {
                alert("⚠️ Vui lòng điền đầy đủ thông tin!");
                return;
            }

            alert(`✅ Cảm ơn ${name}! Chúng tôi sẽ sắp xếp lái thử xe ${car} vào ngày ${date}.`);
            form.reset();
        });
    }
};
