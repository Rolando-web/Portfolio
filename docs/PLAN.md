# Portfolio Redesign & Project Integration — Phased Plan

> **Project:** Personal Web Developer Portfolio
> **Goal:** Showcase TravelConnect and Canson with real screenshots, redesign the site around a monochrome "Paper Graphite" grid aesthetic, and reorganize the repository into a standard file structure — without altering the projects or existing behavior.
> **Owner:** Luocon
> **Created:** 2026-11-09
> **Status:** Planning complete — awaiting build agent

> **Superseding note (2026-11-10):** The original plan kept a top header and a
> Swiper project slider. The first implementation used a fixed left rail,
> asymmetric bento grid, and certificate ledger; Swiper was removed and the
> custom modal carousel remains. Where this document mentions Swiper or the
> rail, treat it as historical context.

> **Final direction (2026-11-10):** The rail/bento pass was itself replaced by
> an editorial-dossier layout: fixed masthead, full-screen index overlay,
> full-bleed alternating project plates, dark Canson spread, credential ledger,
> and a dark contact/footer spread. The 20px grid, monochrome palette, content,
> and behaviour constraints below still apply.

---

## 1. Objectives

1. Reorganize the repository into a standard, category-based file structure.
2. Add **TravelConnect** and **Canson** as showcase projects with accurate content and real screenshots.
3. Redesign the portfolio shell with a balanced grey monochrome system and a grid background.
4. Keep every existing behavior working: project modal, image carousel, Swiper, keyboard controls, EmailJS contact form, navigation.
5. Add a reusable request rate limiter so the contact form — and any future request — cannot be spammed.
6. Verify the result through explicit testing phases before calling it done.

## 2. Non-Negotiables

- Do **not** change project titles, descriptions, image arrays, or live URLs once approved.
- Do **not** break `data-title`, `data-description`, `data-images`, `data-url` attributes.
- Do **not** rewrite the modal/carousel/Swiper logic — relocate it, then test it.
- Do **not** remove sections or section IDs (`#intro`, `#projects`, `#certificates`, `#contact`).
- Do **not** write credentials into any file, screenshot, log, commit, or console output.
- Do **not** introduce bright accent colors. Screenshots are the only color on the page.
- Do **not** leave loose assets at the repo root. Every file lives in its designated category folder.
- Do **not** delete an old file until a repository-wide search confirms it is no longer referenced.
- Do **not** present client-side throttling as real server-side security; document the limitation honestly.
- Do **not** let the limiter silently swallow legitimate submissions; always show accessible feedback.

## 3. Locked Decisions

| Decision | Value |
|---|---|
| Theme | **Paper Graphite** (light warm-grey monochrome) |
| Canvas | `#E6E5E0` |
| Surface | `#EFEEE9` |
| Ink | `#1A1A18` |
| Muted | `#6E6E68` |
| Line | `rgba(26, 26, 24, 0.12)` |
| Accent | None (screenshots provide color) |
| Grid | 1px lines, 40px module, major line every 5 cells, radial fade, slow drift |
| Corners | 2–4px (sharp, not rounded-2xl) |
| Screenshots | 5 per project at 1440×900 |
| Motion | Restrained; full `prefers-reduced-motion` support |
| Contact rate limit | 1 submission / 60s, max 3 per rolling 10 minutes |
| Limiter storage | `localStorage`, with in-memory fallback |
| Extra form guards | Honeypot, 3s minimum fill time, input length caps |
| Protection level | Client-side limiter + EmailJS origin rules (no CAPTCHA/proxy in scope) |
| Project list | LMS + TravelConnect + Canson; remove the 4 placeholders (owner confirmation at Phase 3) |
| Tailwind | Local build with `@tailwindcss/cli`; remove the CDN script |
| Mobile nav | Add hamburger + drawer (does not exist today) |
| Contact handler | New `src/js/contact-form.js`; retire the missing `email.js` |
| Config | Commit `src/js/config.example.js`; gitignore `src/js/config.js` |
| Deployment | Owner confirms host; add headers/config for that host |

---

## 3.1 Repository Gap Audit (verified 2026-11-09)

| # | Finding | Severity | Location |
|---|---|---|---|
| 1 | `email.js` is referenced but does not exist and is gitignored. `submitMail()` is undefined, so the contact form sends nothing. | **Blocker** | `index.html:465,518` |
| 2 | No mobile navigation: links are `hidden md:flex` with no hamburger or drawer. | High | `index.html:33-38` |
| 3 | Contact form has no handler wiring, validation, or success/error region. | High | `index.html:416-466` |
| 4 | Modal lacks `role="dialog"`, `aria-modal`, accessible name, focus trap; icon-only buttons lack labels. | High (a11y) | `index.html:472-509` |
| 5 | Four of five projects are placeholders (`example.com`, `via.placeholder.com`). | Medium | `index.html` |
| 6 | Tailwind CDN is loaded while `@tailwindcss/cli` is installed but unused. | Medium | `index.html:7`, `package.json` |
| 7 | No description, canonical, Open Graph, Twitter card, or JSON-LD. | Medium | `<head>` |
| 8 | Images lack `width`/`height` and lazy loading; paths use `/images/...` and `%20`. | Medium | project/cert images |
| 9 | `mailto:` points to `your.email@example.com` while the visible email differs. | Medium | `index.html:379` |
| 10 | Carousel auto-slides on hover/focus and ignores `prefers-reduced-motion`. | Medium (a11y) | `script.js:117-128` |
| 11 | `.gitignore` hides `email.js` and `.api`; no config example or setup docs. | Medium | `.gitignore` |
| 12 | No deployment config, cache headers, CSP, or rollback plan. | Medium | — |

