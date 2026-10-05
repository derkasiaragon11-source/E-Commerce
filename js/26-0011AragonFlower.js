const CART_KEY = "derkCart";

// Kunin ang cart na ginagamit ng Flowers at Order page.
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function updateCartBadge() {
  const countBox = document.getElementById("cart-count");
  if (!countBox) return;

  const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
  countBox.textContent = totalItems;
}

// Direktang idagdag ang bouquet gamit ang mga paunang opsyon nito.
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      localStorage.setItem("afterLogin", window.location.href);
      window.location.href = "../html/26-0011AragonLogin.html";
      return;
    }

    const card = button.closest(".bouquet-card");
    const name = card.dataset.name;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        id,
        name,
        price: Number(card.dataset.price),
        qty: 1,
        satinColor: "",
        flowerCount: 1,
        addons: []
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // I-update ang bilang ng produkto sa navigation.
    updateCartBadge();
  });
});

updateCartBadge();