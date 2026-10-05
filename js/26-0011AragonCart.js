// Kunin yung items sa cart at i-compute yung total price.
const cart = JSON.parse(localStorage.getItem("derkCart") || "[]");
const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let total = 0;

if (cart.length === 0) {
  // Ipakita 'to kapag empty pa yung cart.
  cartList.textContent = "Your cart is empty.";
} else {
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const row = document.createElement("p");
    row.textContent = `${item.name} x ${item.qty} = ₱${itemTotal.toFixed(2)}`;
    cartList.appendChild(row);
  });
}

// I-display yung total price ng lahat ng items sa cart.
cartTotal.textContent = `Total: ₱${total.toFixed(2)}`;