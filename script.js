// ==========================================================================
// JUSWA PORTFOLIO — INTERACTIVE ENGINE
// Lightweight Vanilla JavaScript (No heavy frameworks or libraries)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCurrentYear();
    initHeroTyping();
    initHeroDiagramInteraction();
    initSkillInspector();
    initArtworkLightbox();
    initScrollReveal();
    initCustomCursor();
});

// ================= 1. SHARED NAVIGATION & ACTIVE TRACKING =================
function initNavigation() {
    const navbarMount = document.getElementById("navbar");
    if (!navbarMount) return;

    if (navbarMount.tagName === "HEADER") {
        setupNavbarInteractions();
        return;
    }

    // If placeholder div
    fetch("navbar.html")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load navbar.html");
            return res.text();
        })
        .then(html => {
            navbarMount.outerHTML = html;
            setupNavbarInteractions();
        })
        .catch(err => {
            console.warn("Shared navigation could not be loaded via fetch (e.g. file:// protocol):", err);
            setupNavbarInteractions();
        });
}

function setupNavbarInteractions() {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (e) => {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");

                // If on index.html and link contains anchor on same page, smooth scroll
                const href = link.getAttribute("href");
                if (href && href.includes("#")) {
                    const targetId = href.split("#")[1];
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: "smooth" });
                        history.pushState(null, "", `#${targetId}`);
                    }
                }
            });
        });
    }

    initScrollSpy();
}

function initScrollSpy() {
    const navAnchors = document.querySelectorAll("#nav-links a[data-section]");
    if (!navAnchors.length) return;

    const sections = Array.from(navAnchors).map(a => {
        const secId = a.getAttribute("data-section");
        return document.getElementById(secId);
    }).filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navAnchors.forEach(a => {
                    if (a.getAttribute("data-section") === currentId) {
                        a.classList.add("active");
                    } else {
                        a.classList.remove("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-80px 0px -40% 0px"
    });

    sections.forEach(sec => observer.observe(sec));
}

// ================= 2. FOOTER YEAR =================
function initCurrentYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ================= 3. HERO TYPING EFFECT =================
function initHeroTyping() {
    const typedRole = document.getElementById("typed-role");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!typedRole || reduceMotion) return;

    const roles = [
        "DEVELOPER",
        "COMPUTER ENGINEERING STUDENT",
        "DIGITAL ARTIST",
        "EMBEDDED SYSTEMS ENTHUSIAST"
    ];

    let roleIdx = 0;
    let charIdx = roles[0].length;
    let isDeleting = false;

    function typeLoop() {
        const current = roles[roleIdx];

        if (isDeleting) {
            charIdx--;
        } else {
            charIdx++;
        }

        typedRole.textContent = current.slice(0, charIdx);

        let delay = isDeleting ? 30 : 65;

        if (!isDeleting && charIdx === current.length) {
            isDeleting = true;
            delay = 1800; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 350; // Pause before typing new word
        }

        setTimeout(typeLoop, delay);
    }

    setTimeout(typeLoop, 1400);
}

// ================= 4. HERO LIVING DIAGRAM MICRO-INTERACTION =================
function initHeroDiagramInteraction() {
    const card = document.getElementById("hero-diagram-card");
    const target = document.getElementById("diagram-target");
    const coordsEl = document.getElementById("diagram-coords");
    const drawer = document.getElementById("portrait-drawer");
    const toggleBtn = document.getElementById("toggle-avatar-btn");
    const closeBtn = document.getElementById("close-portrait-btn");

    if (!card || !target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;

            // Normalize between -1 and 1 from center
            const normX = (relX / rect.width - 0.5) * 2;
            const normY = (relY / rect.height - 0.5) * 2;

            // Clamped subtle displacement: 4-10px maximum
            const moveX = normX * 9;
            const moveY = normY * 7;

            target.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;

            if (coordsEl) {
                coordsEl.textContent = `INPUT: POINTER [X: ${Math.round(relX)}, Y: ${Math.round(relY)}]`;
            }
        });

        card.addEventListener("mouseleave", () => {
            target.style.transform = "translate3d(0, 0, 0)";
            if (coordsEl) {
                coordsEl.textContent = "INPUT: POINTER [STANDBY]";
            }
        });
    }

    // Artist self-portrait drawer toggle
    if (toggleBtn && drawer) {
        toggleBtn.addEventListener("click", () => {
            drawer.classList.add("open");
        });
    }

    if (closeBtn && drawer) {
        closeBtn.addEventListener("click", () => {
            drawer.classList.remove("open");
        });
    }
}

// ================= 5. TECHNICAL SKILL TOOLBOX INSPECTOR =================
function initSkillInspector() {
    const pills = document.querySelectorAll(".skill-item-pill");
    const nameEl = document.getElementById("insp-name");
    const descEl = document.getElementById("insp-desc");
    const catEl = document.getElementById("insp-cat");
    const projEl = document.getElementById("insp-project");

    if (!pills.length || !nameEl) return;

    pills.forEach(pill => {
        pill.addEventListener("mouseenter", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const skill = pill.getAttribute("data-skill") || "";
            const cat = pill.getAttribute("data-cat") || "";
            const project = pill.getAttribute("data-project") || "";
            const desc = pill.getAttribute("data-desc") || "";

            nameEl.textContent = skill;
            catEl.textContent = cat.toUpperCase();
            projEl.textContent = project.toUpperCase();
            descEl.textContent = desc;
        });

        pill.addEventListener("focus", () => {
            pill.dispatchEvent(new Event("mouseenter"));
        });
    });
}

// ================= 6. ARTWORK LIGHTBOX VIEWER =================
function initArtworkLightbox() {
    const cards = document.querySelectorAll(".art-sketchbook-card");
    const lightbox = document.getElementById("art-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxMedium = document.getElementById("lightbox-medium");
    const closeBtn = document.getElementById("lightbox-close-btn");
    const prevBtn = document.getElementById("lightbox-prev-btn");
    const nextBtn = document.getElementById("lightbox-next-btn");

    if (!cards.length || !lightbox) return;

    const artworks = Array.from(cards).map(card => ({
        src: card.getAttribute("data-src"),
        title: card.getAttribute("data-title"),
        medium: card.getAttribute("data-medium")
    }));

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = (index + artworks.length) % artworks.length;
        const current = artworks[currentIndex];

        lightboxImg.src = current.src;
        lightboxImg.alt = current.title;
        lightboxTitle.textContent = current.title;
        lightboxMedium.textContent = current.medium;

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    function showNext() {
        openLightbox(currentIndex + 1);
    }

    function showPrev() {
        openLightbox(currentIndex - 1);
    }

    cards.forEach((card, index) => {
        card.addEventListener("click", () => openLightbox(index));
        card.setAttribute("tabindex", "0");
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard accessibility
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            showNext();
        } else if (e.key === "ArrowLeft") {
            showPrev();
        }
    });
}

// ================= 7. SCROLL REVEAL OBSERVER =================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (!revealElements.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        revealElements.forEach(el => el.classList.add("revealed"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ================= 8. SUBTLE CUSTOM CURSOR (DESKTOP) =================
function initCustomCursor() {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    if (!dot || !ring) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 900;
    if (isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function loop() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px)`;
        requestAnimationFrame(loop);
    }
    loop();

    // Hover effect on clickable elements
    const interactiveTargets = "a, button, .skill-item-pill, .art-sketchbook-card, .diagram-view-toggle";
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveTargets)) {
            ring.classList.add("cursor-active");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactiveTargets)) {
            ring.classList.remove("cursor-active");
        }
    });
}