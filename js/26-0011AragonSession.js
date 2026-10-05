const loginLink = document.getElementById("loginLink");
const sessionCartCount = document.getElementById("cart-count");

// Ipakita sa navigation ang bilang ng laman ng cart kung may badge.
if (sessionCartCount) {
  const cart = JSON.parse(localStorage.getItem("derkCart") || "[]");
  sessionCartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

if (loginLink) {
  const loginUrl = "../html/26-0011AragonLogin.html";

  // Baguhin ang link sa navigation ayon sa naka-save na estado ng login.
  function updateLoginLink() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    loginLink.textContent = loggedIn ? "Logout" : "Login";
    loginLink.href = loggedIn ? "#" : loginUrl;
  }

  loginLink.addEventListener("click", event => {
    if (localStorage.getItem("loggedIn") === "true") {
      event.preventDefault();
      // Burahin ang naka-save na estado ng login kapag pinindot ang Logout.
      localStorage.removeItem("loggedIn");
      updateLoginLink();
    }
  });

  updateLoginLink();
}
