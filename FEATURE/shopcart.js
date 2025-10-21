window.ShopCartPage = {
    init() {
        const list = document.getElementById("cartList");
        const totalEl = document.getElementById("totalPrice");
        const buyNowBtn = document.getElementById("buyNowBtn");

        if (!list || !totalEl) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        list.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            list.innerHTML = "<p style='text-align:center;'>🛒 Giỏ hàng trống!</p>";
            totalEl.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
        <img src="${item.img}" alt="">
        <div class="cart-info">
          <h2>${item.name}</h2>
          <p>${item.price.toLocaleString()} VND</p>
          <button class="delete-btn" data-index="${index}">Xóa</button>
        </div>
      `;
            list.appendChild(div);
            total += item.price;
        });

        totalEl.textContent = total.toLocaleString();

        // Xóa sản phẩm
        list.addEventListener("click", e => {
            if (e.target.classList.contains("delete-btn")) {
                const idx = e.target.dataset.index;
                cart.splice(idx, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                alert("🗑️ Đã xóa sản phẩm khỏi giỏ hàng!");
                ShopCartPage.init(); // refresh lại danh sách
            }
        });

        // Mua ngay
        buyNowBtn.addEventListener("click", () => {
            alert("🛒 Hãy chọn xe để mua tại trang PRODUCT!");
            if (typeof window.loadPage === "function") {
                window.loadPage("./PRODUCT/product.html");
            } else {
                window.location.href = "../PRODUCT/product.html";
            }
        });

    }
};
