// ==========================================================================
// JUSWA PORTFOLIO — GLOBAL INTERACTIVE ENGINE
// Lightweight Vanilla JavaScript (Zero bloated frameworks)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCurrentYear();
    initHeroTyping();
    initThemeToggle();
    initHeroArtInteraction();
    initPhotoScreentoneReveal();
    initSkillInspector();
    initArtworkLightbox();
    initScrollReveal();
    initCustomCursor();
});

// ================= 1. GLOBAL NAVIGATION & RELIABLE ACTIVE DETECTION =================
function initNavigation() {
    const navbarMount = document.getElementById("navbar");

    if (navbarMount && navbarMount.tagName === "HEADER") {
        setupNavbarInteractions();
        highlightActivePage();
        return;
    }

    if (navbarMount && navbarMount.tagName === "DIV") {
        fetch("navbar.html")
            .then(res => {
                if (!res.ok) throw new Error("Failed to load navbar.html");
                return res.text();
            })
            .then(html => {
                navbarMount.outerHTML = html;
                setupNavbarInteractions();
                highlightActivePage();
            })
            .catch(err => {
                console.warn("Navbar fetch failed (e.g. file:// protocol):", err);
                setupNavbarInteractions();
                highlightActivePage();
            });
    } else {
        setupNavbarInteractions();
        highlightActivePage();
    }
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
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
}

// FIX: Rock-solid active page highlighting for ALL pages (including Projects & Artwork)
function highlightActivePage() {
    const navAnchors = document.querySelectorAll("#nav-links a");
    if (!navAnchors.length) return;

    const currentPath = window.location.pathname.toLowerCase();
    let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || "index.html";
    filename = filename.split('#')[0].split('?')[0];

    // Normalize root and GitHub Pages repository folder path
    if (filename === "" || filename === "my-portfolio" || filename === "my-portfolio/") {
        filename = "index.html";
    }

    navAnchors.forEach(link => {
        const href = (link.getAttribute("href") || "").toLowerCase().split('#')[0].split('?')[0];
        let linkFile = href.substring(href.lastIndexOf('/') + 1) || "index.html";
        if (linkFile === "") linkFile = "index.html";

        let isCurrent = false;

        if (filename === "index.html") {
            isCurrent = (linkFile === "index.html");
        } else if (filename === "artwork.html") {
            isCurrent = (linkFile === "artwork.html");
        } else if (filename === "projects.html" || filename === "synced-n.html" || filename === "smart-cane.html" || filename === "smart-medication.html") {
            isCurrent = (linkFile === "projects.html");
        } else {
            isCurrent = (filename === linkFile);
        }

        if (isCurrent) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}

// ================= 2. FOOTER YEAR =================
function initCurrentYear() {
    const yearEls = document.querySelectorAll("#year");
    const currentYear = new Date().getFullYear();
    yearEls.forEach(el => {
        el.textContent = currentYear;
    });
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
            delay = 1800;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            delay = 350;
        }

        setTimeout(typeLoop, delay);
    }

    setTimeout(typeLoop, 1400);
}

// ================= 4. HOME PAGE HERO ARTWORK TILT & PARALLAX =================
function initHeroArtInteraction() {
    const frame = document.getElementById("hero-art-frame");
    const coordsEl = document.getElementById("hero-art-coords");

    if (!frame) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    frame.addEventListener("mousemove", (e) => {
        const rect = frame.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const normX = (relX / rect.width - 0.5) * 2;
        const normY = (relY / rect.height - 0.5) * 2;

        const tiltX = -normY * 7;
        const tiltY = normX * 7;

        frame.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        frame.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);

        if (coordsEl) {
            coordsEl.textContent = `INPUT: POINTER [X: ${Math.round(relX)}, Y: ${Math.round(relY)}]`;
        }
    });

    frame.addEventListener("mouseleave", () => {
        frame.style.setProperty("--tilt-x", "0deg");
        frame.style.setProperty("--tilt-y", "0deg");
        if (coordsEl) {
            coordsEl.textContent = "INPUT: POINTER [STANDBY]";
        }
    });
}

// ================= 5. ABOUT PAGE PHOTO SCREENTONE -> COLOR REVEAL =================
function initPhotoScreentoneReveal() {
    const stage = document.getElementById("photo-reveal-stage");
    const statusEl = document.getElementById("photo-reveal-status");
    const mobileBtn = document.getElementById("mobile-reveal-toggle");

    if (!stage) return;

    let isRevealedTouch = false;

    // Mouse movement interaction (Gradual circular color reveal around cursor)
    stage.addEventListener("mouseenter", () => {
        stage.classList.add("is-hovered");
    });

    stage.addEventListener("mousemove", (e) => {
        const rect = stage.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const posXPercent = ((relX / rect.width) * 100).toFixed(1);
        const posYPercent = ((relY / rect.height) * 100).toFixed(1);

        stage.style.setProperty("--reveal-x", `${posXPercent}%`);
        stage.style.setProperty("--reveal-y", `${posYPercent}%`);
        stage.style.setProperty("--reveal-radius", "130px");

        if (statusEl) {
            statusEl.textContent = `MODE: COLOR_REVEAL [X: ${Math.round(relX)}, Y: ${Math.round(relY)}]`;
        }
    });

    stage.addEventListener("mouseleave", () => {
        stage.classList.remove("is-hovered");
        stage.style.setProperty("--reveal-radius", "0px");

        if (statusEl) {
            statusEl.textContent = "MODE: SCREENTONE";
        }
    });

    // Mobile / Touch Tap to Toggle
    function toggleMobileReveal() {
        isRevealedTouch = !isRevealedTouch;
        if (isRevealedTouch) {
            stage.classList.add("fully-revealed");
            if (statusEl) statusEl.textContent = "MODE: FULL_COLOR";
            if (mobileBtn) mobileBtn.textContent = "[TAP TO RETURN TO SCREENTONE]";
        } else {
            stage.classList.remove("fully-revealed");
            if (statusEl) statusEl.textContent = "MODE: SCREENTONE";
            if (mobileBtn) mobileBtn.textContent = "[TAP TO TOGGLE COLOR]";
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener("click", toggleMobileReveal);
    }

    stage.addEventListener("click", () => {
        const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 850;
        if (isTouch) {
            toggleMobileReveal();
        }
    });
}

// ================= 6. TECHNICAL SKILL TOOLBOX INSPECTOR =================
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

// ================= 7. ARTWORK LIGHTBOX VIEWER =================
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

// ================= 8. SCROLL REVEAL OBSERVER =================
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
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ================= 9. SUBTLE CUSTOM CURSOR (DESKTOP) =================
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

    const interactiveTargets = "a, button, .skill-item-pill, .art-sketchbook-card, .mobile-reveal-toggle";
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
}function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('juswa-theme', newTheme);
    });
}
