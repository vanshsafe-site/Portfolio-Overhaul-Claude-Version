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
        loadDashboardStats();
        protectAdminPage();

        const achievementImageInput =
    document.getElementById(
        "achievement-image-file"
    );

if (achievementImageInput) {

    achievementImageInput.addEventListener(
        "change",
        uploadAchievementImage
    );

}

        const projectForm =
    document.getElementById(
        "project-form"
    );

if (projectForm) {

    projectForm.addEventListener(
        "submit",
        createProject
    );

    loadAdminProjects();

}
const ventureForm =
    document.getElementById(
        "venture-form"
    );

if (ventureForm) {

    ventureForm.addEventListener(
        "submit",
        createVenture
    );

    loadAdminVentures();

}
const achievementForm =
    document.getElementById(
        "achievement-form"
    );

if (achievementForm) {

    achievementForm.addEventListener(
        "submit",
        createAchievement
    );

    loadAdminAchievements();

}
const loginForm =
    document.getElementById(
        "login-form"
    );

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        login
    );

}
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
let editingProjectId = null;
let editingVentureId = null;
let editingAchievementId = null;

// Search/filter data storage
let allProjectsData = [];
let allVenturesData = [];
let allAchievementsData = [];

/* =========================
   SEARCH & FILTER HELPERS
========================= */

function renderProjectCards(projects) {
    const container = document.getElementById("admin-projects");
    if (!container) return;
    
    container.innerHTML = projects.map(project => `
        <div class="admin-card">
            <div class="admin-card-body">
                <h3 class="admin-card-title">
                    ${project.title}
                </h3>

                <p class="admin-card-desc">
                    ${project.description}
                </p>
            </div>

            <div class="admin-card-actions">
                <button class="btn btn-secondary"
                    onclick="editProject(${project.id})">
                    Edit
                </button>

                <button class="btn btn-danger"
                    onclick="deleteProject(${project.id})">
                    Delete
                </button>
            </div>

        </div>
    `).join("");
}

function renderVentureCards(ventures) {
    const container = document.getElementById("admin-ventures");
    if (!container) return;
    
    container.innerHTML = ventures.map(venture => `
        <div class="admin-card">
            <div class="admin-card-body">
                <h3 class="admin-card-title">
                    ${venture.name}
                </h3>

                <p class="admin-card-desc">
                    ${venture.description}
                </p>
            </div>

            <div class="admin-card-actions">
                <button class="btn btn-secondary"
                    onclick="editVenture(${venture.id})">
                    Edit
                </button>

                <button class="btn btn-danger"
                    onclick="deleteVenture(${venture.id})">
                    Delete
                </button>
            </div>

        </div>
    `).join("");
}

function renderAchievementCards(achievements) {
    const container = document.getElementById("admin-achievements");
    if (!container) return;
    
    container.innerHTML = achievements.map(item => `
        <div class="admin-card">
            <div class="admin-card-body">
                <h3 class="admin-card-title">
                    ${item.title}
                </h3>

                <p class="admin-card-desc">
                    ${item.description}
                </p>
            </div>

            <div class="admin-card-actions">
                <button class="btn btn-secondary"
                    onclick="editAchievement(${item.id})">
                    Edit
                </button>

                <button class="btn btn-danger"
                    onclick="deleteAchievement(${item.id})">
                    Delete
                </button>
            </div>

        </div>
    `).join("");
}

function setupProjectSearch() {
    const searchInput = document.getElementById("project-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allProjectsData.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
        renderProjectCards(filtered);
    });
}

function setupVentureSearch() {
    const searchInput = document.getElementById("venture-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allVenturesData.filter(v => 
            v.name.toLowerCase().includes(query) || 
            (v.description && v.description.toLowerCase().includes(query))
        );
        renderVentureCards(filtered);
    });
}

function setupAchievementSearch() {
    const searchInput = document.getElementById("achievement-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allAchievementsData.filter(a => 
            a.title.toLowerCase().includes(query) || 
            (a.description && a.description.toLowerCase().includes(query))
        );
        renderAchievementCards(filtered);
    });
}

// Frontend data storage
let frontendProjectsData = [];
let frontendVenturesData = [];
let frontendAchievementsData = [];

/* =========================
   FRONTEND SEARCH & RENDER HELPERS
========================= */

