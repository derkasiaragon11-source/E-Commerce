document.querySelectorAll("header").forEach((header) => {
    const toggle = header.querySelector(".nav-toggle");
    const navigation = header.querySelector("nav");

    if (!toggle || !navigation) {
        return;
    }

    const setMenuOpen = (isOpen) => {
        header.classList.toggle("menu-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    };

    toggle.addEventListener("click", () => {
        setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    header.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
            toggle.focus();
        }
    });
});
