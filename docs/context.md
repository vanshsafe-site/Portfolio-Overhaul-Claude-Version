# PORTFOLIO OVERHAUL PROJECT CONTEXT

Version: 1.0
Author: Vansh Garg
Last Updated: June 2026

---

# INTRODUCTION

This document exists to provide complete context for the Portfolio Overhaul project.

The purpose of this document is to ensure that future development sessions, AI assistants, contributors, and the project owner can understand the project's goals, architecture, scope, constraints, decisions, roadmap, and philosophy without requiring prior conversation history.

This document should be treated as the primary source of truth for the project.

Whenever uncertainty exists regarding project direction, this document should be consulted before making architectural decisions.

---

# PROJECT NAME

Portfolio Overhaul

Alternative Internal Name:

Personal Portfolio CMS

---

# PROJECT PURPOSE

The original portfolio was built using static HTML pages containing hardcoded content.

Examples include:

* Hardcoded projects
* Hardcoded achievements
* Hardcoded prompts
* Hardcoded certifications
* Hardcoded profile information
* Hardcoded navigation

Every content update required direct modification of HTML files.

This approach became increasingly difficult to maintain.

The purpose of this project is to transform the portfolio from a collection of static pages into a maintainable, scalable, database-driven portfolio platform while retaining simplicity.

This project is intentionally NOT intended to become an enterprise application.

The objective is sensible scaling rather than excessive complexity.

---

# PROJECT PHILOSOPHY

The following principles must guide development.

## Principle 1: Simplicity Over Complexity

Avoid introducing technologies that create unnecessary maintenance burden.

If a feature can be implemented with HTML, CSS, JavaScript, and Supabase, that approach should be preferred.

Avoid technology for the sake of technology.

---

## Principle 2: Learnability

The owner of this project wants to fully understand every part of the stack.

The project should remain understandable to someone comfortable with:

* HTML
* CSS
* JavaScript

The project should not require advanced framework knowledge merely to perform routine maintenance.

---

## Principle 3: Scalability Through Structure

The project should scale through good organization rather than through increasing technical complexity.

Examples:

GOOD:

* Reusable CSS system
* Reusable JS system
* Database-driven content

BAD:

* Multiple frameworks
* Unnecessary build tools
* Excessive abstraction

---

## Principle 4: Functionality Before Beauty

Development order:

1. Functionality
2. Data architecture
3. Administration
4. Automation
5. Visual polish

The website should work correctly before visual refinement begins.

---

# CURRENT TECHNOLOGY STACK

Frontend:

* HTML5
* CSS3
* Vanilla JavaScript

Backend:

* Supabase

Database:

* PostgreSQL via Supabase

Authentication:

* Supabase Auth

Storage:

* Supabase Storage

Hosting:

* Vercel

Version Control:

* Git
* GitHub

Repository:

Portfolio-Overhaul

---

# EXPLICITLY REJECTED TECHNOLOGIES

The following technologies are intentionally not part of Version 1.

* React
* Next.js
* Angular
* Vue
* Docker
* Kubernetes
* Prisma
* Redis
* Express
* NestJS

These technologies may be reconsidered in future versions but are currently excluded.

---

# PROJECT DIRECTORY STRUCTURE

Current Structure:

portfolio/

├── index.html
├── projects.html
├── project.html
├── achievements.html
├── about.html
├── contact.html

├── css/
│   └── style.css

├── js/
│   └── app.js

├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/

├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── achievements.html
│   └── settings.html

├── docs/
│   ├── roadmap.md
│   ├── database.md
│   └── project-context.md

---

# WEBSITE GOALS

The portfolio should communicate:

1. Technical capability
2. Creativity
3. Builder mindset
4. Long-term growth
5. Project ownership

The portfolio should not resemble a generic template.

It should reflect an active builder who creates software, experiments, educational tools, and technology projects.

---

# TARGET AUDIENCE

Primary:

* Recruiters
* Collaborators
* Freelance clients

Secondary:

* Students
* Developers
* Technology enthusiasts

---

# HOME PAGE STRUCTURE

The current planned homepage structure is:

Navbar

Hero

Featured Projects

Ventures

Achievements

Contact CTA

Footer

---