---

## 4. File & Folder Standard

### 4.1 Target structure

```text
Portfolio/
├── index.html                 # single page entry
├── README.md                  # project overview + run instructions
├── package.json
├── package-lock.json
├── .gitignore
│
├── assets/                    # everything static the page consumes
│   ├── css/
│   │   └── tailwind.css       # generated by the Tailwind CLI (committed)
│   ├── images/
│   │   ├── brand/
│   │   │   └── webicon.png
│   │   ├── profile/
│   │   │   └── profile.png
│   │   ├── certificates/
│   │   │   ├── css.png
│   │   │   ├── database.png
│   │   │   ├── html-css.png
│   │   │   └── java.png
│   │   └── projects/
│   │       ├── lms/
│   │       │   ├── 01-....png
│   │       │   └── ...            # 14 screenshots, renamed to a sequence
│   │       ├── travelconnect/
│   │       │   ├── 01-home.png
│   │       │   ├── 02-flights.png
│   │       │   ├── 03-hotels.png
│   │       │   ├── 04-deals.png
│   │       │   └── 05-admin-dashboard.png
│   │       └── canson/
│   │           ├── 01-login.png
│   │           ├── 02-dashboard.png
│   │           ├── 03-orders.png
│   │           ├── 04-assignments.png
│   │           └── 05-analytics.png
│   │
│   └── fonts/                 # only if fonts are self-hosted; omit for Google Fonts CDN
│
├── src/                       # authored source
│   ├── css/
│   │   ├── tailwind.css       # Tailwind input: @import "tailwindcss";
│   │   ├── main.css           # entry: imports the partials below, nothing else
│   │   ├── tokens.css         # colors, spacing, radii, typography scale
│   │   ├── base.css           # reset, body, typography, grid background
│   │   ├── layout.css         # containers, section rhythm, nav, footer
│   │   ├── components.css     # cards, buttons, forms, modal, certificates
│   │   └── animations.css     # keyframes, reveal states, reduced-motion overrides
│   └── js/
│       ├── main.js            # entry: imports and initializes modules
│       ├── config.example.js  # committed template for EmailJS identifiers
│       ├── config.js          # local only, gitignored, real identifiers
│       ├── navigation.js      # mobile menu, scroll progress, anchor handling
│       ├── swiper-init.js     # project carousel setup only
│       ├── project-modal.js   # open/close, carousel, indicators, keyboard
│       ├── reveal.js          # IntersectionObserver scroll reveals
│       ├── rate-limit.js      # reusable request throttle + cooldown
│       └── contact-form.js    # validation + EmailJS submission
│
├── scripts/                   # developer tooling, never shipped to the page
│   ├── capture-screenshots.mjs
│   └── optimize-images.mjs    # optional
│
└── docs/                      # documentation and QA artifacts
    ├── PLAN.md                # copy of this plan
    ├── DESIGN-SYSTEM.md       # tokens, components, motion rules
    ├── CONTENT.md             # approved project copy — source of truth
    ├── OWNER-ACTIONS.md       # account/hosting tasks only the owner can do
    └── QA-CHECKLIST.md        # per-phase test results
```

### 4.2 Naming rules

| Type | Rule | Example |
|---|---|---|
| Folders | lowercase, kebab-case | `travelconnect/`, `certificates/` |
| Images | lowercase, kebab-case, zero-padded index | `01-home.png` |
| CSS | one concern per file | `components.css` |
| JS | one feature per module | `project-modal.js` |
| Docs | UPPER-KEBAB for top-level docs | `QA-CHECKLIST.md` |
| Root | only entry files and config | `index.html`, `package.json` |

Additional rules:
- No file should grow past ~300 lines; split by responsibility if it does.
- One concern per CSS file and one feature per JS module.
- No screenshots, PDFs, or experimental assets at the root.
- Empty folders are not committed; create a folder only when adding its first file.
- Test notes live in `docs/QA-CHECKLIST.md`, not in ad-hoc root files.

### 4.3 Migration map

| Current | New | References to update |
|---|---|---|
| `images/webicon.png` | `assets/images/brand/webicon.png` | `<link rel="icon">` |
| `images/profile/profile.png` | `assets/images/profile/profile.png` | hero `<img src>` |
| `images/cert/*.png` | `assets/images/certificates/*.png` | 4 certificate `<img src>` |
| `images/LMS/*.png` | `assets/images/projects/lms/*.png` | LMS `data-images` array |
| `src/style.css` | `src/css/main.css` + 5 partials | `<link rel="stylesheet">` |
| `script.js` | `src/js/main.js` + 5 modules | `<script type="module">` |
| — | `scripts/capture-screenshots.mjs` | new `capture` npm script |
| — | `docs/PLAN.md`, `DESIGN-SYSTEM.md`, `QA-CHECKLIST.md` | none |

