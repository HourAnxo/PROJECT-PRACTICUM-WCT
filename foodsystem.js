
    // ── Cart State ──
    let cart = [];

    // ── Auth State ──
    function checkAuth() {
      const user = localStorage.getItem("loggedInUser");
      const area = document.getElementById("authArea");
      if (user) {
        area.innerHTML = `
          <span style="color:#94a3b8;font-size:13px;margin-left:10px;">👤 ${user}</span>
          <button class="logout-btn" onclick="logout()">Logout</button>`;
      } else {
        area.innerHTML = `<a class="login-btn" href="login.html">Login</a>`;
      }
    }

    function logout() {
      localStorage.removeItem("loggedInUser");
      checkAuth();
      showToast("Logged out successfully.");
    }

    // ── Add to Cart ──
    function addToCart(btn, name, price, img) {
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("added");
      }, 1500);
      updateCartUI();
      showToast(`${name} added to cart!`);
    }

    function updateCartUI() {
      const badge = document.getElementById("cartBadge");
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const count = cart.reduce((s, i) => s + i.qty, 0);
      badge.textContent = count;
      document.getElementById("cartTotal").textContent = "$" + total.toLocaleString();
      renderCartItems();
    }

    function renderCartItems() {
      const container = document.getElementById("cartItems");
      if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
        return;
      }
      container.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60'">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>$${item.price} each</p>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem(${idx})" title="Remove">✕</button>
        </div>
      `).join('');
    }

    function changeQty(idx, delta) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      updateCartUI();
    }

    function removeItem(idx) {
      const name = cart[idx].name;
      cart.splice(idx, 1);
      updateCartUI();
      showToast(`${name} removed from cart.`);
    }

    // ── Cart Sidebar ──
    function openCart() {
      document.getElementById("cartSidebar").classList.add("open");
      document.getElementById("cartOverlay").classList.add("open");
    }

    function closeCart() {
      document.getElementById("cartSidebar").classList.remove("open");
      document.getElementById("cartOverlay").classList.remove("open");
    }

    // ── Checkout ──
    function checkout() {
      const user = localStorage.getItem("loggedInUser");
      if (!user) {
        showToast("⚠️ Please login first to checkout!");
        setTimeout(() => window.location.href = "login.html", 1500);
        return;
      }
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      alert(`✅ Order placed!\nTotal: $${total.toLocaleString()}\nThank you, ${user}!`);
      cart = [];
      updateCartUI();
      closeCart();
    }

    // ── Toast ──
    function showToast(msg) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 2500);
    }

    // ── Track Order ──
    function trackOrder() {
      const num = document.getElementById("trackingInput").value;
      const result = document.getElementById("trackingResult");
      if (!num) {
        result.innerHTML = "Please enter a tracking number.";
        result.style.color = "red";
      } else {
        result.innerHTML = "Order #" + num + " is Out for Delivery. 🚚";
        result.style.color = "green";
      }
    }

    
  // Init
window.onload = function () {
  checkAuth();
};
