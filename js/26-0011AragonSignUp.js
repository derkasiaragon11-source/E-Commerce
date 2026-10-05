function togglePassword(inputId, button) {
    // Ipakita o itago ang napiling field ng password.
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        button.textContent = "Show";
    }
}

document.getElementById("signUpform").addEventListener("submit", function(event) {
    event.preventDefault();

    localStorage.setItem("loggedIn", "true");

    const nextPage = localStorage.getItem("afterLogin") || "../html/26-0011AragonLogin.html";
    localStorage.removeItem("afterLogin");
    window.location.href = nextPage
});

function togglePassword(inputId, button) {
 const passwordInput = document.getElementById(inputId);

if (passwordInput.type === "password") {
 passwordInput.type = "text";
 button.textContent = "Hide";
 } else {
 passwordInput.type = "password";
 button.textContent = "Show";
 }
}

document.getElementById("signUpform").addEventListener("submit", function(event) {
 event.preventDefault();

 // Kunin ang mga detalye ng account at tiyaking tugma ang kumpirmasyon ng password.
const fullName = document.getElementById("fullName").value.trim();
 const email = document.getElementById("email").value.trim();
 const password = document.getElementById("password").value;
 const confirmPassword = document.getElementById("confirmPassword").value;

// Tiyaking magkapareho ang password at kumpirmasyon nito.
 if (password !== confirmPassword) {
 alert("Passwords do not match.");
 return;
 }

// I-save ang bagong account sa browser.
 const account = {
 username: fullName,
 email: email,
 password: password
 };

localStorage.setItem("account", JSON.stringify(account));

alert("Account created successfully!");

// Pumunta sa pahina ng Login.
 window.location.href = "../html/26-0011AragonLogin.html";
});