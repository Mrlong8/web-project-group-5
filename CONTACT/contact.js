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

document.addEventListener("DOMContentLoaded", () => {
    testCar();
    conTact();
});