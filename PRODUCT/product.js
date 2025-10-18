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

// function initCarFeatures() {
//     const cars = document.querySelectorAll(".car");
//     const modal = document.getElementById("carDetailModal");

//     if (!cars.length || !modal) return; // nếu không có xe hoặc modal, thoát luôn

//     const closeBtn = modal.querySelector(".modal-close");
//     const compareBtn = document.getElementById("compareBtn");
//     const testDriveBtn = modal.querySelector(".test-drive");
//     const addCartBtn = document.getElementById("addCartBtn");
//     let selectedCars = [];

//     // 1️⃣ Click vào xe -> mở modal
//     cars.forEach(car => {
//         car.addEventListener("click", () => {
//             const imgSrc = car.querySelector("img")?.src || "";
//             const name = car.querySelector(".name-car")?.textContent || "";
//             const brand = car.dataset.brand || "";
//             const price = parseInt(car.dataset.price) || 0;
//             const info = car.querySelector(".information")?.textContent || "";

//             const details = {
//                 engine: info,
//                 year: "2024",
//                 gear: "Tự động 6 cấp",
//                 color: "Trắng / Đen / Đỏ"
//             };

//             document.getElementById("carDetailImg").src = imgSrc;
//             document.getElementById("carName").textContent = name;
//             document.getElementById("carBrand").textContent = brand;
//             document.getElementById("carEngine").textContent = details.engine;
//             document.getElementById("carPrice").textContent = price.toLocaleString("vi-VN") + " VND";
//             document.getElementById("carYear").textContent = details.year;
//             document.getElementById("carGear").textContent = details.gear;
//             document.getElementById("carColor").textContent = details.color;

//             modal.dataset.currentCar = JSON.stringify({ imgSrc, name, brand, price, ...details });
//             modal.classList.remove("hidden");
//         });
//     });

//     // 2️⃣ Đóng modal
//     closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
//     modal.addEventListener("click", e => {
//         if (e.target === modal) modal.classList.add("hidden");
//     });

//     // 3️⃣ Đăng ký lái thử
//     testDriveBtn?.addEventListener("click", e => {
//         e.preventDefault();
//         if (typeof loadPage === "function") loadPage("./CONTACT/contact.html");
//         modal.classList.add("hidden");
//     });

//     // 4️⃣ So sánh xe
//     compareBtn?.addEventListener("click", () => {
//         const currentCar = JSON.parse(modal.dataset.currentCar || null);
//         if (!currentCar) return;

//         selectedCars.push(currentCar);
//         alert(`✅ Đã chọn xe: ${currentCar.name}`);

//         if (selectedCars.length === 2) {
//             showComparePopup(selectedCars);
//             selectedCars = [];
//         }
//     });

//     function showComparePopup(cars) {
//         const popup = document.createElement("div");
//         popup.classList.add("modal");
//         popup.innerHTML = `
//             <div class="modal-content">
//                 <span class="modal-close">&times;</span>
//                 <h2 style="text-align:center;">So sánh xe</h2>
//                 <div class="compare-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
//                     ${cars.map(c => `
//                         <div class="compare-item" style="border:1px solid #ccc;padding:10px;border-radius:8px;">
//                             <img src="${c.imgSrc}" style="width:100%;height:auto;">
//                             <h3>${c.name}</h3>
//                             <p><strong>Hãng:</strong> ${c.brand}</p>
//                             <p><strong>Động cơ:</strong> ${c.engine}</p>
//                             <p><strong>Giá:</strong> ${c.price.toLocaleString("vi-VN")} VND</p>
//                             <p><strong>Năm:</strong> ${c.year}</p>
//                             <p><strong>Hộp số:</strong> ${c.gear}</p>
//                             <p><strong>Màu:</strong> ${c.color}</p>
//                         </div>
//                     `).join("")}
//                 </div>
//             </div>
//         `;
//         document.body.appendChild(popup);

//         const close = popup.querySelector(".modal-close");
//         close?.addEventListener("click", () => popup.remove());
//         popup.addEventListener("click", e => {
//             if (e.target === popup) popup.remove();
//         });
//     }

//     // 5️⃣ Thêm vào giỏ hàng
//     addCartBtn?.addEventListener("click", () => {
//         const currentCar = JSON.parse(modal.dataset.currentCar || null);
//         if (!currentCar) return;

//         const cart = JSON.parse(localStorage.getItem("cart")) || [];
//         cart.push(currentCar);
//         localStorage.setItem("cart", JSON.stringify(cart));
//         alert(`✅ Đã thêm "${currentCar.name}" vào giỏ hàng!`);
//     });

//     console.log("✅ initCarFeatures đã chạy!");
// }


document.addEventListener("DOMContentLoaded", () => {
    initMainCarV1();
    // initCarFeatures();
});