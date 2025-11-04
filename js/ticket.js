try {
  const ticket = JSON.parse(localStorage.getItem("ticket"));
  if (!ticket) throw new Error("No hay ticket disponible");

  document.getElementById("ticket-fecha").innerText = ticket.fecha;
  document.getElementById("ticket-num").innerText = Math.floor(Math.random() * 90000000) + 1000000;

  const itemsEl = document.getElementById("ticket-items");
  ticket.carrito.forEach(p => {
    const row = document.createElement("div");
    row.className = "ticket-row";
    row.innerHTML = `<div>${p.nombre} x${p.cantidad}</div><div>$${(p.precio*p.cantidad).toLocaleString()}</div>`;
    itemsEl.appendChild(row);
  });

  const totalesEl = document.getElementById("ticket-totales");
  totalesEl.innerHTML = `
    <div>Subtotal: $${ticket.subtotal.toLocaleString()}</div>
    <div>Comisión exportación: $${ticket.exportFee.toLocaleString()}</div>
    <div>Recargos: $${ticket.extra.toLocaleString()}</div>
    <div>Envío: $${ticket.envio.toLocaleString()}</div>
    <h3>Total: $${ticket.total.toLocaleString()}</h3>
  `;

  localStorage.removeItem("carrito");
  localStorage.removeItem("ticket");

} catch (err) {
  console.error("ticket.js error", err);
  document.body.innerHTML = `<div style="padding:40px; color:#fff;">No hay comprobante para mostrar. <a href="principal.html">Volver</a></div>`;
} finally {
  const btn = document.getElementById("btnPrint");
  if (btn) btn.addEventListener("click", () => window.print());
}
