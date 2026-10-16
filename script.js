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
    initFeaturedShowcase();
    initProjectsFilter();
    initCustomCursor();
    initGitHubActivity();
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

    setupStickyNavbarBehavior();
}

function setupStickyNavbarBehavior() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    // Reading progress bar at base of navbar
    let progressBar = document.getElementById("nav-scroll-progress");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "nav-scroll-progress";
        progressBar.className = "nav-scroll-progress";
        navbar.appendChild(progressBar);
    }

    function handleScroll() {
        const scrolled = window.scrollY > 15;
        navbar.classList.toggle("nav-scrolled", scrolled);

        // Calculate scroll progress percentage
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
            progressBar.style.width = `${progress}%`;
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

    const interactiveTargets = "a, button, .skill-item-pill, .art-sketchbook-card, .mobile-reveal-toggle, .featured-nav-item, .featured-view-btn, .featured-all-btn";
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
}function updateThemeFavicon(theme) {
    const isLight = theme === "light";
    const faviconHref = isLight ? "images/favicon-light.png" : "images/favicon-dark.png";
    const wordmarkHref = isLight ? "images/juswa-wordmark-black.png" : "images/juswa-wordmark-white.png";

    // 1. Update browser tab favicon
    const favicons = document.querySelectorAll("link[rel*='icon']");
    favicons.forEach(fav => {
        fav.removeAttribute("media");
        fav.href = faviconHref;
    });

    // 2. Update navbar logo-badge images
    const logoImgs = document.querySelectorAll(".logo-badge img");
    logoImgs.forEach(img => {
        img.src = faviconHref;
    });

    // 3. Update theme-adaptive handwritten wordmarks in navbar & footer
    const wordmarkImgs = document.querySelectorAll(".logo-wordmark-img, .footer-wordmark-img");
    wordmarkImgs.forEach(img => {
        img.src = wordmarkHref;
    });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    
    // Initial sync of favicon & navbar logo on load
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeFavicon(initialTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('juswa-theme', newTheme);
            updateThemeFavicon(newTheme);
        });
    }

    // Sync if OS system theme preference changes while user has not manually set a preference
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            if (!localStorage.getItem("juswa-theme")) {
                const systemTheme = e.matches ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", systemTheme);
                updateThemeFavicon(systemTheme);
            }
        });
    }
}