Notes:
- LMS screenshots keep their content; rename them to `01`…`14` after reviewing each, or keep original names if renaming would risk mislabeling.
- `data-images` must remain valid JSON inside single quotes.
- `@import` statements in `main.css` must come before any other rules.
- Module scripts execute in document order; keep the deferred Swiper CDN script **above** the module entry so `window.Swiper` exists.

---

## 5. Phase Overview

| Phase | Name | Type | Gate |
|---|---|---|---|
| 0 | Setup & safety net | Prep | Baseline captured, branch created |
| 1 | Restructure into the standard file layout | Build | Structure, restored contact handler, and local Tailwind verified |
| 2 | Prepare project assets | Build | Screenshots saved, or Canson deferral documented |
| 3 | Add TravelConnect & Canson to portfolio | Build | Both cards render with correct data |
| 4 | Test project integration | Test | Content, links, modal, carousel all pass |
| 5 | Build the Paper Graphite foundation | Build | Tokens, fonts, grid, base layout in place |
| 6 | Reskin all sections | Build | Every section matches the system |
| 7 | Rate limiting & request protection | Build | Spam attempts blocked with feedback |
| 8 | Motion & interaction polish | Build | Animations run and respect reduced motion |
| 9 | Responsive & cross-browser testing | Test | 360px → 1920px pass |
| 10 | Functional regression testing | Test | All interactive features pass |
| 11 | Accessibility & performance testing | Test | A11y and Lighthouse targets met |
| 12 | Final verification & release | Test | Definition of Done satisfied |

A phase may not start until the previous phase's gate is signed off.

---

## Phase 0 — Setup & Safety Net

**Purpose:** Make every later change reversible and measurable.

### Tasks
- [ ] Run `git status` and confirm the working tree state.
- [ ] Create branch: `git checkout -b redesign/paper-graphite`.
- [ ] Take a full-page screenshot of the current site as the "before" baseline.
- [ ] Confirm Chrome path: `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- [ ] Install capture dependency: `npm i -D puppeteer-core` (uses installed Chrome, no download).
- [ ] Inventory every file and its references:
  - `src`, `href`, `data-images`, and CSS `url(...)` occurrences.
  - Record them so Phase 1 can be verified.
- [ ] Review the Section 3.1 gap audit and confirm it is complete.
- [ ] Capture the owner inputs listed in Section 10.
- [ ] Confirm write access to `assets/`, `src/`, `scripts/`, `docs/`.

### Deliverable
- Branch, baseline screenshot, reference inventory, headless capture available.

### Gate 0
- [ ] Branch exists and baseline is saved.
- [ ] `puppeteer-core` launches installed Chrome.
- [ ] Reference inventory documented in `docs/QA-CHECKLIST.md`.

---

## Phase 1 — Restructure into the Standard File Layout

**Purpose:** Move everything into its designated category first, so later phases add files to a clean structure instead of a crowded root.

### 1A — Create folders
- [ ] `assets/images/brand/`
- [ ] `assets/images/profile/`
- [ ] `assets/images/certificates/`
- [ ] `assets/images/projects/lms/`
- [ ] `assets/images/projects/travelconnect/`
- [ ] `assets/images/projects/canson/`
- [ ] `src/css/`
- [ ] `src/js/`
- [ ] `scripts/`
- [ ] `docs/`

### 1B — Move images (paths first, then delete originals)
- [ ] Move brand, profile, certificate images.
- [ ] Move LMS screenshots into `assets/images/projects/lms/`.
- [ ] Rename LMS screenshots to `01-…` → `14-…`, or keep originals if naming cannot be verified.
- [ ] Update every reference in `index.html`.
- [ ] Confirm zero 404s in DevTools before removing the old `images/` tree.

### 1C — Split CSS
- [ ] Create `tokens.css`, `base.css`, `layout.css`, `components.css`, `animations.css`.
- [ ] Create `main.css` containing only `@import` lines in cascade order.
- [ ] Move existing rules into the correct partial without changing behavior.
- [ ] Update the `<link>` to `./src/css/main.css`.

### 1D — Split JavaScript
- [ ] Create `navigation.js`, `swiper-init.js`, `project-modal.js`, `reveal.js`, `contact-form.js`.
- [ ] Create `main.js` that imports and initializes each module.
- [ ] Move logic **verbatim** — no refactors during the move.
- [ ] Update the script tag to `type="module"` and keep it below the Swiper CDN script.
- [ ] Verify EmailJS still initializes before `contact-form.js` runs.

### 1E — Tooling & docs
- [ ] Move the capture script to `scripts/capture-screenshots.mjs`.
- [ ] Add npm script: `"capture": "node scripts/capture-screenshots.mjs"`.
- [ ] Create `docs/PLAN.md` (copy of this plan), `docs/DESIGN-SYSTEM.md`, `docs/QA-CHECKLIST.md`.
- [ ] Add or update `README.md` with run and capture instructions.
- [ ] Update `.gitignore` for capture output/profile folders if needed.

### 1F — Restore the missing contact handler
- [ ] Create `src/js/config.example.js` with placeholder `serviceId`, `templateId`, and `publicKey`.
- [ ] Create `src/js/config.js` locally from the example; add it to `.gitignore`.
- [ ] Create `src/js/contact-form.js` with:
  - submit listener (remove the inline `onclick="submitMail()"`)
  - `emailjs.send` using the config values
  - field validation, trimming, and length caps
  - button loading/disabled state
  - success and error messages in an `aria-live` region
  - no rate limiting yet — that lands in Phase 7
- [ ] Move `emailjs.init` into the module or a config bootstrap.
- [ ] Remove the `<script src="email.js">` tag and the stale ignore rule.
- [ ] Fix the `mailto:` href to match the visible address.
- [ ] Send one real test message to confirm delivery.
- [ ] If the owner cannot supply the EmailJS identifiers, ship the handler disabled and log the blocker in `docs/OWNER-ACTIONS.md`.

### 1G — Build Tailwind locally
- [ ] Create `src/css/tailwind.css` with `@import "tailwindcss";`.
- [ ] Configure content sources: `index.html` and `src/js/**/*.js`.
- [ ] Build to `assets/css/tailwind.css`.
- [ ] Add npm scripts: `build:css` and `watch:css`.
- [ ] Replace the CDN script with a `<link>` to the built file.
- [ ] Verify every existing utility still renders (compare against the baseline screenshot).

### 1H — Cleanup
- [ ] Search the repo for old paths (`images/LMS`, `src/style.css`, `script.js`, `email.js`).
- [ ] Delete originals only after search returns no live references.
- [ ] Update `.gitignore`: add `src/js/config.js`, `.env`, and `capture-profile/`; remove the obsolete `email.js` rule.
- [ ] Confirm no orphaned or duplicate assets remain.

### Gate 1
- [ ] Site loads with no visual change.
- [ ] No 404s or console errors.
- [ ] Navigation, Swiper, modal carousel, keyboard controls, and contact form all work.
- [ ] Contact form sends a real test message (or is explicitly disabled with the blocker documented).
- [ ] `src/js/config.js` is gitignored; `config.example.js` is committed.
- [ ] Tailwind builds locally with no CDN script and utilities match the baseline.
- [ ] `grep` finds no references to the old paths.
- [ ] Root contains only entry files and config.

---

## Phase 2 — Prepare Project Assets (Screenshots)

**Purpose:** Capture real, consistent screenshots straight into their final folders.

### 2A — TravelConnect

Public URL: `https://travel-connect-xi.vercel.app/`

