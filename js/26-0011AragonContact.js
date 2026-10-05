const contactForm = document.getElementById("contactForm");

// Suriin ang contact form bago magpakita ng mensahe ng tagumpay.
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Check kung Gmail ang email
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailPattern.test(email)) {
        alert("Please enter a valid Gmail address.");
        return;
    }

    if (name === "" || message === "") {
        alert("Please complete all fields.");
        return;
    }

    alert("Message sent successfully!");

    contactForm.reset();
});