// ================= 10. INTERACTIVE FEATURED BUILDS SHOWCASE =================
function initFeaturedShowcase() {
    const section = document.getElementById("featured-builds-section");
    const navItems = document.querySelectorAll(".featured-nav-item");
    const previewFrame = document.getElementById("featured-preview-frame");
    const activeImg = document.getElementById("featured-active-image");
    const browserUrl = document.getElementById("featured-browser-url");
    const playbackBadge = document.getElementById("featured-playback-badge");
    const playbackText = document.getElementById("featured-playback-text");
    const activeCategory = document.getElementById("featured-active-category");
    const activeCounter = document.getElementById("featured-active-counter");
    const activeTitle = document.getElementById("featured-active-title");
    const activeDesc = document.getElementById("featured-active-desc");
    const activeTags = document.getElementById("featured-active-tags");
    const activeLink = document.getElementById("featured-active-link");
    const metaTray = document.getElementById("browser-meta-tray");

    if (!section || !navItems.length || !activeImg) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    let isUserInteracting = false;
    let isSectionVisible = false;

    function selectProject(index, manual = false) {
        if (index === currentIndex && !manual) return;
        if (index < 0 || index >= navItems.length) return;

        const targetItem = navItems[index];
        if (!targetItem) return;

        // Update list active states
        navItems.forEach((item, i) => {
            const isActive = i === index;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        const url = targetItem.getAttribute("data-url") || "project.pages.dev";
        const title = targetItem.getAttribute("data-title") || "";
        const category = targetItem.getAttribute("data-category") || "";
        const desc = targetItem.getAttribute("data-desc") || "";
        const tags = (targetItem.getAttribute("data-tags") || "").split(",").map(t => t.trim()).filter(Boolean);
        const imgSrc = targetItem.getAttribute("data-img") || "";
        const linkHref = targetItem.getAttribute("data-link") || "projects.html";
        const counter = targetItem.getAttribute("data-counter") || `0${index + 1} / 0${navItems.length}`;

        // Smooth transition animation
        if (activeImg) activeImg.classList.add("is-transitioning");
        if (metaTray) metaTray.classList.add("is-transitioning");

        setTimeout(() => {
            if (activeImg && imgSrc) {
                activeImg.src = imgSrc;
                activeImg.alt = `${title} Preview`;
            }
            if (browserUrl) browserUrl.textContent = url;
            if (activeCategory) activeCategory.textContent = category;
            if (activeCounter) activeCounter.textContent = counter;
            if (activeTitle) activeTitle.textContent = title;
            if (activeDesc) activeDesc.textContent = desc;
            if (activeLink) activeLink.href = linkHref;

            if (activeTags) {
                activeTags.innerHTML = tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("");
            }

            if (activeImg) activeImg.classList.remove("is-transitioning");
            if (metaTray) metaTray.classList.remove("is-transitioning");
        }, 160);

        currentIndex = index;
    }

    function pauseAutoPlay() {
        isUserInteracting = true;
        if (playbackBadge) playbackBadge.classList.add("is-paused");
        if (playbackText) playbackText.textContent = "PAUSED";
    }

    function resumeAutoPlay() {
        isUserInteracting = false;
        if (playbackBadge) playbackBadge.classList.remove("is-paused");
        if (playbackText) playbackText.textContent = "AUTO";
    }

    function stepNext() {
        if (isUserInteracting || !isSectionVisible) return;
        const nextIndex = (currentIndex + 1) % navItems.length;
        selectProject(nextIndex);
    }

    // Nav Item events
    navItems.forEach((item, index) => {
        item.addEventListener("mouseenter", () => {
            selectProject(index, true);
            pauseAutoPlay();
        });

        item.addEventListener("click", () => {
            selectProject(index, true);
            pauseAutoPlay();
        });

        item.addEventListener("focus", () => {
            selectProject(index, true);
            pauseAutoPlay();
        });

        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectProject(index, true);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = (index + 1) % navItems.length;
                navItems[next].focus();
                selectProject(next, true);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const prev = (index - 1 + navItems.length) % navItems.length;
                navItems[prev].focus();
                selectProject(prev, true);
            }
        });
    });

    // Pause on hover over the entire showcase stage
    const stage = document.querySelector(".featured-interactive-stage");
    if (stage) {
        stage.addEventListener("mouseenter", pauseAutoPlay);
        stage.addEventListener("mouseleave", resumeAutoPlay);
        stage.addEventListener("focusin", pauseAutoPlay);
        stage.addEventListener("focusout", (e) => {
            if (!stage.contains(e.relatedTarget)) {
                resumeAutoPlay();
            }
        });
    }

    // Interval rotation
    autoPlayTimer = setInterval(stepNext, 5000);

    // Observe visibility so it only auto-rotates when in viewport
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSectionVisible = entry.isIntersecting;
            });
        }, { threshold: 0.2 });
        observer.observe(section);
    } else {
        isSectionVisible = true;
    }
}
// ================= 11. PROJECTS CATEGORY FILTER =================
function initProjectsFilter() {
    const filterBar = document.querySelector(".projects-filter-bar");
    const filterPills = document.querySelectorAll(".project-filter-pill");
    const projectCards = document.querySelectorAll(".project-showcase-entry");
    const emptyState = document.getElementById("projects-empty-state");
    const resetBtn = document.getElementById("reset-filter-btn");

    if (!filterBar || !filterPills.length || !projectCards.length) return;

    function applyFilter(category) {
        let visibleCount = 0;

        filterPills.forEach(pill => {
            const matches = pill.getAttribute("data-filter") === category;
            pill.classList.toggle("active", matches);
            pill.setAttribute("aria-pressed", String(matches));
        });

        projectCards.forEach(card => {
            const cardCat = card.getAttribute("data-category") || "";
            const isMatch = (category === "all") || (cardCat === category);

            if (isMatch) {
                card.style.display = "";
                // trigger re-visibility
                card.classList.add("revealed");
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            const filter = pill.getAttribute("data-filter") || "all";
            applyFilter(filter);
        });

        pill.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pill.click();
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            applyFilter("all");
        });
    }
}

