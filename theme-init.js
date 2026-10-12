/* ==========================================================================
   JUSWA â€” THEME INIT (runs synchronously in <head>, before first paint)
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
        /* Storage / searchParams unavailable â€” keep default. */
    }

    root.setAttribute("data-theme", theme);

    // Apply active favicon immediately
    try {
        var faviconHref = theme === "light" ? "images/favicon-light.png" : "images/favicon-dark.png";
        var favicons = document.querySelectorAll("link[rel*='icon']");
        favicons.forEach(function (f) {
            f.removeAttribute("media");
            f.href = faviconHref;
        });
    } catch (e) {}
})();