- [ ] Capture at `1440×900`, device scale 1, wait for network idle + 1.5s hydration (React SPA).
- [ ] Save to `assets/images/projects/travelconnect/`:
  - `01-home.png` — landing page / hero
  - `02-flights.png` — flight search or results
  - `03-hotels.png` — hotel listing
  - `04-deals.png` — packages / deals
  - `05-admin-dashboard.png` — Super Admin dashboard
- [ ] Admin capture: log in inside the automated browser session only.
  - Credentials passed via environment variables or interactive prompt.
  - Never echo, log, screenshot, or commit them.
  - Clear the browser profile after capture.
- [ ] Review each image: no browser chrome, no dev overlays, no personal data.

### 2B — Canson

URL: `https://canson-s-order-tracking-and-workforce.onrender.com/`

- [ ] Retry until the Render service responds (cold start: 60–120s).
- [ ] If still unreachable, record the chosen fallback:
  - **A:** run locally with seeded data.
  - **B:** use owner-supplied screenshots.
  - **C:** defer Canson to a follow-up and ship TravelConnect now.
- [ ] Save to `assets/images/projects/canson/`:
  - `01-login.png`
  - `02-dashboard.png`
  - `03-orders.png`
  - `04-assignments.png`
  - `05-analytics.png`
- [ ] Confirm login method with the owner; do not invent credentials.

### 2C — Normalize
- [ ] Same viewport and format per project.
- [ ] Compress to target < 500 KB each where possible.
- [ ] Lowercase, hyphenated, zero-padded filenames.

### Gate 2
- [ ] Five TravelConnect images exist and are visually correct.
- [ ] Canson decision recorded and captured, scheduled, or explicitly deferred.
- [ ] No credentials persisted anywhere.

---

## Phase 3 — Add TravelConnect & Canson to the Portfolio

**Purpose:** Add the two real projects using the existing card/modal contract.

### 3A — Approved content

**TravelConnect**
- Title: `TravelConnect`
- Description: full-stack online travel agency covering flights, hotels, cars, and packages; PayMongo payments with 3-D Secure card checkout; cancellations and refunds; PDF itineraries; customer support; role-based admin dashboard.
- Images: `./assets/images/projects/travelconnect/01-home.png` … `05-admin-dashboard.png`
- URL: `https://travel-connect-xi.vercel.app/`
- Stack: React 19 · Vite · Tailwind · ASP.NET Core 10 · EF Core · SQL Server · Firebase · PayMongo

**Canson Order & Workforce System**
- Title: `Canson Order & Workforce System`
- Description: order, inventory, and workforce platform for a supplies business; RBAC, multi-phase orders, employee assignments, production progress, damage/return tracking, stock audit trails, scheduling, analytics.
- Images: `./assets/images/projects/canson/01-login.png` … `05-analytics.png`
- URL: live link once confirmed (or repo link if there is no deployment).
- Stack: Laravel 12 · PHP 8.2 · MySQL · Blade · Tailwind · Vite · Pest

