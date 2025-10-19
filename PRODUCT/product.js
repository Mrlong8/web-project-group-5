const ProductPage = {
    init() {
        const carsContainer = document.querySelector(".list-car");
        if (!carsContainer) return;

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
        const pageEditControls = document.querySelector(".edit-controls");

        let cars = Array.from(carsContainer.querySelectorAll(".car"));
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
            const isEdit = document.getElementById("content").classList.contains("edit-mode");
            if (isEdit) {
                pageEditControls.classList.remove("hidden");
            } else {
                pageEditControls.classList.add("hidden");
            }
        });
        observer.observe(document.getElementById("content"), { attributes: true, attributeFilter: ["class"] });

        // ==================== Khởi tạo chế độ sửa ====================
        initEditFunctions();

        console.log("✅ ProductPage.init() loaded");

        // ========== Hàm nội bộ cho edit mode ==========
        function initEditFunctions() {
            const addBtn = document.getElementById("addCarBtn");
            const editBtn = document.getElementById("editCarBtn");
            const delBtn = document.getElementById("deleteCarBtn");

            addBtn.addEventListener("click", () => {
                const name = prompt("Tên xe:");
                const brand = prompt("Hãng xe:");
                const price = prompt("Giá (VND):");
                const info = prompt("Thông tin động cơ:");
                if (!name || !brand || !price) return alert("⚠️ Thiếu thông tin!");

                const car = document.createElement("div");
                car.className = "car";
                car.dataset.brand = brand;
                car.dataset.price = price;
                car.innerHTML = `
                    <img class="img-car" src="IMG/xe1.png" alt="${name}">
                    <h1 class="name-car">${name}</h1>
                    <h2 class="price">${parseInt(price).toLocaleString()} VND</h2>
                    <p class="information">${info}</p>
                    <button class="view-more">Xem thêm</button>
                `;
                carsContainer.appendChild(car);

                // cập nhật lại danh sách và sự kiện
                cars.push(car);
                filterCars();
                attachViewMoreEvents();
                alert("✅ Đã thêm xe mới!");
            });

            editBtn.addEventListener("click", () => {
                const carName = prompt("Nhập tên xe bạn muốn sửa:");
                const car = cars.find(c => c.querySelector(".name-car").textContent === carName);
                if (!car) return alert("❌ Không tìm thấy xe!");

                const newName = prompt("Tên mới:", car.querySelector(".name-car").textContent);
                const newPrice = prompt("Giá mới:", car.dataset.price);
                if (newName) car.querySelector(".name-car").textContent = newName;
                if (newPrice) {
                    car.dataset.price = newPrice;
                    car.querySelector(".price").textContent = parseInt(newPrice).toLocaleString() + " VND";
                }
                alert("✏️ Đã sửa xe thành công!");
                filterCars();
            });

            delBtn.addEventListener("click", () => {
                const carName = prompt("Nhập tên xe bạn muốn xóa:");
                const car = cars.find(c => c.querySelector(".name-car").textContent === carName);
                if (!car) return alert("❌ Không tìm thấy xe!");
                car.remove();
                cars = cars.filter(c => c !== car);
                filterCars();
                alert("🗑️ Đã xóa xe!");
            });
        }
    }
};

// Hàm chung để lấy thông tin xe
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

window.ProductPage = ProductPage;