# NAVIGATION STRUCTURE

Current Planned Navigation:

Home

Projects

Achievements

About

Contact

Additional links may be added later.

---

# HOME PAGE HERO PHILOSOPHY

The hero section should communicate identity immediately.

Core themes:

* Developer
* Builder
* Diploma CSE Student
* Software Creator
* Technology Enthusiast

The hero should avoid buzzword overload.

The hero should feel authentic.

---

# DATABASE PHILOSOPHY

The database exists to eliminate hardcoded content.

Every major content item should eventually originate from Supabase.

The database should remain simple and understandable.

---

# INITIAL DATABASE TABLES

Version 1 Tables:

site_settings

projects

ventures

achievements

---

# SITE_SETTINGS TABLE

Purpose:

Store portfolio owner information.

Fields:

id

name

headline

bio

profile_image

email

phone

github

linkedin

resume_url

---

# PROJECTS TABLE

Purpose:

Store portfolio projects.

Fields:

id

title

slug

description

image

github_url

live_url

featured

created_at

---

# VENTURES TABLE

Purpose:

Store larger initiatives and brands.

Examples:

CLOXURE

VectorJS

Future ventures

Fields:

id

name

description

website

logo

featured

---

# ACHIEVEMENTS TABLE

Purpose:

Store certifications, milestones, awards, and accomplishments.

Fields:

id

title

description

date

image

featured

---

# ADMIN PANEL PHILOSOPHY

The admin dashboard exists so that future updates require no HTML editing.

The owner should be able to:

Create projects

Edit projects

Delete projects

Create achievements

Edit achievements

Delete achievements

Modify profile information

Upload images

Manage links

Without touching source code.

---

# ADMIN PANEL STRUCTURE

/admin/login.html

/admin/dashboard.html

/admin/projects.html

/admin/achievements.html

/admin/settings.html

---

# CSS PHILOSOPHY

The project intentionally uses a single CSS file.

File:

css/style.css

Reasons:

* Easier maintenance
* Easier learning
* Easier debugging

The file should remain organized using section comments.

Example:

VARIABLES

RESET

TYPOGRAPHY

LAYOUT

NAVBAR

HERO

BUTTONS

CARDS

FOOTER

ADMIN

RESPONSIVE

---

# JAVASCRIPT PHILOSOPHY

The project intentionally uses a single JavaScript file.

File:

js/app.js

Reasons:

* Simplicity
* Learnability
* Centralized maintenance

The file should remain organized using sections.

Example:

CONFIG

THEME

NAVIGATION

SUPABASE

PROJECTS

ACHIEVEMENTS

SETTINGS

ADMIN

---

# DARK MODE REQUIREMENT

Dark mode is mandatory.

Requirements:

* Theme toggle
* Theme persistence
* Local storage support

The selected theme must persist between page loads.

---

# SEO PHILOSOPHY

SEO is a first-class requirement.

Every page should include:

Title

Meta Description

Keywords

Open Graph metadata

Canonical URL

Semantic HTML

Proper heading hierarchy

Accessible alt text

---

# VERSION 1 DEVELOPMENT ORDER

Phase 1

Project setup

Git setup

Folder structure

Homepage foundation

---

Phase 2

Homepage functionality

Navigation

Responsive layout

Theme system

Reusable components

---

Phase 3

Supabase setup

Database creation

Authentication

Data retrieval

---

Phase 4

Projects system

Projects page

Individual project page

Project management

---

Phase 5

Achievements system

Achievement management

Achievement display

---

Phase 6

Admin dashboard

Authentication

CRUD operations

Media uploads

Settings management

---

Phase 7

SEO

Sitemap

Metadata

Structured data

Performance optimization

---

Phase 8

Visual refinement

Animations

Micro-interactions

Design polish

---

# IMPORTANT REMINDER FOR FUTURE DEVELOPMENT

This project is intentionally designed around:

HTML

CSS

JavaScript

Supabase

The goal is not to build the most technologically complex portfolio possible.

The goal is to build the most maintainable, scalable, understandable portfolio possible while remaining enjoyable to work on.

Whenever future development decisions are made, simplicity should be favored unless complexity provides clear measurable benefits.

End of Document.
