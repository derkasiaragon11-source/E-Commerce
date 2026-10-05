const CART_KEY = "derkCart";
const ORDERS_KEY = "derkOrders";
const FLOWER_COUNTS = [1, 3, 6, 7, 8, 10, 12, 15, 18, 20];
const FLOWER_COUNT_PRICES = {
  1: 70,
  3: 170,
  6: 320,
  7: 370,
  8: 420,
  10: 510,
  12: 610,
  15: 760,
  18: 900,
  20: 1000
};
const ADDONS = [
  { id: "snow-gauze", label: "Snow Gauze", pricePerFlower: 5 },
  { id: "butterfly", label: "Butterfly", pricePerFlower: 10 },
  { id: "letter", label: "Letter", pricePerFlower: 10 },
  { id: "fairy-lights", label: "Fairy Lights", pricePerFlower: 10 }
];
const SATIN_COLORS = ["Pink", "Red", "Blue", "Purple", "White", "Yellow", "Green", "Orange"];
const SNOW_GAUZE_PRODUCTS = new Set([
  "ruby-elegance",
  "lavender-blush",
  "lavender-champagne"
]);

const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartMessage = document.getElementById("cart-message");
const placeOrderButton = document.getElementById("place-order-btn");

// Lokal na sine-save sa browser ang datos ng cart at order para sa demo na ito.
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function getFlowerCount(item) {
  const count = Number(item.flowerCount);
  return FLOWER_COUNTS.includes(count) ? count : FLOWER_COUNTS[0];
}

function getProductId(item) {
  return item.productId || item.name.toLowerCase().replace(/\s+/g, "-");
}

function getProductAddons(item) {
  // Huwag ipakita o singilin ang Snow Gauze sa mga bouquet na walang opsyong ito.
  return ADDONS.filter(addon =>
    addon.id !== "snow-gauze" || SNOW_GAUZE_PRODUCTS.has(getProductId(item))
  );
}