### 3B — Implementation
- [ ] Lock the final list: **LMS + TravelConnect + Canson**, and remove the four placeholder projects.
- [ ] Insert two `swiper-slide` blocks in `index.html` using the existing markup pattern.
- [ ] Keep `data-images` as valid JSON in single quotes.
- [ ] Add title, description, stack badges, and URL.
- [ ] Keep the `view-project-btn` class.
- [ ] Guard empty galleries: if `data-images` has 0 items, hide carousel controls and do not start auto-slide.
- [ ] If Canson has no live URL, point `data-url` to the GitHub repository and label the action accordingly.
- [ ] Add `width`, `height`, `loading="lazy"`, and `decoding="async"` to card images to prevent layout shift.
- [ ] Adjust Swiper breakpoints only if slide count makes the carousel awkward; do not rewrite config.
- [ ] Keep all new copy in `index.html` (no external data file unless the owner asks).

### Gate 3
- [ ] Both cards appear in the carousel.
- [ ] Titles match exactly.
- [ ] Image paths resolve with no 404s.
- [ ] URLs open the correct sites.
- [ ] No new console errors.

---

## Phase 4 — Test Project Integration

**Purpose:** Prove the new content works inside the existing machinery before restyling.

### Content fidelity
- [ ] Titles, descriptions, and URLs match approved copy.
- [ ] No placeholder text remains for these two projects.
- [ ] Stack badges are accurate.

### Modal & carousel
- [ ] "View Project" opens the correct title/description.
- [ ] All 5 images load.
- [ ] Indicators match image count.
- [ ] Prev/next buttons work.
- [ ] Auto-slide runs and resets after manual navigation.
- [ ] `Esc` closes; `←`/`→` navigate.
- [ ] Backdrop click closes; body scroll lock releases.
- [ ] "Visit Site" points to the right URL.

### Swiper
- [ ] 1 slide on mobile, 2 at `≥640px`, 3 at `≥1024px`.
- [ ] Pagination dots clickable and accurate.
- [ ] No overflow or clipped cards.

### Gate 4
- [ ] All checks pass; defects fixed before Phase 5.

---

## Phase 5 — Build the Paper Graphite Foundation

**Purpose:** Establish the design system inside the new CSS structure.

### Tasks
- [ ] Add fonts: **Bricolage Grotesque**, **DM Sans**, **IBM Plex Mono**.
- [ ] Define tokens in `src/css/tokens.css`.
- [ ] Build the fixed grid background in `src/css/base.css`.
- [ ] Set typography scale and base rhythm.
- [ ] Establish container widths and section spacing in `layout.css`.
- [ ] Remove the old blue underline accent and float keyframe.
- [ ] Confirm `main.css` import order: tokens → base → layout → components → animations.
- [ ] Replace the title with a descriptive professional title.
- [ ] Add `<meta name="description">`, canonical URL, Open Graph, Twitter card, and `theme-color`.
- [ ] Add JSON-LD `Person` schema with name, role, location, and social links.
- [ ] Add favicon and `apple-touch-icon` using the relocated brand image.
- [ ] Add `robots.txt` and a single-URL `sitemap.xml` (update when the final domain is known).

### Gate 5
- [ ] Grid background shows at every scroll position.
- [ ] No blue accent remains.
- [ ] Contrast is readable.
- [ ] No horizontal scrollbar from the grid layer.

---

## Phase 6 — Reskin All Sections

**Purpose:** Apply the system to every section without changing project content.

### 6A — Navigation
- [ ] Light surface bar with 1px bottom rule.
- [ ] Mono nav labels; ink hover state and `aria-current`.
- [ ] Scroll progress line.
- [ ] Add a hamburger button (does not exist today) with `aria-expanded` and `aria-controls`.
- [ ] Add a mobile drawer that closes on link click, `Esc`, and backdrop tap.
- [ ] Lock body scroll while the drawer is open and restore focus to the trigger.
- [ ] Ensure the mobile nav does not overlap the fixed header.

### 6B — Hero / `#intro`
- [ ] Oversized display heading.
- [ ] Crosshair profile frame (replace floating gradient bubble).
- [ ] Mono metadata strip: location, stack, availability.
- [ ] Sharp block / underlined actions.
- [ ] Remove decorative float.

### 6C — Projects / `#projects`
- [ ] Header `01 / Selected Work` with drawn rule.
- [ ] Case-file cards: index number, thin border, sharp corners, mono metadata.
- [ ] Grayscale-to-color image reveal on hover.
- [ ] Preserve all data attributes and button classes.
- [ ] Keep Swiper structure intact.

### 6D — Certificates / `#certificates`
- [ ] Header `02 / Credentials`.
- [ ] Ledger rows: name, issuer, year, thumbnail.
- [ ] Keep all certificate images and links.

### 6E — Contact / `#contact`
- [ ] Header `03 / Contact`.
- [ ] Underlined inputs with clear focus states and mono labels.
- [ ] Strong dark submit button.
- [ ] Preserve EmailJS field names and IDs.