// ================= 12. GITHUB LIVE ACTIVITY HEATMAP =================
function initGitHubActivity() {
    const container = document.getElementById("github-heatmap-container");
    const totalEl = document.getElementById("github-total-contributions");
    const yearBadge = document.getElementById("github-year-badge");
    const viewport = document.getElementById("github-heatmap-viewport");

    if (!container) return;

    const username = "Shuwawao";
    const primaryApiUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
    const fallbackLocalUrl = "data/github-contributions.json";

    // Setup or get floating HUD tooltip
    let tooltip = document.getElementById("github-heatmap-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "github-heatmap-tooltip";
        tooltip.className = "github-heatmap-tooltip";
        document.body.appendChild(tooltip);
    }

    async function loadData() {
        try {
            // Live fetch with no-cache so every page view gets the latest commits from GitHub
            const res = await fetch(primaryApiUrl, { cache: "no-cache" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderHeatmap(data);
        } catch (err) {
            console.warn("GitHub live API stream failed, attempting local fallback cache:", err);
            try {
                const fallbackRes = await fetch(fallbackLocalUrl);
                const fallbackData = await fallbackRes.json();
                renderHeatmap(fallbackData);
            } catch (fallbackErr) {
                console.error("Failed to load GitHub activity data:", fallbackErr);
                container.innerHTML = `
                    <div class="github-heatmap-error">
                        <span>TELEMETRY OFFLINE // GITHUB REPOSITORY ACCESSIBLE</span>
                        <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="button secondary">View Profile ↗</a>
                    </div>`;
            }
        }
    }

    function renderHeatmap(data) {
        if (!data || !data.contributions || !data.contributions.length) return;

        const contributions = data.contributions;
        const total = (data.total && data.total.lastYear != null) ? data.total.lastYear : contributions.reduce((sum, c) => sum + (c.count || 0), 0);

        if (totalEl) {
            totalEl.textContent = total;
        }

        const firstDate = new Date(contributions[0].date);
        const lastDate = new Date(contributions[contributions.length - 1].date);
        if (yearBadge) {
            yearBadge.textContent = `${firstDate.getUTCFullYear()} – ${lastDate.getUTCFullYear()}`;
        }

        // Group into weeks (columns). GitHub standard weeks start on Sunday (day 0)
        const weeks = [];
        let currentWeek = [];

        // Pad first week if first contribution date is not Sunday
        const startDay = firstDate.getUTCDay();
        for (let i = 0; i < startDay; i++) {
            currentWeek.push(null);
        }

        contributions.forEach(item => {
            currentWeek.push(item);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        // Determine month positions along the 53 weeks
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthPositions = [];
        let lastSeenMonth = -1;

        weeks.forEach((wk, weekIdx) => {
            const firstValid = wk.find(d => d !== null);
            if (firstValid) {
                const m = new Date(firstValid.date).getUTCMonth();
                if (m !== lastSeenMonth) {
                    monthPositions.push({ month: monthNames[m], col: weekIdx });
                    lastSeenMonth = m;
                }
            }
        });

        // Construct semantic, accessible HTML grid
        let html = '<div class="gh-calendar-grid" role="grid" aria-label="GitHub Contributions Heatmap">';

        // Month labels row
        html += '<div class="gh-months-row" aria-hidden="true">';
        html += '<div class="gh-weekday-spacer"></div>';
        html += '<div class="gh-months-track">';
        monthPositions.forEach(mp => {
            html += `<span class="gh-month-label" style="grid-column-start: ${mp.col + 1}">${mp.month}</span>`;
        });
        html += '</div></div>';

        // Heatmap body: weekdays on left, week columns on right
        html += '<div class="gh-body-row">';
        html += '<div class="gh-weekdays-col" aria-hidden="true">';
        html += '<span class="gh-weekday-label"></span>'; // Sun
        html += '<span class="gh-weekday-label">Mon</span>';
        html += '<span class="gh-weekday-label"></span>'; // Tue
        html += '<span class="gh-weekday-label">Wed</span>';
        html += '<span class="gh-weekday-label"></span>'; // Thu
        html += '<span class="gh-weekday-label">Fri</span>';
        html += '<span class="gh-weekday-label"></span>'; // Sat
        html += '</div>';

        // 53-week columns
        html += '<div class="gh-weeks-grid">';
        weeks.forEach((wk, wIdx) => {
            html += `<div class="gh-week-col" data-week="${wIdx}">`;
            for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
                const dayData = wk[dayIdx];
                if (!dayData) {
                    html += '<div class="gh-day-cell gh-day-empty" aria-hidden="true"></div>';
                } else {
                    const count = dayData.count || 0;
                    const level = dayData.level || 0;
                    const dateStr = dayData.date;
                    html += `<div class="gh-day-cell level-${level}" data-date="${dateStr}" data-count="${count}" tabindex="0" role="gridcell" aria-label="${count} contributions on ${dateStr}"></div>`;
                }
            }
            html += '</div>';
        });
        html += '</div></div></div>';

        container.innerHTML = html;

        // Auto-scroll viewport so today's latest contributions are directly visible
        if (viewport) {
            setTimeout(() => {
                viewport.scrollLeft = viewport.scrollWidth;
            }, 60);
        }

        // Setup HUD Tooltip events
        const cells = container.querySelectorAll('.gh-day-cell[data-date]');
        cells.forEach(cell => {
            const showTooltip = (e) => {
                const count = cell.getAttribute('data-count');
                const dateStr = cell.getAttribute('data-date');
                const d = new Date(dateStr + "T00:00:00Z");
                const formattedDate = d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC'
                });

                const countText = count === "1" ? "1 contribution" : `${count} contributions`;
                tooltip.innerHTML = `<strong>${countText}</strong> on ${formattedDate}`;
                tooltip.classList.add('visible');
                updateTooltipPos(e.clientX || cell.getBoundingClientRect().left, e.clientY || cell.getBoundingClientRect().top);
            };

            cell.addEventListener('mouseenter', showTooltip);
            cell.addEventListener('focus', () => {
                const rect = cell.getBoundingClientRect();
                showTooltip({ clientX: rect.left + rect.width / 2, clientY: rect.top });
            });

            cell.addEventListener('mousemove', (e) => {
                updateTooltipPos(e.clientX, e.clientY);
            });

            cell.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
            cell.addEventListener('blur', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    function updateTooltipPos(clientX, clientY) {
        if (!tooltip) return;
        const tw = tooltip.offsetWidth || 180;
        const th = tooltip.offsetHeight || 32;
        let left = clientX - tw / 2;
        let top = clientY - th - 12;

        if (left < 10) left = 10;
        if (left + tw > window.innerWidth - 10) left = window.innerWidth - tw - 10;
        if (top < 10) top = clientY + 18;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    loadData();
}
