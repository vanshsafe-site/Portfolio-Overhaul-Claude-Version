document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById(
                "download-pdf"
            )
            .addEventListener(
                "click",
                downloadPDF
            );

        document
            .getElementById(
                "download-docx"
            )
            .addEventListener(
                "click",
                downloadDOCX
            );

    }
);

async function fetchResumeData() {

    const {
        data: projects
    } =
    await supabaseClient
        .from("projects")
        .select("*");

    const {
        data: ventures
    } =
    await supabaseClient
        .from("ventures")
        .select("*");

    const {
        data: achievements
    } =
    await supabaseClient
        .from("achievements")
        .select("*");

    return {

        projects:
            projects || [],

        ventures:
            ventures || [],

        achievements:
            achievements || []

    };

}

async function buildResumeHTML() {

    const {

        projects,
        ventures,
        achievements

    } =
    await fetchResumeData();

    return `

        <h1>
            Vansh Garg
        </h1>

        <p>

            Diploma Computer Science Engineering Student

        </p>

        <p>

            ICSE Class 10:
            94%

            <br>

            St. Joseph's College Prayagraj

        </p>

        <hr>

        <h2>
            Contact
        </h2>

        <p>

            Email:
            vanshgargvlcontact@gmail.com

            <br>

            Phone:
            +91 8604645520

            <br>

            GitHub:
            github.com/vanshsafe-site

            <br>

            LinkedIn:
            linkedin.com/in/vansh-garg-vl777

        </p>

        <hr>

        <h2>
            Projects
        </h2>

        <ul>

            ${projects
                .map(
                    p =>
                    `<li>${p.title}</li>`
                )
                .join("")}

        </ul>

        <hr>

        <h2>
            Ventures
        </h2>

        <ul>

            ${ventures
                .map(
                    v =>
                    `<li>${v.name}</li>`
                )
                .join("")}

        </ul>

        <hr>

        <h2>
            Achievements
        </h2>

        <ul>

            ${achievements
                .map(
                    a =>
                    `<li>${a.title}</li>`
                )
                .join("")}

        </ul>

    `;

}

async function downloadPDF() {

    const html =
        await buildResumeHTML();

    const container =
        document.getElementById(
            "resume-template"
        );

    container.innerHTML =
        html;

    container.style.display =
        "block";

    await html2pdf()
        .set({

            filename:
                "Vansh-Garg-Resume.pdf",

            margin: 0.5,

            html2canvas: {
                scale: 2
            }

        })
        .from(container)
        .save();

    container.style.display =
        "none";

}

async function downloadDOCX() {

    const {

        projects,
        ventures,
        achievements

    } =
    await fetchResumeData();

    const doc =
        new docx.Document({

            sections: [

                {

                    children: [

                        new docx.Paragraph({

                            text:
                                "Vansh Garg",

                            heading:
                                docx.HeadingLevel.TITLE

                        }),

                        new docx.Paragraph(
                            "Diploma Computer Science Engineering Student"
                        ),

                        new docx.Paragraph(
                            "ICSE Class 10 - 94%"
                        ),

                        new docx.Paragraph(
                            "St. Joseph's College Prayagraj"
                        ),

                        new docx.Paragraph(""),

                        new docx.Paragraph({
                            text:
                                "Projects",
                            heading:
                                docx.HeadingLevel.HEADING_1
                        }),

                        ...projects.map(
                            project =>
                                new docx.Paragraph(
                                    project.title
                                )
                        ),

                        new docx.Paragraph({
                            text:
                                "Ventures",
                            heading:
                                docx.HeadingLevel.HEADING_1
                        }),

                        ...ventures.map(
                            venture =>
                                new docx.Paragraph(
                                    venture.name
                                )
                        ),

                        new docx.Paragraph({
                            text:
                                "Achievements",
                            heading:
                                docx.HeadingLevel.HEADING_1
                        }),

                        ...achievements.map(
                            achievement =>
                                new docx.Paragraph(
                                    achievement.title
                                )
                        )

                    ]

                }

            ]

        });

    const blob =
        await docx.Packer
            .toBlob(doc);

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "Vansh-Garg-Resume.docx";

    link.click();

}