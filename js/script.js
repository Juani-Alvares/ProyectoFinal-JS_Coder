const productosContainer = document.getElementById("productos");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function toast(msg, type = "info") {
  const bg = type === "error" ? "linear-gradient(to right, #ff5f6d, #ffc371)" : "linear-gradient(to right, #f39c12, #f39c12)";
  Toastify({
    text: msg,
    duration: 1600,
    gravity: "top",
    position: "right",
    style: { background: bg, color: "#111",  }
  }).showToast();
}

async function cargarProductos() {
  try {
    const res = await fetch("../data/productos.json");
    if (!res.ok) throw new Error("No se pudo cargar productos");
    const productos = await res.json();

    productosContainer.innerHTML = "";

    productos.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <div class="card-body">
          <div class="card-title">${p.nombre}</div>
          <div class="card-price">$${p.precio.toLocaleString()}</div>
          <button class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
        </div>
      `;
      productosContainer.appendChild(card);
    });


    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const prod = productos.find(x => x.id === id);
        agregarAlCarrito(prod);
      });
    });

  } catch (err) {
    console.error("cargarProductos error", err);
    toast("Error cargando productos", "error");
  } finally {
    
  }
}

function agregarAlCarrito(producto) {
  try {
    if (!producto) return;
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast(`${producto.nombre} agregado`, "ok");
  } catch (err) {
    console.error("Error agregando al carrito", err);
    toast("No se pudo agregar", "error");
  }
}


cargarProductos();
