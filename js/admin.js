/* =====================================================================
   ADMIN.JS
   Behavioral polish for the /admin/ pages only. This file never calls
   Supabase and never overwrites what app.js does — it just adds
   classes, small injected controls (password toggle, back-to-top),
   and observes the DOM for cards that app.js injects asynchronously
   after a Supabase fetch, so they still get the same entrance/tilt
   treatment as everything else.

   Load this AFTER app.js, e.g.:
   <script src="../js/app.js"></script>
   <script src="../js/admin.js"></script>
===================================================================== */

(function () {
    "use strict";

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function isTouchDevice() {
        return window.matchMedia("(pointer: coarse)").matches;
    }

    /* =================================================================
       PASSWORD VISIBILITY TOGGLE  (login.html)
    ================================================================= */

    function initPasswordToggle() {
        const pwd = document.getElementById("login-password");
        if (!pwd) return;

        const wrapper = document.createElement("div");
        wrapper.className = "password-field";

        pwd.parentNode.insertBefore(wrapper, pwd);
        wrapper.appendChild(pwd);

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "password-toggle";
        toggle.textContent = "Show";
        toggle.setAttribute("aria-label", "Show password");

        wrapper.appendChild(toggle);

        toggle.addEventListener("click", () => {
            const showing = pwd.type === "text";
            pwd.type = showing ? "password" : "text";
            toggle.textContent = showing ? "Show" : "Hide";
            toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        });
    }

    /* =================================================================
       LOGOUT CONFIRMATION
       Wraps the global logout() defined in app.js so an accidental
       click can't immediately sign you out. Requires admin.js to load
       after app.js so window.logout already exists.
    ================================================================= */

    function initLogoutConfirm() {
        if (typeof window.logout !== "function") return;

        const original = window.logout;

        window.logout = function (...args) {
            if (confirm("Log out of the admin panel?")) {
                return original.apply(this, args);
            }
        };
    }

    /* =================================================================
       INVALID-FIELD SHAKE
       Native required-field validation already blocks submission;
       this just gives it a visible nudge.
    ================================================================= */

    function initInputErrorShake() {
        document.querySelectorAll("input[required], textarea[required]").forEach((el) => {
            el.addEventListener("invalid", () => {
                el.classList.add("input-error");
                setTimeout(() => el.classList.remove("input-error"), 450);
            });
        });
    }

    /* =================================================================
       CARD ENHANCEMENTS
       Same idea as the public site's reveal + cursor-tilt effect, but
       applied via a MutationObserver too, since the admin lists start
       as "Loading..." and only get real .card elements once app.js's
       Supabase calls resolve — long after DOMContentLoaded has fired.
    ================================================================= */

    function enhanceCard(card) {
        if (card.dataset.enhanced) return;
        card.dataset.enhanced = "true";

        // Mark featured cards for the CSS left-border accent.
        // CSS :has() handles modern browsers; this class covers the rest.
        if (card.querySelector(".badge-featured")) {
            card.classList.add("is-featured");
        }

        card.classList.add("reveal");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add("reveal-visible"));
        });

        if (isTouchDevice() || prefersReducedMotion()) return;

        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mx", x + "px");
            card.style.setProperty("--my", y + "px");

            const rx = ((y / rect.height) - 0.5) * -4;
            const ry = ((x / rect.width) - 0.5) * 4;

            card.style.setProperty("--rx", rx.toFixed(2) + "deg");
            card.style.setProperty("--ry", ry.toFixed(2) + "deg");
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    }

    function initCardEnhancements() {
        const listIds = ["admin-projects", "admin-ventures", "admin-achievements"];

        document.querySelectorAll(".card").forEach(enhanceCard);

        listIds.forEach((id) => {
            const container = document.getElementById(id);
            if (!container) return;

            const observer = new MutationObserver(() => {
                container.querySelectorAll(".card").forEach(enhanceCard);
            });

            observer.observe(container, { childList: true });
        });
    }

    /* =================================================================
       DASHBOARD COUNT-UP
       Animates the project/venture/achievement totals once app.js
       writes the real numbers in, instead of having them just snap in.
    ================================================================= */

    function animateCount(el, target) {
        if (prefersReducedMotion() || target <= 0) {
            el.textContent = target;
            return;
        }

        const duration = 700;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }

        requestAnimationFrame(tick);
    }

    function initDashboardCountUp() {
        ["projects-count", "ventures-count", "achievements-count"].forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new MutationObserver(() => {
                const target = parseInt(el.textContent, 10);
                if (!isNaN(target)) {
                    observer.disconnect();
                    animateCount(el, target);
                }
            });

            observer.observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    /* =================================================================
       BACK TO TOP
       Useful once a projects/ventures/achievements list grows long.
    ================================================================= */

    function initBackToTop() {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.textContent = "↑";

        document.body.appendChild(btn);

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });

        function update() {
            btn.classList.toggle("visible", window.scrollY > 480);
        }

        update();
        window.addEventListener("scroll", update, { passive: true });
    }

    /* =================================================================
       INIT
    ================================================================= */

    document.addEventListener("DOMContentLoaded", () => {
        initPasswordToggle();
        initLogoutConfirm();
        initInputErrorShake();
        initCardEnhancements();
        initDashboardCountUp();
        initBackToTop();
    });

})();