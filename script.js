// ================= SHARED NAVIGATION =================

const navbar = document.getElementById("navbar");

if (navbar) {

    fetch("navbar.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load navbar.html");
            }

            return response.text();

        })
        .then(data => {

            navbar.outerHTML = data;

            initializeMobileMenu();

        })
        .catch(error => {

            console.error("Navigation failed to load:", error);

        });

}


// ================= MOBILE MENU =================

function initializeMobileMenu() {

    const menuToggle =
        document.getElementById("menu-toggle");

    const navLinks =
        document.getElementById("nav-links");

    if (!menuToggle || !navLinks) {
        return;
    }

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

}


// ================= CURRENT YEAR =================

const year =
    document.getElementById("year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}


// ================= HERO TYPING EFFECT =================

const typedRole =
    document.getElementById("typed-role");

const roles = [
    "DEVELOPER",
    "COMPUTER ENGINEERING STUDENT",
    "DIGITAL ARTIST",
    "EMBEDDED SYSTEMS ENTHUSIAST"
];

const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

if (typedRole && !reduceMotion) {

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeRole() {

        const currentRole =
            roles[roleIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typedRole.textContent =
            currentRole.slice(0, charIndex);

        let delay =
            deleting ? 35 : 65;

        if (
            !deleting &&
            charIndex === currentRole.length
        ) {

            deleting = true;
            delay = 1500;

        }

        else if (
            deleting &&
            charIndex === 0
        ) {

            deleting = false;

            roleIndex =
                (roleIndex + 1) % roles.length;

            delay = 300;

        }

        setTimeout(
            typeRole,
            delay
        );

    }

    setTimeout(
        typeRole,
        1200
    );

}