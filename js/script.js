const productosContainer = document.getElementById("productos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Toastify 
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

// Cargar productos desde JSON
async function cargarProductos() {
  try {
    const res = await fetch("../data/productos.json");
    if (!res.ok) throw new Error("Error al cargar productos");
    const productos = await res.json();

    productosContainer.innerHTML = "";

    productos.forEach((p) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="card-body">
          <h3 class="card-title">${p.nombre}</h3>
          <p class="card-price">$${p.precio.toLocaleString()}</p>
          <button class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
        </div>
      `;

      productosContainer.appendChild(card);
    });

// btn agregar
    document.querySelectorAll(".btn-agregar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const producto = productos.find((item) => item.id === id);
        agregarAlCarrito(producto);
      });
    });

  } catch (error) {
    toast("❌ No se pudieron cargar los productos", "error");
  }
}

// Agregar al carrito
function agregarAlCarrito(producto) {
  if (!producto) return;

  const existe = carrito.find((p) => p.id === producto.id);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  toast(`✅ ${producto.nombre} agregado`);
}

cargarProductos();
