
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const year = document.getElementById("year");

// Automatically update the copyright year.
year.textContent = new Date().getFullYear();

// Toggle the navigation on small screens.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu after selecting a section.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});