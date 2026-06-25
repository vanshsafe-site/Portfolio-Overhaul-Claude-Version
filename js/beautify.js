/* =====================================================================
   BEAUTIFY.JS
   Pure presentation / UX layer for Vansh Garg's portfolio.

   This file never touches data, never talks to Supabase, and never
   rewrites page copy. It only adds classes, small interactive DOM
   nodes (hamburger button, back-to-top button, canvas), and CSS
   custom properties, so the original HTML files stay untouched.

   Loaded BEFORE app.js on every page.
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
       MOBILE NAVIGATION
       Injects a hamburger toggle next to the theme button and turns
       .nav-links into a slide-down menu below 880px. No nav link is
       ever removed; it just becomes reachable on small screens.
    ================================================================= */

    function initMobileNav() {

        const wrap = document.querySelector(".navbar .container");
        const navLinks = document.querySelector(".nav-links");
        const themeToggle = document.getElementById("theme-toggle");

        if (!wrap || !navLinks) return;

        const toggle = document.createElement("button");
        toggle.className = "nav-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Toggle navigation menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "<span></span><span></span><span></span>";

        if (themeToggle) {
            wrap.insertBefore(toggle, themeToggle);
        } else {
            wrap.appendChild(toggle);
        }

        function closeMenu() {
            navLinks.classList.remove("nav-open");
            toggle.classList.remove("is-active");
            toggle.setAttribute("aria-expanded", "false");
        }

        toggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("nav-open");
            toggle.classList.toggle("is-active", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!navLinks.classList.contains("nav-open")) return;
            if (!wrap.contains(event.target)) closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 880) closeMenu();
        });
    }

    /* =================================================================
       ACTIVE NAV LINK
       Highlights whichever nav item matches the current page.
    ================================================================= */

    function markActiveNavLink() {
        const current = location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".nav-links a").forEach((link) => {
            const href = (link.getAttribute("href") || "").split("/").pop();
            if (href === current) link.classList.add("active");
        });
    }

    /* =================================================================
       NAVBAR SCROLL STATE
       Adds a subtle shadow/border once the page has scrolled.
    ================================================================= */

    function initNavbarScroll() {
        const navbar = document.querySelector(".navbar");
        if (!navbar) return;

        function update() {
            navbar.classList.toggle("scrolled", window.scrollY > 12);
        }

        update();
        window.addEventListener("scroll", update, { passive: true });
    }

    /* =================================================================
       SCROLL REVEAL
       Fades + lifts cards and key blocks into view as they enter the
       viewport. Falls back to instantly visible if unsupported or if
       the visitor prefers reduced motion.
    ================================================================= */

    function initScrollReveal() {
        const currentPath = window.location.pathname || window.location.href;
        if (
            currentPath.includes("about.html") ||
            currentPath.includes("contact.html")
        ) {
            return;
        }

        const targets = document.querySelectorAll(
            ".card, .section-title, .page-description, .contact-box, .project-page"
        );

        if (!targets.length) return;

        if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
            targets.forEach((el) => el.classList.add("reveal-visible"));
            return;
        }

        targets.forEach((el) => el.classList.add("reveal"));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        targets.forEach((el) => observer.observe(el));
    }

    /* =================================================================
       CARD INTERACTIONS
       Subtle pointer-driven tilt + cursor-following glow on cards.
       Skipped on touch devices and when reduced motion is requested.
    ================================================================= */

    function initCardInteractions() {
        if (isTouchDevice() || prefersReducedMotion()) return;

        document.querySelectorAll(".card").forEach((card) => {

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
        });
    }

    /* =================================================================
       BACK TO TOP
       Small floating button, only shown after scrolling down a bit.
    ================================================================= */

    function initBackToTop() {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "back-to-top";
        btn.setAttribute("aria-label", "Back to top");
        btn.textContent = "↑";

        document.body.appendChild(btn);

        btn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? "auto" : "smooth"
            });
        });

        function update() {
            btn.classList.toggle("visible", window.scrollY > 480);
        }

        update();
        window.addEventListener("scroll", update, { passive: true });
    }

    /* =================================================================
       HERO NETWORK BACKGROUND
       A quiet, drifting node/line network behind the hero section —
       skipped on small screens, slow connections, and reduced motion.
    ================================================================= */

    function initHeroNetwork() {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        if (prefersReducedMotion()) return;
        if (window.innerWidth < 640) return;

        const canvas = document.createElement("canvas");
        canvas.className = "hero-network";
        hero.insertBefore(canvas, hero.firstChild);

        const ctx = canvas.getContext("2d");
        let width, height, points, frameId;

        function getAccent() {
            const value = getComputedStyle(document.documentElement)
                .getPropertyValue("--accent")
                .trim();
            return value || "#2BE6AE";
        }

        function resize() {
            width = canvas.width = hero.clientWidth;
            height = canvas.height = hero.clientHeight;
        }

        function createPoints() {
            const count = Math.min(46, Math.max(18, Math.floor((width * height) / 26000)));
            points = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25
            }));
        }

        function step() {
            ctx.clearRect(0, 0, width, height);
            const accent = getAccent();

            points.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            });

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.globalAlpha = (1 - dist / 120) * 0.25;
                        ctx.strokeStyle = accent;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 0.6;
            points.forEach((p) => {
                ctx.beginPath();
                ctx.fillStyle = accent;
                ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            frameId = requestAnimationFrame(step);
        }

        resize();
        createPoints();
        step();

        window.addEventListener("resize", () => {
            resize();
            createPoints();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(frameId);
            } else {
                step();
            }
        });
    }

    /* =================================================================
       CONSOLE SIGNATURE
       A small, harmless touch for anyone curious enough to open devtools.
    ================================================================= */

    function logSignature() {
        console.log(
            "%cBuilt by Vansh Garg — poking around in here? Let's connect.",
            "color:#2BE6AE; font-family:monospace; font-size:12px;"
        );
    }

    /* =================================================================
       INIT
    ================================================================= */

    document.addEventListener("DOMContentLoaded", () => {
        initMobileNav();
        markActiveNavLink();
        initNavbarScroll();
        initScrollReveal();
        initCardInteractions();
        initBackToTop();
        initHeroNetwork();
        logSignature();
    });

})();