### 6F — Footer & modal
- [ ] Footer becomes the single dark graphite band.
- [ ] Modal restyled to match: sharp panel, thin rules, mono captions.
- [ ] Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="modalTitle"`.
- [ ] Add `aria-label` to the close, previous, and next buttons.
- [ ] Hide the visit button when a project has no URL.
- [ ] Preserve `#projectModal`, `#closeModal`, `#carouselImages`, `#carouselIndicators`, `#prevBtn`, `#nextBtn`, `#modalTitle`, `#modalDescription`, `#visitSiteBtn`.

### Gate 6
- [ ] No section uses the old palette.
- [ ] Project data intact.
- [ ] Modal IDs and handlers intact.
- [ ] Visual review at 1440px is consistent.

---

## Phase 7 — Rate Limiting & Request Protection

**Purpose:** Stop the contact form — and any future request — from being spammed, without pretending a static site has server-side enforcement it does not have.

### 7A — Policy
- [ ] 60-second cooldown between submissions.
- [ ] Maximum 3 submissions per rolling 10-minute window.
- [ ] Persist limiter state in `localStorage`; fall back to memory when storage is unavailable.
- [ ] Show a live countdown on the submit button plus an accessible status message.

### 7B — Reusable limiter module
- [ ] Create `src/js/rate-limit.js`:
  - `canSubmit(key)`, `record(key)`, `remaining(key)`, `retryAfter(key)`
  - configurable `cooldownMs`, `maxAttempts`, `windowMs`
  - storage adapter wrapped in `try/catch` with quota and clock-skew guards
- [ ] Export a singleton preconfigured for the contact form, while allowing per-request keys.
- [ ] Apply it to **every** network request the site makes. Today that is EmailJS only; future calls must reuse the same module.

### 7C — Contact form integration (`contact-form.js`)
- [ ] Block submit while a request is in flight (no double submits).
- [ ] Check the limiter before calling `emailjs.send`; if blocked, show retry time and send **zero** network requests.
- [ ] Record a successful attempt only after the EmailJS promise resolves.
- [ ] Do not count failed sends against the user, or count them with a shorter retry.
- [ ] Add a hidden honeypot field (`company`) with `tabindex="-1"`, `aria-hidden="true"`, and off-screen CSS; reject silently if filled.
- [ ] Add a minimum fill time of 3 seconds from first focus to submit.
- [ ] Cap input lengths: name 100, email 254, message 2000.
- [ ] Use `aria-live="polite"` for status and error messages.
- [ ] Preserve existing EmailJS service/template IDs and field names.

### 7D — Defense in depth
- [ ] EmailJS dashboard: restrict allowed origins to the portfolio domain(s).
- [ ] Confirm the contact form still works from the deployed origin after the restriction.
- [ ] Document in `docs/DESIGN-SYSTEM.md` that client-side limits reduce casual spam but are **not** a security boundary.
- [ ] Record future upgrades, not built in this scope:
  - Cloudflare Turnstile CAPTCHA.
  - Serverless proxy with per-IP enforcement.

### 7E — Testing
- [ ] First submission succeeds.
- [ ] Immediate second submission is blocked with a countdown and **zero** requests in DevTools.
- [ ] Fourth submission inside 10 minutes is blocked.
- [ ] Reload persists the cooldown.
- [ ] `localStorage` disabled → in-memory fallback works with no crash.
- [ ] Honeypot filled → no request sent.
- [ ] Submit under 3 seconds → blocked.
- [ ] Double-click submit → exactly one request.
- [ ] Send failure does not permanently lock the user out.
- [ ] Status messages are announced to screen readers.
- [ ] Clearing storage resets the limiter.

### Gate 7
- [ ] Blocked attempts produce no network traffic.
- [ ] A legitimate submission still reaches EmailJS.
- [ ] The limitation of client-side enforcement is documented.

---

## Phase 8 — Motion & Interaction Polish

**Purpose:** Add personality without noise.

### Tasks
- [ ] Hero stagger reveal on load.
- [ ] Section reveal via `IntersectionObserver` in `reveal.js`.
- [ ] Line-draw effect on section rules.
- [ ] Card hover: color reveal, index shift, subtle lift.
- [ ] Grid drift and desktop-only cursor highlight.
- [ ] Nav scroll progress in `navigation.js`.
- [ ] Pause carousel auto-slide on hover, focus-within, and when the tab is hidden.
- [ ] Disable auto-slide entirely under `prefers-reduced-motion`.
- [ ] `prefers-reduced-motion: reduce` overrides that disable transforms, drift, and auto-reveal.
- [ ] Confirm no layout shift (CLS) and no interaction blocking.

### Gate 8
- [ ] Animations run smoothly at 60 fps.
- [ ] Reduced-motion mode shows a complete static page.
- [ ] Modal and carousel are unaffected.

---

## Phase 9 — Responsive & Cross-Browser Testing

**Purpose:** Ensure the redesign holds at real sizes.

### Viewports
- [ ] 360×800
- [ ] 390×844
- [ ] 768×1024
- [ ] 1024×768
- [ ] 1440×900
- [ ] 1920×1080

