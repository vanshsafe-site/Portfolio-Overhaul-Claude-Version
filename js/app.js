/* =========================
   THEME SYSTEM
========================= */

const themeToggle =
    document.getElementById("theme-toggle");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme) {
    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );
}

themeToggle?.addEventListener("click", () => {

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        );

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        newTheme
    );

    localStorage.setItem(
        "theme",
        newTheme
    );

});

/* =========================
   PORTFOLIO APP
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Portfolio Loaded"
        );

    }
);

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
    "YOUR_URL";

const SUPABASE_ANON_KEY =
    "YOUR_KEY";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================
   PROJECT PAGE
========================= */

async function loadProject() {

    const container =
        document.getElementById(
            "project-container"
        );

    if (!container) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    const slug =
        params.get("slug");

    if (!slug) {

        container.innerHTML =
            "<p>Project not found.</p>";

        return;
    }

    const { data, error } =
        await supabaseClient
            .from("projects")
            .select("*")
            .eq("slug", slug)
            .single();

    if (error || !data) {

        container.innerHTML =
            "<p>Project not found.</p>";

        return;
    }

    document.title =
        data.title + " | Vansh Garg";

    container.innerHTML = `
    
        <div class="project-page">

            <img
                src="${data.image}"
                alt="${data.title}"
                class="project-image">

            <h1>
                ${data.title}
            </h1>

            <p>
                ${data.description}
            </p>

            <div>

                ${
                    data.github_url
                    ? `
                    <a
                        href="${data.github_url}"
                        target="_blank"
                        class="btn btn-primary">
                        GitHub
                    </a>
                    `
                    : ""
                }

                ${
                    data.live_url
                    ? `
                    <a
                        href="${data.live_url}"
                        target="_blank"
                        class="btn">
                        Live Demo
                    </a>
                    `
                    : ""
                }

            </div>

        </div>

    `;
}

loadProject();