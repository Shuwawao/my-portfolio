/* ==========================================================================
   JUSWA — THEME INIT (runs synchronously in <head>, before first paint)
   Applies the saved theme (or the system preference) so visitors never see
   a flash of the wrong theme. Dark is the default. Also flags that JS is
   available so scroll-reveal styles only hide content when JS can show it.
   Dynamically sets the active favicon (dark/light) immediately.
   ========================================================================== */
(function () {
    var root = document.documentElement;
    root.classList.add("js");

    var theme = "dark";
    try {
        var params = new URLSearchParams(window.location.search);
        var qTheme = params.get("theme");
        if (qTheme === "light" || qTheme === "dark") {
            theme = qTheme;
        } else {
            var saved = localStorage.getItem("juswa-theme");
            if (saved === "light" || saved === "dark") {
                theme = saved;
            } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
                theme = "light";
            }
        }
    } catch (e) {
        /* Storage / searchParams unavailable — keep default. */
    }

    root.setAttribute("data-theme", theme);

    // Apply active favicon & logo wordmark immediately
    try {
        var isLight = theme === "light";
        var faviconHref = isLight ? "images/favicon-light.png" : "images/favicon-dark.png";
        var wordmarkHref = isLight ? "images/juswa-wordmark-black.png" : "images/juswa-wordmark-white.png";

        var favicons = document.querySelectorAll("link[rel*='icon']");
        favicons.forEach(function (f) {
            f.removeAttribute("media");
            f.href = faviconHref;
        });

        // Set wordmark immediately if DOM is ready
        document.addEventListener("DOMContentLoaded", function () {
            var wordmarkImgs = document.querySelectorAll(".logo-wordmark-img, .footer-wordmark-img");
            wordmarkImgs.forEach(function (img) {
                img.src = wordmarkHref;
            });
        });
    } catch (e) {}
})();