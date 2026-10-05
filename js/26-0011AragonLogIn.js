const passwordInput = document.getElementById("password");
const toggle = document.getElementById("toggle");
const loginForm = document.getElementById("loginForm");

// Pahintulutan ang user na ipakita o itago ang password habang nagta-type.
toggle.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggle.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggle.textContent = "Show";
  }
});

// Suriin muna ang naka-save na account bago itakda na naka-login ang user.
loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = passwordInput.value;
  let account;

  try {
    account = JSON.parse(localStorage.getItem("account") || "null");
  } catch {
    alert("Saved account data is invalid. Please Sign Up again.");
    return;
  }

  if (!account || typeof account.username !== "string" || typeof account.password !== "string") {
    alert("No account found. Please Sign Up first.");
    return;
  }

  if (username !== account.username || password !== account.password) {
    alert("Incorrect username or password.");
    return;
  }

  localStorage.setItem("loggedIn", "true");
  alert("Login successful!");

  // Ibalik ang user sa pahinang pinanggalingan kung ito ay na-save.
  const nextPage =
    localStorage.getItem("afterLogin") || "../html/26-0011AragonHome.html";
  localStorage.removeItem("afterLogin");
  window.location.href = nextPage;
});
