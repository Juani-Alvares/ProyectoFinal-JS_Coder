
const formContacto = document.getElementById("formContacto");

formContacto.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (nombre === "" || email === "" || mensaje === "") {
        Toastify({
            text: "Todos los campos son obligatorios",
            duration: 2000,
            gravity: "top",
            position: "right",
            style: { background: "red" }
        }).showToast();
        return;
    }

    Toastify({
        text: "Mensaje enviado con éxito ✅",
        duration: 2500,
        gravity: "top",
        position: "right",
        style: { background: "#ff9800" }
    }).showToast();

    formContacto.reset();
});
