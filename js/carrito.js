const cartItemsEl = document.getElementById("cart-items");
const cartSummaryEl = document.getElementById("cart-summary");
const btnCheckout = document.getElementById("btnCheckout");
const btnClear = document.getElementById("btnClear");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const ENVIO = 50000;
const IMPUESTO = 0.05;

// Toast
function toast(msg, type = "info") {
  const bg = type === "error"
    ? "linear-gradient(to right, #ff5f6d, #ffc371)"
    : "linear-gradient(to right, #f39c12, #f39c12)";

  Toastify({
    text: msg,
    duration: 1600,
    gravity: "top",
    position: "right",
    style: { background: bg, color: "#111", fontWeight: "600" }
  }).showToast();
}

// === Renderizar carrito ===
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (carrito.length === 0) {
    cartItemsEl.innerHTML = "<p>El carrito está vacío.</p>";
    cartSummaryEl.innerHTML = "";
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="left">
        <img src="${item.img}" alt="${item.nombre}">
        <div>
          <div class="name">${item.nombre}</div>
          <div class="qty">
            Cantidad: ${item.cantidad}
            <button class="qty-btn" data-action="restar" data-index="${index}">−</button>
            <button class="qty-btn" data-action="sumar" data-index="${index}">+</button>
          </div>
        </div>
      </div>
      <div>
        <div class="price">$${(item.precio * item.cantidad).toLocaleString()}</div>
        <button class="btn-ghost" data-index="${index}">Eliminar</button>
      </div>
    `;

    cartItemsEl.appendChild(div);
  });

  // Botones de eliminar y modificar cantidad
  document.querySelectorAll(".btn-ghost").forEach((btn) =>
    btn.addEventListener("click", (e) => removeItem(e.target.dataset.index))
  );

  document.querySelectorAll(".qty-btn").forEach((btn) =>
    btn.addEventListener("click", (e) =>
      modificarCantidad(e.target.dataset.index, e.target.dataset.action)
    )
  );

  calcularTotales();
}

// === Sumar / Restar cantidad ===
function modificarCantidad(index, action) {
  if (action === "sumar") carrito[index].cantidad++;
  if (action === "restar" && carrito[index].cantidad > 1) carrito[index].cantidad--;

  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCart();
  toast("Cantidad actualizada");
}

// === Eliminar producto (sin preguntar) ===
function removeItem(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCart();
  toast("🗑️ Producto eliminado");
}

// === Calcular totales ===
function calcularTotales() {
  const subtotal = carrito.reduce((_sum, p) => _sum + p.precio * p.cantidad, 0);
  const exportFee = Math.round(subtotal * IMPUESTO);
  const extra = carrito.length === 1 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + exportFee + extra + ENVIO;

  const ticket = {
    carrito,
    subtotal,
    exportFee,
    extra,
    envio: ENVIO,
    total,
    fecha: new Date().toLocaleString(),
  };

  localStorage.setItem("ticket", JSON.stringify(ticket));

  cartSummaryEl.innerHTML = `
    <p>Subtotal: $${subtotal.toLocaleString()}</p>
    <p>Impuesto 5%: $${exportFee.toLocaleString()}</p>
    <p>Recargos: $${extra.toLocaleString()}</p>
    <p>Envío: $${ENVIO.toLocaleString()}</p>
    <h3>Total: $${total.toLocaleString()}</h3>
  `;
}

// Vaciar carrito
btnClear?.addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCart();
  toast("Carrito vaciado ✅");
});

// Ir al ticket
btnCheckout?.addEventListener("click", () => {
  if (!carrito.length) return toast("Carrito vacío", "error");
  window.location.href = "ticket.html";
});

renderCart();
