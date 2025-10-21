var carsAPI ='http://localhost:3000/cars';

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

        var root = document.querySelector('.list-car');

        function createCarElement(carObj) {
            const carEl = document.createElement('div');
            carEl.className = 'car';
            carEl.dataset.id = carObj.id;
            carEl.dataset.brand = carObj.brand || carObj['data-brand'] || '';
            carEl.dataset.price = carObj.price ?? '';
            carEl.innerHTML = `
                <button type="button" class="car-delete-btn" style="display:none">x</button>
                <img class="img-car" src="${(carObj.img||'').replace(/^(\.\.\/|\.\/)?/, './')}" alt="${carObj.name || ''}">
                <h1 class="name-car">${carObj.name || ''}</h1>
                <h2 class="price">${(parseInt(carObj.price)||0).toLocaleString()} VND</h2>
                <p class="information">${carObj.information || carObj.info || ''}</p>
                <button type="button" class="view-more">Xem thêm</button>
            `;
            return carEl;
        }

        fetch(carsAPI)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                console.log('Cars from API:', data);
                root.innerHTML = ''; // clear trước
                data.forEach(car => {
                    const el = createCarElement(car);
                    root.appendChild(el);
                });
                // cập nhật biến cars nếu cần
                cars = Array.from(root.querySelectorAll('.car'));
                attachViewMoreEvents();
            })
            .catch(function(error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            });

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

            // ========== THÊM XE ==========
            addBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                 e.stopPropagation();
                const name = prompt("Tên xe:");
                const brand = prompt("Hãng xe:");
                const price = prompt("Giá (VND):");
                const info = prompt("Thông tin động cơ:");
                const img = prompt("Link ảnh (VD: IMG/xe1.png):", "IMG/xe1.png");

                if (!name || !brand || !price) return alert("⚠️ Thiếu thông tin!");

                try {
                    const res = await fetch(carsAPI);
                    const data = await res.json();
                    const maxId = data.length > 0 ? Math.max(...data.map(c => +c.id || 0)) : 0;

                    const newCar = {
                        id: maxId + 1,
                        name,
                        brand,
                        price: parseInt(price),
                        info,
                        img
                    };

                    const postRes = await fetch(carsAPI, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newCar)
                    });
                    if (!postRes.ok) throw new Error("POST lỗi!");

                    // 👉 Thêm trực tiếp vào DOM
                    const carEl = document.createElement("div");
                    carEl.className = "car";
                    carEl.dataset.id = newCar.id;
                    carEl.dataset.brand = newCar.brand;
                    carEl.dataset.price = newCar.price;
                    carEl.innerHTML = `
                        <button class="car-delete-btn">x</button>
                        <img class="img-car" src="${newCar.img}" alt="${newCar.name}">
                        <h1 class="name-car">${newCar.name}</h1>
                        <h2 class="price">${newCar.price.toLocaleString()} VND</h2>
                        <p class="information">${newCar.info}</p>
                        <button class="view-more">Xem thêm</button>
                    `;
                    document.querySelector(".list-car").appendChild(carEl);

                    alert("✅ Đã thêm xe mới!");
                    attachViewMoreEvents(); // cập nhật event
                } catch (err) {
                    console.error(err);
                    alert("❌ Lỗi khi thêm xe!");
                }
            });

            // ========== SỬA XE ==========
            editBtn.addEventListener("click", async () => {
                const carName = prompt("Nhập tên xe bạn muốn sửa:");
                if (!carName) return;

                try {
                    const res = await fetch(carsAPI);
                    const cars = await res.json();
                    const car = cars.find(c => c.name.toLowerCase() === carName.toLowerCase());
                    if (!car) return alert("❌ Không tìm thấy xe!");

                    const newName = prompt("Tên mới:", car.name);
                    const newPrice = prompt("Giá mới:", car.price);
                    const newInfo = prompt("Thông tin động cơ mới:", car.info);
                    const newImg = prompt("Ảnh mới:", car.img);

                    const updatedCar = {
                        ...car,
                        name: newName || car.name,
                        price: parseInt(newPrice) || car.price,
                        info: newInfo || car.info,
                        img: newImg || car.img
                    };

                    const updateRes = await fetch(`${carsAPI}/${car.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedCar)
                    });
                    if (!updateRes.ok) throw new Error("PUT lỗi!");

                    // 👉 Cập nhật trực tiếp trên DOM
                    const carEl = document.querySelector(`.car[data-id="${car.id}"]`);
                    if (carEl) {
                        carEl.querySelector(".name-car").textContent = updatedCar.name;
                        carEl.querySelector(".price").textContent = updatedCar.price.toLocaleString() + " VND";
                        carEl.querySelector(".information").textContent = updatedCar.info;
                        carEl.querySelector("img").src = updatedCar.img;
                    }

                    alert("✏️ Đã sửa xe thành công!");
                } catch (err) {
                    console.error(err);
                    alert("❌ Lỗi khi sửa xe!");
                }
            });

            // ========== XÓA XE ==========
            delBtn.addEventListener("click", (e) => {
                e.preventDefault();
                 e.stopPropagation();
                document.querySelectorAll(".car-delete-btn").forEach(btn => {
                    btn.style.display = "inline-block";
                    btn.onclick = async e => {
                        const car = e.target.closest(".car");
                        const carName = car.querySelector(".name-car").textContent;
                        const carId = car.dataset.id;

                        if (!confirm(`Bạn có chắc muốn xóa xe "${carName}" không?`)) return;

                        try {
                            const res = await fetch(`${carsAPI}/${carId}`, { method: "DELETE" });
                            if (!res.ok) throw new Error("DELETE lỗi!");

                            // 👉 Xóa luôn khỏi DOM
                            car.remove();
                            alert(`🗑️ Đã xóa "${carName}"!`);
                        } catch (err) {
                            console.error(err);
                            alert("❌ Lỗi khi xóa xe!");
                        }
                    };
                });
            });
        }
    }
};

window.getCarData = function(car) {
            if (!car) return null;
            return {
                id: car.dataset.id,
                name: car.querySelector(".name-car")?.textContent || '',
                brand: car.dataset.brand || '',
                price: parseInt(car.dataset.price) || 0,
                img: car.querySelector("img")?.src || '',
                info: car.querySelector(".information")?.textContent || '',
                year: "2024",
                gear: "Tự động",
                color: "Đỏ"
            };
        };

window.ProductPage = ProductPage;