function renderFrontendProjects(projects) {
    const container = document.getElementById("projects-grid");
    if (!container) return;
    
    container.innerHTML = projects.map(project => `
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

function renderFrontendVentures(ventures) {
    const container = document.getElementById("ventures-page-grid");
    if (!container) return;
    
    container.innerHTML = ventures.map(venture => `
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

function renderFrontendAchievements(achievements) {
    const container = document.getElementById("achievements-page-grid");
    if (!container) return;
    
    container.innerHTML = achievements.map(item => `
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

function setupFrontendProjectSearch() {
    const searchInput = document.getElementById("projects-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = frontendProjectsData.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
        renderFrontendProjects(filtered);
    });
}

function setupFrontendVentureSearch() {
    const searchInput = document.getElementById("ventures-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = frontendVenturesData.filter(v => 
            v.name.toLowerCase().includes(query) || 
            (v.description && v.description.toLowerCase().includes(query))
        );
        renderFrontendVentures(filtered);
    });
}

function setupFrontendAchievementSearch() {
    const searchInput = document.getElementById("achievements-search");
    if (!searchInput) return;
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = frontendAchievementsData.filter(a => 
            a.title.toLowerCase().includes(query) || 
            (a.description && a.description.toLowerCase().includes(query))
        );
        renderFrontendAchievements(filtered);
    });
}

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

    container.innerHTML = `

    <div class="project-page">

        <h1>
            ${data.title}
        </h1>

        <p>
            ${data.description}
        </p>

        ${data.image ? `
            <div class="achievement-image-block">
                <img
                    src="${data.image}"
                    alt="Certificate for ${data.title}"
                    class="achievement-image"
                    id="achievement-preview-image"
                    title="Click to toggle fullscreen"
                >
                <p class="achievement-image-hint">
                    Tap the certificate to enter or exit fullscreen.
                </p>
            </div>
        ` : ""}

    </div>

`;

    if (data.image) {
        const previewImage = document.getElementById("achievement-preview-image");

        if (previewImage && previewImage.requestFullscreen) {
            previewImage.addEventListener("click", async () => {
                try {
                    if (document.fullscreenElement === previewImage) {
                        await document.exitFullscreen();
                    } else {
                        await previewImage.requestFullscreen();
                    }
                } catch (err) {
                    console.warn("Fullscreen not available", err);
                }
            });
        }
    }
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
)

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load projects.</p>";

        return;
    }

    // Store data for search filtering
    frontendProjectsData = data;
    
    // Render the cards
    renderFrontendProjects(data);
    
    // Set up search
    setupFrontendProjectSearch();
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
    "created_at",
    { ascending: false }
)

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

    // Store data for search filtering
    frontendVenturesData = data;
    
    // Render the cards
    renderFrontendVentures(data);
    
    // Set up search
    setupFrontendVentureSearch();
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
    "created_at",
    { ascending: false }
)

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load achievements.</p>";

        return;
    }

    // Store data for search filtering
    frontendAchievementsData = data;
    
    // Render the cards
    renderFrontendAchievements(data);
    
    // Set up search
    setupFrontendAchievementSearch();
}


/* =========================
   ADMIN PROJECTS
========================= */

async function loadAdminProjects() {

    const container =
        document.getElementById(
            "admin-projects"
        );

    if (!container) return;
    
    // Clear search input
    const searchInput = document.getElementById("project-search");
    if (searchInput) searchInput.value = "";

    const { data, error } =
        await supabaseClient
            .from("projects")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Failed to load projects.</p>";

        return;
    }

    // Store data for search filtering
    allProjectsData = data;
    
    // Render the cards
    renderProjectCards(data);
    
    // Set up search
    setupProjectSearch();

}
async function createProject(event) {

    event.preventDefault();

    const title =
        document.getElementById(
            "title"
        ).value;

    const slug =
        document.getElementById(
            "slug"
        ).value;

    const description =
        document.getElementById(
            "description"
        ).value;

    

    const github_url =
        document.getElementById(
            "github"
        ).value;

    const live_url =
        document.getElementById(
            "live"
        ).value;

    const featured =
        document.getElementById(
            "featured"
        ).checked;


        let error;

if (editingProjectId) {

    const result =
        await supabaseClient
            .from("projects")
            .update({
                title,
                slug,
                description,
                image,
                github_url,
                live_url,
                featured
            })
            .eq(
                "id",
                editingProjectId
            );

    error = result.error;

} else {

    const result =
        await supabaseClient
            .from("projects")
            .insert([
                {
                    title,
                    slug,
                    description,
                    image,
                    github_url,
                    live_url,
                    featured
                }
            ]);

    error = result.error;

}
            ;

    if (error) {

    console.error(error);

    alert(
        editingProjectId
            ? "Failed to update project"
            : "Failed to create project"
    );

    return;
}

    alert(
    editingProjectId
        ? "Project updated"
        : "Project created"
);

    document
        .getElementById(
            "project-form"
        )
        .reset();
editingProjectId = null;

document.querySelector(
    "#project-form button"
).textContent =
    "Add Project";
    loadAdminProjects();

}

async function deleteProject(id) {

    const confirmed =
        confirm(
            "Delete this project?"
        );

    if (!confirmed) return;

    const { error } =
        await supabaseClient
            .from("projects")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert("Delete failed");

        return;
    }

    loadAdminProjects();

}

async function editProject(id) {

    const { data, error } =
        await supabaseClient
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

    if (error || !data) {

        console.error(error);

        return;
    }

    editingProjectId = id;

    document.getElementById(
        "title"
    ).value =
        data.title || "";

    document.getElementById(
        "slug"
    ).value =
        data.slug || "";

    document.getElementById(
        "description"
    ).value =
        data.description || "";

    document.getElementById(
        "image"
    ).value =
        data.image || "";

    document.getElementById(
        "github"
    ).value =
        data.github_url || "";

    document.getElementById(
        "live"
    ).value =
        data.live_url || "";

    document.getElementById(
        "featured"
    ).checked =
        data.featured || false;

    document.querySelector(
        "#project-form button"
    ).textContent =
        "Update Project";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* =========================
   ADMIN VENTURES
========================= */

async function loadAdminVentures() {

    const container =
        document.getElementById(
            "admin-ventures"
        );

    if (!container) return;
    
    // Clear search input
    const searchInput = document.getElementById("venture-search");
    if (searchInput) searchInput.value = "";

    const { data, error } =
        await supabaseClient
            .from("ventures")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        return;
    }

    // Store data for search filtering
    allVenturesData = data;
    
    // Render the cards
    renderVentureCards(data);
    
    // Set up search
    setupVentureSearch();

}


async function createVenture(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "venture-name"
        ).value;

    const slug =
        document.getElementById(
            "venture-slug"
        ).value;

    const description =
        document.getElementById(
            "venture-description"
        ).value;

    const website =
        document.getElementById(
            "venture-website"
        ).value;


    const featured =
        document.getElementById(
            "venture-featured"
        ).checked;

    let error;

    if (editingVentureId) {

        const result =
            await supabaseClient
                .from("ventures")
                .update({
                    name,
                    slug,
                    description,
                    website,
                    logo,
                    featured
                })
                .eq(
                    "id",
                    editingVentureId
                );

        error = result.error;

    } else {

        const result =
            await supabaseClient
                .from("ventures")
                .insert([
                    {
                        name,
                        slug,
                        description,
                        website,
                        logo,
                        featured
                    }
                ]);

        error = result.error;

    }

    if (error) {

        console.error(error);

        alert("Save failed");

        return;
    }

    alert(
        editingVentureId
            ? "Venture updated"
            : "Venture created"
    );

    document
        .getElementById(
            "venture-form"
        )
        .reset();

    editingVentureId = null;

    document.querySelector(
        "#venture-form button"
    ).textContent =
        "Add Venture";

    loadAdminVentures();

}


async function editVenture(id) {

    const { data, error } =
        await supabaseClient
            .from("ventures")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        console.error(error);

        return;
    }

    editingVentureId = id;

    document.getElementById(
        "venture-name"
    ).value =
        data.name || "";

    document.getElementById(
        "venture-slug"
    ).value =
        data.slug || "";

    document.getElementById(
        "venture-description"
    ).value =
        data.description || "";

    document.getElementById(
        "venture-website"
    ).value =
        data.website || "";

    document.getElementById(
        "venture-logo"
    ).value =
        data.logo || "";

    document.getElementById(
        "venture-featured"
    ).checked =
        data.featured || false;

    document.querySelector(
        "#venture-form button"
    ).textContent =
        "Update Venture";

}


async function deleteVenture(id) {

    if (
        !confirm(
            "Delete venture?"
        )
    ) return;

    const { error } =
        await supabaseClient
            .from("ventures")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert(
            "Delete failed"
        );

        return;
    }

    loadAdminVentures();

}

/* =========================
   ADMIN ACHIEVEMENTS
========================= */

async function loadAdminAchievements() {

    const container =
        document.getElementById(
            "admin-achievements"
        );

    if (!container) return;
    
    // Clear search input
    const searchInput = document.getElementById("achievement-search");
    if (searchInput) searchInput.value = "";

    const { data, error } =
        await supabaseClient
            .from("achievements")
            .select("*")
            .order(
                "achievement_date",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(error);

        return;
    }

    // Store data for search filtering
    allAchievementsData = data;
    
    // Render the cards
    renderAchievementCards(data);
    
    // Set up search
    setupAchievementSearch();

}


async function createAchievement(event) {

    event.preventDefault();

    const title =
        document.getElementById(
            "achievement-title"
        ).value;

    const slug =
        document.getElementById(
            "achievement-slug"
        ).value;

    const description =
        document.getElementById(
            "achievement-description"
        ).value;

    const image =
        document.getElementById(
            "achievement-image"
        ).value;

   ;

    const featured =
        document.getElementById(
            "achievement-featured"
        ).checked;

    let error;

    if (editingAchievementId) {

        const result =
            await supabaseClient
                .from("achievements")
                .update({
                    title,
                    slug,
                    description,
                    image,
                    featured
                })
                .eq(
                    "id",
                    editingAchievementId
                );

        error = result.error;

    } else {

        const result =
            await supabaseClient
                .from("achievements")
                .insert([
                    {
                        title,
                        slug,
                        description,
                        image,
                        
                        featured
                    }
                ]);

        error = result.error;

    }

    if (error) {

    console.error(
        JSON.stringify(
            error,
            null,
            2
        )
    );

    alert(
        error.message
    );

    return;
}

    alert(
        editingAchievementId
            ? "Achievement updated"
            : "Achievement created"
    );

    document
        .getElementById(
            "achievement-form"
        )
        .reset();

    editingAchievementId = null;

    document.querySelector(
        "#achievement-form button"
    ).textContent =
        "Add Achievement";

    loadAdminAchievements();

}


async function editAchievement(id) {

    const { data, error } =
        await supabaseClient
            .from("achievements")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        console.error(error);

        return;
    }

    editingAchievementId = id;

    document.getElementById(
        "achievement-title"
    ).value =
        data.title || "";

    document.getElementById(
        "achievement-slug"
    ).value =
        data.slug || "";

    document.getElementById(
        "achievement-description"
    ).value =
        data.description || "";

    document.getElementById(
        "achievement-image"
    ).value =
        data.image || "";

    document.getElementById(
        "achievement-date"
    ).value =
        data.achievement_date || "";

    document.getElementById(
        "achievement-featured"
    ).checked =
        data.featured || false;

    document.querySelector(
        "#achievement-form button"
    ).textContent =
        "Update Achievement";

}


async function deleteAchievement(id) {

    if (
        !confirm(
            "Delete achievement?"
        )
    ) return;

    const { error } =
        await supabaseClient
            .from("achievements")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert(
            "Delete failed"
        );

        return;
    }

    loadAdminAchievements();

}

/* =========================
   ADMIN DASHBOARD
========================= */

async function loadDashboardStats() {

    const projectsCount =
        document.getElementById(
            "projects-count"
        );

    if (!projectsCount) return;

    const {
        count: projectTotal
    } =
        await supabaseClient
            .from("projects")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

    const {
        count: ventureTotal
    } =
        await supabaseClient
            .from("ventures")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

    const {
        count: achievementTotal
    } =
        await supabaseClient
            .from("achievements")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

    document.getElementById(
        "projects-count"
    ).textContent =
        projectTotal || 0;

    document.getElementById(
        "ventures-count"
    ).textContent =
        ventureTotal || 0;

    document.getElementById(
        "achievements-count"
    ).textContent =
        achievementTotal || 0;

}

/* =========================
   ADMIN LOGIN
========================= */

async function login(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "login-email"
        ).value;

    const password =
        document.getElementById(
            "login-password"
        ).value;

    const { error } =
        await supabaseClient.auth.signInWithPassword({

            email,
            password

        });

    if (error) {

        alert(
            error.message
        );

        return;
    }

    window.location.href =
        "dashboard.html";

}
/* =========================
   AUTH GUARD
========================= */

async function protectAdminPage() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth.getSession();

    const isAdminPage =

        window.location.pathname.includes(
            "/admin/"
        )

        &&

        !window.location.pathname.includes(
            "login.html"
        );

    if (
        isAdminPage &&
        !session
    ) {

        window.location.href =
            "login.html";

    }

}

/* =========================
   LOGOUT
========================= */

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href =
        "login.html";

}

/* =========================
   ACHIEVEMENT IMAGE UPLOAD
========================= */

async function uploadAchievementImage() {

    const fileInput =
        document.getElementById(
            "achievement-image-file"
        );

    if (
        !fileInput ||
        !fileInput.files.length
    ) return;

    const file =
        fileInput.files[0];

    const fileName =
        Date.now() +
        "-" +
        file.name;

    const { error } =
        await supabaseClient
            .storage
            .from(
                "portfolio-images"
            )
            .upload(
                fileName,
                file
            );

    if (error) {

        console.error(error);

        alert(
            error.message
        );

        return;

    }

    const { data } =
        supabaseClient
            .storage
            .from(
                "portfolio-images"
            )
            .getPublicUrl(
                fileName
            );

    document.getElementById(
        "achievement-image"
    ).value =
        data.publicUrl;

    alert(
        "Certificate uploaded successfully"
    );

}