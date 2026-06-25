/* =========================
   RESUME BUILDER
========================= */

let resumeProjects = [];
let resumeVentures = [];
let resumeAchievements = [];

/* =========================
   INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initResume
);

async function initResume() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase not loaded."
        );
        return;
    }

    await loadResumeData();

}

/* =========================
   LOAD DATA
========================= */

async function loadResumeData() {

    setStatus(
        "Loading portfolio data...",
        "loading"
    );

    const [
        projectsResponse,
        venturesResponse,
        achievementsResponse
    ] = await Promise.all([

        supabaseClient
            .from("projects")
            .select("*"),

        supabaseClient
            .from("ventures")
            .select("*"),

        supabaseClient
            .from("achievements")
            .select("*")

    ]);

    if (
        projectsResponse.error ||
        venturesResponse.error ||
        achievementsResponse.error
    ) {

        console.error(
            projectsResponse.error,
            venturesResponse.error,
            achievementsResponse.error
        );

        setStatus(
            "Failed to load portfolio data.",
            "error"
        );

        return;
    }

    resumeProjects =
        projectsResponse.data || [];

    resumeVentures =
        venturesResponse.data || [];

    resumeAchievements =
        achievementsResponse.data || [];

    updateStatistics();

    document
        .getElementById(
            "btn-preview"
        )
        ?.removeAttribute(
            "disabled"
        );

    setStatus(
        "Portfolio data loaded. Click Preview Resume.",
        "success"
    );

}

/* =========================
   STATISTICS
========================= */

function updateStatistics() {

    const projectsCount =
        document.getElementById(
            "stat-projects-count"
        );

    const venturesCount =
        document.getElementById(
            "stat-ventures-count"
        );

    const achievementsCount =
        document.getElementById(
            "stat-achievements-count"
        );

    if (projectsCount)
        projectsCount.textContent =
            resumeProjects.length;

    if (venturesCount)
        venturesCount.textContent =
            resumeVentures.length;

    if (achievementsCount)
        achievementsCount.textContent =
            resumeAchievements.length;

}

/* =========================
   PREVIEW BUTTON
========================= */

document
    .getElementById(
        "btn-preview"
    )
    ?.addEventListener(
        "click",
        generateResumePreview
    );

function generateResumePreview() {

    loadProjectsIntoResume();

    loadVenturesIntoResume();

    loadAchievementsIntoResume();

    enableExportButtons();

    updateGeneratedTime();

    setStatus(
        "Resume generated successfully.",
        "success"
    );

}

/* =========================
   PROJECTS
========================= */

function loadProjectsIntoResume() {

    const container =
        document.getElementById(
            "rd-projects-list"
        );

    if (!container) return;

    container.innerHTML =
        resumeProjects
            .slice(0, 10)
            .map(project => `

                <div class="rd-item">

                    <div class="rd-item-top">

                        <strong class="rd-item-name">
                            ${project.title}
                        </strong>

                    </div>

                    <p class="rd-item-desc">
                        ${project.description || ""}
                    </p>

                </div>

            `)
            .join("");

}

/* =========================
   VENTURES
========================= */

function loadVenturesIntoResume() {

    const container =
        document.getElementById(
            "rd-ventures-list"
        );

    if (!container) return;

    container.innerHTML =
        resumeVentures
            .map(venture => `

                <div class="rd-item">

                    <div class="rd-item-top">

                        <strong class="rd-item-name">
                            ${venture.name}
                        </strong>

                    </div>

                    <p class="rd-item-desc">
                        ${venture.description || ""}
                    </p>

                </div>

            `)
            .join("");

}

/* =========================
   ACHIEVEMENTS
========================= */

function loadAchievementsIntoResume() {

    const container =
        document.getElementById(
            "rd-achievements-list"
        );

    if (!container) return;

    container.innerHTML =
        resumeAchievements
            .map(item => `

                <div class="rd-item">

                    <div class="rd-item-top">

                        <strong class="rd-item-name">
                            ${item.title}
                        </strong>

                    </div>

                    <p class="rd-item-desc">
                        ${item.description || ""}
                    </p>

                </div>

            `)
            .join("");

}

/* =========================
   STATUS
========================= */

function setStatus(
    message,
    state
) {

    const text =
        document.getElementById(
            "resume-status-text"
        );

    if (text)
        text.innerHTML =
            message;

}

/* =========================
   EXPORT BUTTONS
========================= */

function enableExportButtons() {

    document
        .getElementById(
            "btn-download-pdf"
        )
        ?.removeAttribute(
            "disabled"
        );

    document
        .getElementById(
            "btn-download-docx"
        )
        ?.removeAttribute(
            "disabled"
        );

    document
        .getElementById(
            "btn-export-pdf-inline"
        )
        ?.removeAttribute(
            "disabled"
        );

    document
        .getElementById(
            "btn-export-docx-inline"
        )
        ?.removeAttribute(
            "disabled"
        );

}

/* =========================
   TIMESTAMP
========================= */

function updateGeneratedTime() {

    const wrapper =
        document.getElementById(
            "resume-last-generated"
        );

    const time =
        document.getElementById(
            "resume-gen-time"
        );

    if (!wrapper || !time)
        return;

    const now =
        new Date();

    time.textContent =
        now.toLocaleString();

    time.dateTime =
        now.toISOString();

    wrapper.hidden =
        false;

}