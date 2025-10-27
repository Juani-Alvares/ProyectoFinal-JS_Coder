let count = 0;
const cartCount = document.getElementById("cartCount");

document.querySelector(".cart").addEventListener("click", () => {
  count++;
  cartCount.textContent = count;
});
