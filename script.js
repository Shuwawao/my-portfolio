const menuToggle =
    document.getElementById("menu-toggle");

const navLinks =
    document.getElementById("nav-links");

const year =
    document.getElementById("year");


// ================= MOBILE MENU =================

menuToggle.addEventListener("click", () => {

    const isOpen =
        navLinks.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});


// Close menu when a navigation link is clicked

navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


// ================= CURRENT YEAR =================

year.textContent =
    new Date().getFullYear();