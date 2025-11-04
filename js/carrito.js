const cartItemsEl = document.getElementById("cart-items");
const cartSummaryEl = document.getElementById("cart-summary");
const btnCheckout = document.getElementById("btnCheckout");
const btnClear = document.getElementById("btnClear");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const ENVIO = 50000;
const IMPUESTO = 0.05;


function toast(msg, type = "info") {
  const bg = type === "error"
    ? "linear-gradient(to right, #ff5f6d, #ffc371)"
    : "linear-gradient(to right, #f39c12, #f39c12)";

  Toastify({
    text: msg,
    duration: 1600,
    gravity: "top",
    position: "right",
    style: { background: bg, color: "#111", fontWeight: "700" }
  }).showToast();
}


function renderCart() {
  cartItemsEl.innerHTML = "";

  if (!carrito.length) {
    cartItemsEl.innerHTML = "<p>El carrito está vacío.</p>";
    cartSummaryEl.innerHTML = "";
    return;
  }

  carrito.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="left">
        <img src="${item.img}" alt="${item.nombre}">
        <div>
          <div class="name">${item.nombre}</div>
          <div class="qty">
            Cantidad: ${item.cantidad}
            <button class="qty-btn" data-action="restar" data-idx="${idx}">−</button>
            <button class="qty-btn" data-action="sumar" data-idx="${idx}">+</button>
          </div>
        </div>
      </div>
      <div>
        <div class="price">$${(item.precio * item.cantidad).toLocaleString()}</div>
        <div style="margin-top:8px; text-align:right;">
          <button class="btn-ghost" data-idx="${idx}">Eliminar</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

 
  document.querySelectorAll(".btn-ghost[data-idx]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = parseInt(e.target.dataset.idx);
      removeItem(i);
    });
  });

  
  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = parseInt(e.target.dataset.idx);
      const action = e.target.dataset.action;
      modificarCantidad(i, action);
    });
  });

  calcularYMostrar();
}

function modificarCantidad(index, action) {
  if (action === "sumar") carrito[index].cantidad++;
  if (action === "restar" && carrito[index].cantidad > 1) carrito[index].cantidad--;

  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCart();
  toast("Cantidad actualizada ✅");
}


function removeItem(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCart();
  toast("🗑️ Producto eliminado");
}


function calcularYMostrar() {
  const subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
  const exportFee = Math.round(subtotal * IMPUESTO);

  let extra = 0;
  const tipos = carrito.length;
  const unidades = carrito.reduce((s, p) => s + p.cantidad, 0);

  if (tipos === 1) extra += Math.round(subtotal * 0.05);
  if (unidades > 3) extra += Math.round(subtotal * 0.05);

  const total = subtotal + exportFee + extra + ENVIO;

  const ticket = {
    carrito,
    subtotal,
    exportFee,
    extra,
    envio: ENVIO,
    total,
    fecha: new Date().toLocaleString()
  };
  localStorage.setItem("ticket", JSON.stringify(ticket));

  cartSummaryEl.innerHTML = `
    <div>
      <p>Subtotal: $${subtotal.toLocaleString()}</p>
      <p>Comisión exportación (5%): $${exportFee.toLocaleString()}</p>
      <p>Recargos: $${extra.toLocaleString()}</p>
      <p>Envío: $${ENVIO.toLocaleString()}</p>
      <h3>Total: $${total.toLocaleString()}</h3>
    </div>
  `;
}


if (btnClear) {
  btnClear.addEventListener("click", () => {
    if (!confirm("¿Vaciar carrito?")) return;
    carrito = [];
    localStorage.removeItem("carrito");
    renderCart();
    toast("Carrito vaciado ✅", "ok");
  });
}


if (btnCheckout) {
  btnCheckout.addEventListener("click", () => {
    if (!carrito.length) {
      toast("Carrito vacío", "error");
      return;
    }
    window.location.href = "ticket.html";
  });
}

renderCart();
