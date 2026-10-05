const CART_KEY = "derkCart";
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
const SNOW_GAUZE_PRODUCTS = new Set([
  "ruby-elegance",
  "lavender-blush",
  "lavender-champagne"
]);

// Basahin at baguhin ang cart na naka-save sa browser na ito.
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function updateCartBadge() {
  const countBox = document.getElementById("cart-count");
  if (!countBox) return;

  countBox.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getProductAddons(productId) {
  // Snow Gauze ay pagpipilian lamang sa tatlong bouquet na nakalista sa itaas.
  return ADDONS.filter(addon =>
    addon.id !== "snow-gauze" || SNOW_GAUZE_PRODUCTS.has(productId)
  );
}

// Idagdag ang karaniwan o kinustomisang bouquet at i-update ang bilang sa navigation.
function addProductToCart(card, options) {
  const name = card.dataset.name;
  const productId = name.toLowerCase().replace(/\s+/g, "-");
  const availableAddonIds = getProductAddons(productId).map(addon => addon.id);
  const addons = options.addons
    .filter(addonId => availableAddonIds.includes(addonId))
    .sort();
  const id = [
    productId,
    options.satinColor.toLowerCase(),
    options.flowerCount,
    addons.join(",")
  ].join("|");
  const cart = getCart();
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id,
      productId,
      name,
      price: FLOWER_COUNT_PRICES[options.flowerCount],
      qty: 1,
      satinColor: options.satinColor,
      flowerCount: options.flowerCount,
      addons
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function createCustomizer() {
  // Gawin nang isang beses ang customization dialog at gamitin sa bawat bouquet.
  const dialog = document.createElement("dialog");
  dialog.className = "product-customizer";

  const form = document.createElement("form");
  form.method = "dialog";
  form.className = "product-customizer__form";

  const heading = document.createElement("h2");
  heading.textContent = "Customize your bouquet";

  const productName = document.createElement("p");
  productName.className = "product-customizer__name";

  const colorLabel = document.createElement("label");
  colorLabel.textContent = "Satin color";
  colorLabel.htmlFor = "custom-satin-color";

  const colorInput = document.createElement("input");
  colorInput.id = "custom-satin-color";
  colorInput.name = "satinColor";
  colorInput.type = "text";
  colorInput.maxLength = 40;
  colorInput.required = true;
  colorInput.placeholder = "Enter your preferred color";

  const countLabel = document.createElement("label");
  countLabel.textContent = "Flower count";
  countLabel.htmlFor = "custom-flower-count";

  const countSelect = document.createElement("select");
  countSelect.id = "custom-flower-count";
  countSelect.name = "flowerCount";
  FLOWER_COUNTS.forEach(count => {
    const option = document.createElement("option");
    option.value = count;
    option.textContent = `${count} flowers — ₱${FLOWER_COUNT_PRICES[count].toFixed(2)}`;
    countSelect.appendChild(option);
  });

  const addonsFieldset = document.createElement("fieldset");
  const addonsLegend = document.createElement("legend");
  addonsLegend.textContent = "Add-ons (price per flower)";
  addonsFieldset.appendChild(addonsLegend);

  const priceText = document.createElement("p");
  priceText.className = "product-customizer__price";

  const actions = document.createElement("div");
  actions.className = "product-customizer__actions";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => dialog.close());

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Customized Bouquet";

  actions.append(cancelButton, submitButton);
  form.append(
    heading,
    productName,
    colorLabel,
    colorInput,
    countLabel,
    countSelect,
    addonsFieldset,
    priceText,
    actions
  );
  dialog.appendChild(form);
  document.body.appendChild(dialog);

  function renderAddonChoices(productId) {
    addonsFieldset.replaceChildren(addonsLegend);
    getProductAddons(productId).forEach(addon => {
      const label = document.createElement("label");
      label.className = "product-customizer__addon";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = addon.id;
      checkbox.name = "addons";

      label.append(checkbox, ` ${addon.label} (+₱${addon.pricePerFlower}/flower)`);
      addonsFieldset.appendChild(label);
    });
    updateEstimatedPrice();
  }

  function updateEstimatedPrice() {
    // Kada bulaklak ang bayad sa add-on kaya imultiply ito sa napiling bilang.
    const count = Number(countSelect.value);
    const addonPrice = ADDONS.reduce((sum, addon) => {
      const checkbox = form.querySelector(`input[value="${addon.id}"]`);
      return checkbox && checkbox.checked
        ? sum + addon.pricePerFlower * count
        : sum;
    }, 0);

    priceText.textContent =
      `Estimated price per bouquet: ₱${(FLOWER_COUNT_PRICES[count] + addonPrice).toFixed(2)}`;
  }

  countSelect.addEventListener("change", updateEstimatedPrice);
  addonsFieldset.addEventListener("change", updateEstimatedPrice);

  return {
    dialog,
    form,
    productName,
    colorInput,
    countSelect,
    priceText,
    renderAddonChoices
  };
}

const customizer = createCustomizer();
let selectedCard = null;

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    // Kailangang naka-login bago baguhin ang laman ng cart.
    if (localStorage.getItem("loggedIn") !== "true") {
      localStorage.setItem("afterLogin", window.location.href);
      window.location.href = "../html/26-0011AragonLogin.html";
      return;
    }

    const card = button.closest(".bouquet-card");
    addProductToCart(card, {
      satinColor: "",
      flowerCount: 1,
      addons: []
    });
  });
});

document.querySelectorAll(".customize-product").forEach(button => {
  button.addEventListener("click", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
      localStorage.setItem("afterLogin", window.location.href);
      window.location.href = "../html/26-0011AragonLogin.html";
      return;
    }

    selectedCard = button.closest(".bouquet-card");
    customizer.productName.textContent = selectedCard.dataset.name;
    customizer.form.reset();
    customizer.countSelect.value = "1";
    customizer.renderAddonChoices(
      selectedCard.dataset.name.toLowerCase().replace(/\s+/g, "-")
    );
    customizer.priceText.textContent =
      `Estimated price per bouquet: ₱${FLOWER_COUNT_PRICES[1].toFixed(2)}`;
    customizer.dialog.showModal();
    customizer.colorInput.focus();
  });
});

customizer.form.addEventListener("submit", event => {
  event.preventDefault();
  if (!selectedCard || !customizer.form.reportValidity()) return;

  const color = customizer.colorInput.value.trim();
  if (!color) {
    customizer.colorInput.setCustomValidity("Enter a satin color.");
    customizer.colorInput.reportValidity();
    customizer.colorInput.setCustomValidity("");
    return;
  }

  const addons = [...customizer.form.querySelectorAll('input[name="addons"]:checked')]
    .map(checkbox => checkbox.value);

  // I-save ang mga pinili para maipakita at makwenta ang presyo sa Order page.
  addProductToCart(selectedCard, {
    satinColor: color,
    flowerCount: Number(customizer.countSelect.value),
    addons
  });
  customizer.dialog.close();
});

updateCartBadge();
