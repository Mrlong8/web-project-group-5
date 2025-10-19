const ProductPage = {
    init() {
        const carsContainer = document.querySelector(".list-car");
        if (!carsContainer) return;

        const cars = Array.from(carsContainer.querySelectorAll(".car"));
        const searchInput = document.querySelector(".search-car");
        const brandLinks = document.querySelectorAll(".brand-filter a");
        const btnAsc = document.getElementById("sortAsc");
        const btnDesc = document.getElementById("sortDesc");

        const modal = document.getElementById("carDetailModal");
        const closeModal = modal.querySelector(".modal-close");
        const imgDetail = document.getElementById("carDetailImg");
        const nameDetail = document.getElementById("carName");
        const brandDetail = document.getElementById("carBrand");
        const engineDetail = document.getElementById("carEngine");
        const priceDetail = document.getElementById("carPrice");
        const yearDetail = document.getElementById("carYear");
        const gearDetail = document.getElementById("carGear");
        const colorDetail = document.getElementById("carColor");
        const btnBuy = modal.querySelector(".test-drive");
        const btnCart = modal.querySelector(".add-cart");
        const editControls = document.querySelector(".edit-controls");

        let filteredCars = [...cars];
        let currentBrand = "all";
        let currentCar = null;

        // ==================== Hiển thị danh sách ====================
        function renderCars(list) {
            carsContainer.innerHTML = "";
            list.forEach(car => carsContainer.appendChild(car));
            attachViewMoreEvents();
        }

        function attachViewMoreEvents() {
            carsContainer.querySelectorAll(".view-more").forEach(btn => {
                btn.onclick = e => {
                    const car = e.target.closest(".car");
                    openModal(car);
                };
            });
        }

        // ==================== Lọc - Tìm kiếm ====================
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

        // ==================== Sắp xếp ====================
        function sortCars(order = "asc") {
            filteredCars.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                return order === "asc" ? priceA - priceB : priceB - priceA;
            });
            renderCars(filteredCars);
        }

        // ==================== Modal ====================
        function openModal(car) {
            modal.classList.remove("hidden");
            currentCar = car;

            imgDetail.src = car.querySelector("img").src;
            nameDetail.textContent = car.querySelector(".name-car").textContent;
            brandDetail.textContent = car.dataset.brand;
            engineDetail.textContent = car.querySelector(".information").textContent;
            priceDetail.textContent = car.querySelector(".price").textContent;
            yearDetail.textContent = "2024";
            gearDetail.textContent = "Tự động";
            colorDetail.textContent = "Đỏ";
        }

        function closeModalFn() {
            modal.classList.add("hidden");
        }

        // ==================== Event ====================
        closeModal.addEventListener("click", closeModalFn);
        modal.addEventListener("click", e => { if (e.target === modal) closeModalFn(); });
        btnBuy.addEventListener("click", () => {
            if (!currentCar) return;
            const data = getCarData(currentCar);
            localStorage.setItem("selectedCar", JSON.stringify(data));
            window.location.href = "../FEATURE/buy.html";
        });

        btnCart.addEventListener("click", () => {
            if (!currentCar) return;
            const data = getCarData(currentCar);
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(data);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("✅ Đã thêm vào giỏ hàng!");
        });

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
        attachViewMoreEvents();

        // ==================== Theo dõi Edit Mode ====================
        const observer = new MutationObserver(() => {
            if (document.getElementById("content").classList.contains("edit-mode"))
                editControls.classList.remove("hidden");
            else editControls.classList.add("hidden");
        });
        observer.observe(document.getElementById("content"), { attributes: true, attributeFilter: ["class"] });

        console.log("✅ ProductPage.init() loaded");
    }
};

function getCarData(car) {
    return {
        name: car.querySelector(".name-car").textContent,
        brand: car.dataset.brand,
        price: parseInt(car.dataset.price),
        img: car.querySelector("img").src,
        info: car.querySelector(".information").textContent,
        year: "2024",
        gear: "Tự động",
        color: "Đỏ"
    };
}

// ====== CHẾ ĐỘ EDIT (THÊM / SỬA / XÓA) ======
function initEditMode() {
    const carsContainer = document.querySelector(".list-car");
    if (!carsContainer) return;

    // Nút thêm xe khi bật edit
    let addBtn = document.querySelector(".add-car-btn");
    if (!addBtn) {
        addBtn = document.createElement("button");
        addBtn.className = "add-car-btn";
        addBtn.textContent = "➕ Thêm xe mới";
        carsContainer.before(addBtn);
    }

    function refreshEditButtons() {
        document.querySelectorAll(".car").forEach(car => {
            let controls = car.querySelector(".edit-controls");
            if (!controls) {
                controls = document.createElement("div");
                controls.className = "edit-controls";
                controls.innerHTML = `
          <button class="edit-btn edit-car">Sửa</button>
          <button class="edit-btn delete-car">Xóa</button>
        `;
                car.appendChild(controls);
            }
        });
    }

    refreshEditButtons();

    // ===== XỬ LÝ SỰ KIỆN =====
    addBtn.addEventListener("click", () => {
        const name = prompt("Tên xe:");
        const brand = prompt("Hãng xe:");
        const price = prompt("Giá (VND):");
        const info = prompt("Thông tin động cơ:");

        if (!name || !brand || !price) return alert("Thiếu thông tin!");

        const car = document.createElement("div");
        car.className = "car";
        car.dataset.brand = brand;
        car.dataset.price = price;
        car.innerHTML = `
      <img class="img-car" src="IMG/xe1.png" alt="">
      <h1 class="name-car">${name}</h1>
      <h2 class="price">${parseInt(price).toLocaleString()} VND</h2>
      <p class="information">${info}</p>
      <div class="edit-controls">
        <button class="edit-btn edit-car">Sửa</button>
        <button class="edit-btn delete-car">Xóa</button>
      </div>
    `;
        carsContainer.appendChild(car);

        // gắn lại sự kiện click xe
        car.addEventListener("click", () => ProductPage.init());
        alert("✅ Đã thêm xe mới!");
    });

    carsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("delete-car")) {
            e.stopPropagation();
            const car = e.target.closest(".car");
            car.remove();
        }
        if (e.target.classList.contains("edit-car")) {
            e.stopPropagation();
            const car = e.target.closest(".car");
            const newName = prompt("Tên xe:", car.querySelector(".name-car").textContent);
            const newPrice = prompt("Giá mới:", car.dataset.price);
            if (newName) car.querySelector(".name-car").textContent = newName;
            if (newPrice) {
                car.dataset.price = newPrice;
                car.querySelector(".price").textContent = parseInt(newPrice).toLocaleString() + " VND";
            }
        }
    });

    // bật / tắt edit theo class edit-mode trên #content
    const observer = new MutationObserver(() => {
        const content = document.getElementById("content");
        const isEdit = content.classList.contains("edit-mode");
        document.querySelectorAll(".edit-controls").forEach(c => {
            c.style.display = isEdit ? "flex" : "none";
        });
        addBtn.style.display = isEdit ? "block" : "none";
    });
    observer.observe(document.getElementById("content"), { attributes: true });
}
window.ProductPage = ProductPage;
initEditMode();

