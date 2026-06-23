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

        loadFeaturedProjects();
        loadProjects();
        loadProject();

        loadVentures();
        loadAllVentures();
        loadVenture();

        loadAchievements();
        loadAllAchievements();
        loadAchievement();

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

    console.log("STEP 1");

const params =
    new URLSearchParams(
        window.location.search
    );

console.log("STEP 2");
const slug =
    params.get("slug");

console.log("STEP 3");
console.log("Slug:", slug);

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
    
/* =========================
   VENTURE PAGE
========================= */

async function loadVenture() {

    const container =
        document.getElementById(
            "venture-container"
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
            "<p>Venture not found.</p>";

        return;
    }

    const { data, error } =
        await supabaseClient
            .from("ventures")
            .select("*")
            .eq("slug", slug)
            .single();

    if (error || !data) {

        container.innerHTML =
            "<p>Venture not found.</p>";

        return;
    }

    document.title =
        data.name + " | Vansh Garg";

    container.innerHTML = `

        <div class="project-page">

            <h1>
                ${data.name}
            </h1>

            <p>
                ${data.description}
            </p>

        </div>

    `;
}
/* =========================
   ACHIEVEMENT PAGE
========================= */

async function loadAchievement() {
    console.log("loadAchievement running");
    const container =
        document.getElementById(
            "achievement-container"
        );

    if (!container) return;

    const params =
        new URLSearchParams(
            window.location.search
        );

    const slug =
        params.get("slug");
        console.log("Slug:", slug);

    if (!slug) {

        container.innerHTML =
            "<p>Achievement not found.</p>";

        return;
    }

    const { data, error } =
        await supabaseClient
            .from("achievements")
            .select("*")
            .eq("slug", slug)
            .single();
console.log(data, error);
    if (error || !data) {

        container.innerHTML =
            "<p>Achievement not found.</p>";

        return;
    }

    document.title =
        data.title + " | Vansh Garg";

    container.innerHTML = `

        <div class="project-page">

            <h1>
                ${data.title}
            </h1>

            <p>
                ${data.description}
            </p>

        </div>

    `;
}
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

/* =========================
   ALL PROJECTS
========================= */

async function loadProjects() {

    const container =
        document.getElementById(
            "projects-grid"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("projects")
            .select("*")
            .order(
                "created_at",
                { ascending: false }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load projects.</p>";

        return;
    }

    container.innerHTML =
        data.map(project => `

            <div class="card">

                <h3>
                    ${project.title}
                </h3>

                <p>
                    ${project.description}
                </p>

                <a
                    href="project.html?slug=${project.slug}"
                    class="btn btn-primary">

                    View Project

                </a>

            </div>

        `).join("");
}



/* =========================
   ACHIEVEMENTS
========================= */

async function loadAchievements() {

    const container =
        document.getElementById(
            "achievements-grid"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("achievements")
            .select("*")
            .eq("featured", true)
            .order(
                "achievement_date",
                { ascending: false }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load achievements.</p>";

        return;
    }

    container.innerHTML =
        data.map(item => `

            <div class="card">

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

                <a
                    href="achievement.html?slug=${item.slug}"
                    class="btn btn-primary">

                    View Achievement

                </a>

            </div>

        `).join("");
}
/* =========================
   VENTURES
========================= */

async function loadVentures() {
    
    const container =
        document.getElementById(
            "ventures-grid"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("ventures")
            .select("*")
            .eq("featured", true)
            .order(
                "created_at",
                { ascending: false }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load ventures.</p>";

        return;
    }

    container.innerHTML =
        data.map(venture => `

            <div class="card">

    <h3>
        ${venture.name}
    </h3>

    <p>
        ${venture.description}
    </p>

    <a
        href="venture.html?slug=${venture.slug}"
        class="btn btn-primary">

        View Venture

    </a>

</div>

        `).join("");
}
/* =========================
   ALL VENTURES
========================= */

async function loadAllVentures() {

    const container =
        document.getElementById(
            "ventures-page-grid"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("ventures")
            .select("*")
            .order(
                "created_at",
                { ascending: false }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load ventures.</p>";

        return;
    }

    container.innerHTML =
        data.map(venture => `

            <div class="card">

    <h3>
        ${venture.name}
    </h3>

    <p>
        ${venture.description}
    </p>

    <a
        href="venture.html?slug=${venture.slug}"
        class="btn btn-primary">

        View Venture

    </a>

</div>

        `).join("");
}

/* =========================
   ALL ACHIEVEMENTS
========================= */

async function loadAllAchievements() {

    const container =
        document.getElementById(
            "achievements-page-grid"
        );

    if (!container) return;

    const { data, error } =
        await supabaseClient
            .from("achievements")
            .select("*")
            .order(
                "achievement_date",
                { ascending: false }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load achievements.</p>";

        return;
    }

    container.innerHTML =
        data.map(item => `

            <div class="card">

    <h3>
        ${item.title}
    </h3>

    <p>
        ${item.description}
    </p>

    <a
        href="achievement.html?slug=${item.slug}"
        class="btn btn-primary">

        View Achievement

    </a>

</div>

        `).join("");
}