function getItemTotal(item) {
  const flowerCount = getFlowerCount(item);
  const addonTotal = getProductAddons(item).reduce((sum, addon) => {
    return item.addons?.includes(addon.id)
      ? sum + addon.pricePerFlower * flowerCount
      : sum;
  }, 0);

  // Imultiply sa dami ng bouquet ang base na presyo at napiling mga add-on.
  return (FLOWER_COUNT_PRICES[flowerCount] + addonTotal) * item.qty;
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function createCustomizationControls(item) {
  // Gumawa ng mga pagpipilian para sa kulay, bilang ng bulaklak, at add-on.
  const customization = document.createElement("section");
  customization.className = "cart-customizer";

  const heading = document.createElement("h3");
  heading.textContent = "Customize your bouquet";

  const colorLabel = document.createElement("label");
  colorLabel.className = "cart-field";
  colorLabel.textContent = "Satin color";

  const colorSelect = document.createElement("select");
  colorSelect.dataset.field = "satinColor";
  colorSelect.dataset.id = item.id;

  const savedColorIsPreset = SATIN_COLORS.includes(item.satinColor);
  const savedColorIsEmpty = !item.satinColor;
  const colorChoices = ["Choose a color", ...SATIN_COLORS, "Custom color"];
  colorChoices.forEach((color, index) => {
    const option = document.createElement("option");
    option.value = index === 0 ? "" : color;
    option.textContent = color;
    if (
      (savedColorIsEmpty && index === 0) ||
      (savedColorIsPreset && color === item.satinColor) ||
      (!savedColorIsPreset && !savedColorIsEmpty && color === "Custom color")
    ) {
      option.selected = true;
    }
    colorSelect.appendChild(option);
  });
  colorLabel.appendChild(colorSelect);

  const customColorInput = document.createElement("input");
  customColorInput.type = "text";
  customColorInput.maxLength = 40;
  customColorInput.placeholder = "Type your satin color";
  customColorInput.value = savedColorIsPreset || savedColorIsEmpty
    ? ""
    : item.satinColor;
  customColorInput.hidden = savedColorIsPreset || savedColorIsEmpty;
  customColorInput.dataset.field = "customSatinColor";
  customColorInput.dataset.id = item.id;
  colorLabel.appendChild(customColorInput);

  colorSelect.addEventListener("change", () => {
    const isCustom = colorSelect.value === "Custom color";
    customColorInput.hidden = !isCustom;
    if (!isCustom) {
      customColorInput.value = "";
    }
  });

  const countLabel = document.createElement("label");
  countLabel.className = "cart-field";
  countLabel.textContent = "Flower count per bouquet";

  const countSelect = document.createElement("select");
  countSelect.dataset.field = "flowerCount";
  countSelect.dataset.id = item.id;
  FLOWER_COUNTS.forEach(count => {
    const option = document.createElement("option");
    option.value = count;
    option.textContent =
      `${count} flowers — ₱${FLOWER_COUNT_PRICES[count].toFixed(2)}`;
    option.selected = count === getFlowerCount(item);
    countSelect.appendChild(option);
  });
  countLabel.appendChild(countSelect);

  const addons = document.createElement("fieldset");
  addons.className = "cart-addons";
  const addonsLegend = document.createElement("legend");
  addonsLegend.textContent = "Add-ons (price per flower)";
  addons.appendChild(addonsLegend);

  getProductAddons(item).forEach(addon => {
    const label = document.createElement("label");
    label.className = "cart-addon";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Array.isArray(item.addons) && item.addons.includes(addon.id);
    checkbox.dataset.field = "addon";
    checkbox.dataset.id = item.id;
    checkbox.dataset.addon = addon.id;

    label.append(checkbox, ` ${addon.label} (+₱${addon.pricePerFlower}/flower)`);
    addons.appendChild(label);
  });

  customization.append(heading, colorLabel, countLabel, addons);
  return customization;
}

function renderCart() {
  // Ipakita muli ang cart at kwentahin ang kabuuan batay sa mga naka-save na pinili.
  const cart = getCart();
  let total = 0;

  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartList.replaceChildren();
  cartMessage.textContent = "";
  placeOrderButton.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartList.textContent = "Your cart is empty.";
  } else {
    cart.forEach(item => {
      const itemTotal = getItemTotal(item);
      total += itemTotal;

      const row = document.createElement("article");
      row.className = "cart-item";

      const title = document.createElement("h2");
      title.textContent = item.name;

      const customization = createCustomizationControls(item);

      const linePrice = document.createElement("p");
      linePrice.className = "cart-item-total";
      linePrice.textContent = `Item total: ₱${itemTotal.toFixed(2)} (${item.qty} bouquet${item.qty === 1 ? "" : "s"})`;

      const quantityControls = document.createElement("div");
      quantityControls.className = "cart-quantity";
      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.textContent = "−";
      decreaseButton.setAttribute("aria-label", `Decrease ${item.name} bouquet quantity`);
      decreaseButton.dataset.action = "decrease";
      decreaseButton.dataset.id = item.id;

      const quantity = document.createElement("span");
      quantity.textContent = `Bouquet quantity: ${item.qty}`;

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.textContent = "+";
      increaseButton.setAttribute("aria-label", `Increase ${item.name} bouquet quantity`);
      increaseButton.dataset.action = "increase";
      increaseButton.dataset.id = item.id;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove item";
      removeButton.dataset.action = "remove";
      removeButton.dataset.id = item.id;

      quantityControls.append(decreaseButton, quantity, increaseButton, removeButton);
      row.append(title, customization, linePrice, quantityControls);
      cartList.appendChild(row);
    });
  }

  cartTotal.textContent = `Total: ₱${total.toFixed(2)}`;
}

cartList.addEventListener("change", event => {
  const control = event.target;
  const itemId = control.dataset.id;
  const field = control.dataset.field;
  if (!itemId || !field) return;

  const cart = getCart();
  const item = cart.find(entry => entry.id === itemId);
  if (!item) return;

  if (field === "satinColor") {
    item.satinColor = control.value === "Custom color" ? "" : control.value;
  } else if (field === "customSatinColor") {
    item.satinColor = control.value.trim();
  } else if (field === "flowerCount") {
    item.flowerCount = Number(control.value);
  } else if (field === "addon") {
    item.addons = Array.isArray(item.addons) ? item.addons : [];
    if (control.checked && !item.addons.includes(control.dataset.addon)) {
      item.addons.push(control.dataset.addon);
    } else if (!control.checked) {
      item.addons = item.addons.filter(addonId => addonId !== control.dataset.addon);
    }
  }

  // I-save ang bawat pagbabago sa customization at ipakita muli ang bagong presyo.
  saveCart(cart);
});

cartList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const cart = getCart();
  const item = cart.find(entry => entry.id === button.dataset.id);
  if (!item) return;

  if (button.dataset.action === "remove") {
    saveCart(cart.filter(entry => entry.id !== item.id));
  } else if (button.dataset.action === "increase") {
    item.qty += 1;
    saveCart(cart);
  } else if (button.dataset.action === "decrease") {
    item.qty -= 1;
    saveCart(cart.filter(entry => entry.qty > 0));
  }
});

placeOrderButton.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) return;

  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0);
  orders.push({
    items: cart,
    total,
    createdAt: new Date().toISOString()
  });

  // I-save ang demo order at linisin ang cart para sa susunod na order.
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  localStorage.removeItem(CART_KEY);
  renderCart();
  cartMessage.textContent = "Your order is being processed.";
});

renderCart();