### Checks per viewport
- [ ] Grid scales without pixelation or jitter.
- [ ] Hero text does not overflow.
- [ ] Profile frame stays proportionate.
- [ ] Swiper shows correct slide count; no clipping.
- [ ] Modal fits; images scale; controls reachable.
- [ ] Contact form usable; no horizontal scroll.
- [ ] Mobile nav drawer opens/closes, traps focus, and restores scroll.
- [ ] Footer aligns correctly.

### Browsers
- [ ] Chrome
- [ ] Edge
- [ ] Firefox
- [ ] Safari / WebKit

### Gate 9
- [ ] No layout break at any viewport.
- [ ] No horizontal scroll anywhere.
- [ ] Carousel and modal usable on touch.

---

## Phase 10 — Functional Regression Testing

**Purpose:** Confirm nothing broke while restyling.

- [ ] Nav links scroll to the correct sections.
- [ ] Active/hover states work.
- [ ] Modal opens for **every** card, including LMS.
- [ ] All modal carousel images load.
- [ ] Prev/next/indicator/keyboard/backdrop/close all work.
- [ ] Auto-slide pauses/resets correctly.
- [ ] "Visit Site" opens correct URLs.
- [ ] Swiper drag, pagination, and breakpoints work.
- [ ] Contact form validation fires on empty/invalid input.
- [ ] EmailJS submits with a test message.
- [ ] Success/error messaging appears and clears.
- [ ] No console errors or failed requests.
- [ ] Deep links / anchors resolve.

### Gate 10
- [ ] All checks pass; regressions fixed and re-tested.

---

## Phase 11 — Accessibility & Performance Testing

**Purpose:** Make sure the redesign is usable and fast.

### Accessibility
- [ ] Add a "Skip to content" link as the first focusable element.
- [ ] Use `<main>`, `<nav>`, and `<footer>` landmarks correctly.
- [ ] WCAG AA contrast (4.5:1 body, 3:1 large).
- [ ] Modal has `role="dialog"`, `aria-modal`, accessible name.
- [ ] Focus trapped in the modal and restored on close.
- [ ] All buttons/links have accessible names; icon-only social links get `aria-label`.
- [ ] Full keyboard navigation, including the mobile drawer.
- [ ] Visible focus indicators on the grey canvas.
- [ ] Meaningful `alt` text on every image.
- [ ] `prefers-reduced-motion` re-verified, including carousel auto-slide.
- [ ] Inputs have labels and error associations.

### Performance
- [ ] Screenshots compressed and correctly sized.
- [ ] `font-display: swap` and fallbacks prevent layout shift.
- [ ] Lighthouse Performance ≥ 85 mobile.
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] No unnecessary render-blocking additions.

### Gate 11
- [ ] Contrast and keyboard checks pass.
- [ ] Lighthouse targets met or deviations documented.

---

## Phase 12 — Final Verification & Release

**Purpose:** Ship with confidence.

- [ ] First-time visitor walkthrough: hero → projects → modal → certificates → contact.
- [ ] Review the diff to confirm project content was not altered.
- [ ] Confirm no credentials or secrets in the repo.
- [ ] Confirm `assets/images/projects/travelconnect/` and `.../canson/` are committed.
- [ ] Confirm root contains only entry files and config.
- [ ] Confirm the final domain and update canonical, Open Graph, and sitemap URLs.
- [ ] Add host config (`vercel.json` or `_headers`) for caching and security headers.
- [ ] CSP must allow EmailJS, Swiper CDN, Font Awesome, and the chosen font source.
- [ ] Verify HTTPS and the preferred `www`/non-`www` redirect.
- [ ] Tag the baseline `pre-redesign` and document the rollback command.
- [ ] Check for broken links and 404s across the deployed site.
- [ ] Final screenshots for the owner: desktop + mobile.
- [ ] Merge branch / deploy.
- [ ] Verify the deployed site against local.
- [ ] Post-deploy smoke test: modal, carousel, form, images, rate limiter.

### Gate 12 — Definition of Done
- [ ] Repository follows the standard structure in Section 4.
- [ ] TravelConnect and Canson appear with real screenshots and accurate copy.
- [ ] Paper Graphite grid design is applied consistently.
- [ ] All original functionality works.
- [ ] Contact form is rate limited, double-submit safe, and gives accessible feedback.
- [ ] Responsive, accessible, reduced-motion safe.
- [ ] No project content changed beyond approved additions.
- [ ] Site deployed and verified.

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| File moves break image paths | Broken cards/certificates | Update references first, verify 404s, delete originals last |
| `email.js` is missing | Contact form sends nothing | Rebuild handler in Phase 1; owner supplies IDs; test delivery |
| Mobile nav does not exist | Mobile users cannot navigate | Add drawer in Phase 6; test at 360–768px |
| Tailwind build misses classes | Broken layout | Scan `index.html` + `src/js`; diff against baseline |
| Splitting JS breaks modal | Core feature loss | Move logic verbatim; test at Gate 1 and Gate 10 |
| Splitting CSS changes cascade | Visual regressions | Fixed import order; compare against baseline screenshot |
| Client-side limiter bypassed | Spam still possible | EmailJS origin rules, CAPTCHA, optional serverless proxy |
| Limiter blocks real users | Lost inquiries | Short cooldown, clear countdown, retry-after message, failed sends not counted |
| Limiter state tampered with | Trivial reset via DevTools | Accepted for client-side; serverless proxy for real enforcement |
| Canson deployment stays down | No Canson screenshots | Wake service, run locally, use owner images, or defer |
| Credentials leaked | Security | Session-only login, env vars, no logging, scrub before commit |
| Grid causes jank | Poor performance | Fixed layer, transform-only animation, disable on reduced motion |
| Screenshots too heavy | Slow load | Compress, lazy-load modal images, target < 500 KB each |
| Font loading shifts layout | CLS | `font-display: swap`, size-adjusted fallbacks, preconnect |
| Folder sprawl or nesting | Confusing project | Follow Section 4 naming rules; one concern per file |

