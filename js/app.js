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
    "https://thccglhmiivjgfcbnapa.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoY2NnbGhtaWl2amdmY2JuYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDUwNDEsImV4cCI6MjA5NzYyMTA0MX0.mtVKuWQWcEOPglJ72vDS41-AAksIrl7AFfGEabQK1Hk";

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

/* =========================
   PROJECTS
========================= */

async function loadFeaturedProjects() {

    const container =
        document.getElementById(
            "featured-projects"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("projects")
            .select("*")
            .eq("featured", true);

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load projects.</p>";

        return;
    }

    container.innerHTML =
        data.map(project => `

            <div class="card">

                <h3>${project.title}</h3>

                <p>${project.description}</p>

                <a
                    href="project.html?slug=${project.slug}"
                    class="btn btn-primary">

                    View Project

                </a>

            </div>

        `).join("");
}
document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Portfolio Loaded"
        );

        loadFeaturedProjects();

    }
);