## 7. Files Expected to Change

| File / Folder | Change |
|---|---|
| `index.html` | Add two project slides; update asset paths; restyle markup |
| `assets/images/**` | Reorganized into brand/profile/certificates/projects |
| `src/css/main.css` + partials | New split stylesheet system |
| `src/css/tailwind.css` + `assets/css/tailwind.css` | Local Tailwind input and generated output |
| `src/js/main.js` + modules | New split module system |
| `src/js/config.example.js` | Committed EmailJS config template |
| `src/js/config.js` | Local EmailJS identifiers (gitignored) |
| `src/js/rate-limit.js` | New reusable request limiter |
| `src/js/contact-form.js` | Rebuilt EmailJS handler + limiter + guards |
| `.gitignore` | Ignore config, capture profiles, `.env` |
| `scripts/capture-screenshots.mjs` | Screenshot tooling |
| `docs/*` | Plan, design system, QA checklist |
| `package.json` | Capture dev dependency and npm script |
| `README.md` | New setup and capture instructions |

## 8. Screenshot Naming Convention

```text
assets/images/projects/
├── travelconnect/
│   ├── 01-home.png
│   ├── 02-flights.png
│   ├── 03-hotels.png
│   ├── 04-deals.png
│   └── 05-admin-dashboard.png
└── canson/
    ├── 01-login.png
    ├── 02-dashboard.png
    ├── 03-orders.png
    ├── 04-assignments.png
    └── 05-analytics.png
```

Rules:
- Lowercase, hyphenated, zero-padded index.
- Same viewport and format within a project.
- No credentials, emails, or personal data visible in frame.

---

## 9. Content Source of Truth

- [ ] Create `docs/CONTENT.md` with the approved copy for LMS, TravelConnect, and Canson.
- [ ] Any project copy change is made there first, then mirrored into `index.html`.
- [ ] Record screenshot provenance in `docs/QA-CHECKLIST.md`: URL, viewport, and capture date.
- [ ] Record every placeholder removed and every new project added.
- [ ] Keep the plan and content docs in `docs/`, not at the repo root.

## 10. Owner Actions Required

| # | Action | Why | Phase |
|---|---|---|---|
| 1 | Provide EmailJS service ID, template ID, and confirm the public key | `email.js` is missing; the form is currently dead | 0–1 |
| 2 | Verify a test email arrives | Confirms the rebuilt handler works | 1 |
| 3 | Restrict EmailJS allowed origins in the dashboard | Blocks off-site abuse | 7 |
| 4 | Confirm the final domain | Canonical, Open Graph, sitemap, CSP | 5 |
| 5 | Confirm the hosting target (Vercel, Netlify, GitHub Pages, other) | Correct headers and deploy config | 0 |
| 6 | Confirm Canson live URL, or provide screenshots / local run access | Canson is currently unreachable | 2 |
| 7 | Provide TravelConnect admin access through a safe channel | Admin dashboard screenshots | 2 |
| 8 | Approve final project copy and removal of the four placeholders | Content lock | 3 |

## 11. Performance Budgets

| Metric | Target |
|---|---|
| LCP (mobile, 4G) | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Initial transfer (excluding lazy screenshots) | < 1.5 MB |
| Each screenshot | < 500 KB |
| Lighthouse Performance | ≥ 85 mobile |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |

## 12. Rollback Plan

- [ ] Tag the pre-change state: `git tag pre-redesign`.
- [ ] Keep the original `images/` tree until Gate 1 passes.
- [ ] If a phase breaks the site, `git revert` that phase's commit rather than patching forward blindly.
- [ ] For a deployed regression, redeploy the previous build from the host dashboard.
- [ ] Document the rollback steps in `docs/PLAN.md`.

## 13. Next Action

Switch to a **build agent** and start at **Phase 0**. Complete Phase 1 (file structure, restored contact handler, local Tailwind) and confirm Gate 1 before any redesign work begins. Report at each gate.

## 14. Implementation Notes (as built)

- Tailwind was removed entirely instead of built locally. The Paper Graphite system is custom CSS, so the CDN dependency and the unused Tailwind CLI were deleted.
- src/js/config.js is committed rather than gitignored. EmailJS service, template, and public-key values are delivered to the browser by design; hiding the file is what silently broke the form. Origin rules in the EmailJS dashboard are the actual control.
- Canson was added with a repository link and an empty-gallery state because the Render deployment did not respond. Its folder README lists the exact capture steps.
- The four placeholder projects were removed.
- Screenshot tooling lives in scripts/; QA results in docs/QA-CHECKLIST.md.
