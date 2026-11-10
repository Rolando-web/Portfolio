# QA Checklist

Run date: 2026-11-10. Local server: `http://localhost:4173`.

## Phase 0 — Setup

- [x] Branch `redesign/paper-graphite` created.
- [x] Baseline captured at 1440×900 and 390×844 (`docs/baseline/`).
- [x] `puppeteer-core` and `sharp` installed as dev dependencies.
- [x] Static preview server added (`scripts/dev-server.mjs`).
- [x] Gap audit recorded in `docs/PLAN.md` §3.1.
- [ ] Final domain and host confirmed by owner.

## Phase 1 — Structure

- [x] `images/` migrated into `assets/images/{brand,profile,certificates,projects/*}`.
- [x] `src/style.css` split into `src/css/` partials.
- [x] `script.js` split into `src/js/` modules.
- [x] Missing `email.js` replaced with `src/js/contact-form.js` + `src/js/config.js`.
- [x] Inline `onclick="submitMail()"` removed.
- [x] `mailto:` fixed to `tluayon7@gmail.com`.
- [x] Old Tailwind CDN and unused Tailwind build removed (custom CSS system instead).
- [x] `.gitignore` updated (`node_modules/`, `.env`, baseline captures).
- [x] No references remain to `images/LMS`, `src/style.css`, `script.js`, or `email.js`.
- [x] Root contains only entry files, config, and docs.

## Phase 2 — Assets

- [x] TravelConnect: 6 screenshots captured at 1440×900 (5 shipped, 1 spare).
- [x] Screenshots grouped in `assets/images/projects/travelconnect/`.
- [x] All PNGs re-compressed; 1.4 MB saved.
- [ ] Canson screenshots blocked; deferral documented in its folder README.

### Screenshot provenance

| Project | Path | Source | Viewport | Captured |
|---|---|---|---|---|
| TravelConnect | `01-home.png` | https://travel-connect-xi.vercel.app/ | 1440×900 | 2026-11-10 |
| TravelConnect | `02-flights.png` | `/flights` | 1440×900 | 2026-11-10 |
| TravelConnect | `03-hotels.png` | `/hotels` | 1440×900 | 2026-11-10 |
| TravelConnect | `04-deals.png` | `/deals` | 1440×900 | 2026-11-10 |
| TravelConnect | `05-admin-dashboard.png` | `/admin` (authenticated) | 1440×900 | 2026-11-10 |
| Canson | — | Render deployment timed out | — | — |

## Phase 3 — Projects

- [x] LMS retained with all 14 screenshots rewired.
- [x] TravelConnect added with 5 screenshots.
- [x] Canson added with repository link and empty-gallery guard.
- [x] Four placeholder projects removed.
- [x] Empty gallery hides arrows and indicators and does not auto-advance.
- [x] Images have `width`, `height`, `loading`, and `decoding`.
- [x] Content matches `docs/CONTENT.md`.

## Phase 4–8 — Redesign & motion

- [x] Paper Graphite tokens, fluid type, grid background.
- [x] All sections reskinned; no Tailwind utility classes remain.
- [x] Header, mobile drawer, scroll progress, active-section marker.
- [x] Modal restyled, ARIA dialog attributes added, focus trapped and restored.
- [x] Gallery pauses on hover, focus, hidden tab, and reduced motion.
- [x] Rate limiter: 60s cooldown, 3 per 10 minutes, localStorage + memory fallback.
- [x] Honeypot, 3s minimum fill, input caps, double-submit lock, `aria-live`.
- [x] Reduced motion disables grid drift, reveals, cursor highlight, autoplay.
- [x] Reveal observer and rule-draw animations.

## Phase 9–11 — Tests

### Layout sweep

| Width | Overflow X | Broken images | Nav |
|---|---|---|---|
| 360 | 0 | 0 | drawer |
| 390 | 0 | 0 | drawer |
| 768 | 0 | 0 | drawer |
| 1024 | 0 | 0 | inline |
| 1440 | 0 | 0 | inline |
| 1920 | 0 | 0 | inline |

### Interaction

- [x] Swiper loads; 3 cards, 3 slides.
- [x] LMS modal: 14 slides, arrows and indicators visible, "Visit site".
- [x] Canson modal: empty state, controls hidden, "View repository".
- [x] Escape closes; arrow keys navigate; focus returns to trigger.
- [x] Drawer: `aria-expanded`, label swap, body lock, Escape close, focus restore.
- [x] Form: invalid submit highlights fields; honeypot short-circuits; errors described.

### Rate limiter

- [x] First request allowed.
- [x] Second request inside 60s blocked (`cooldown`).
- [x] Three hits in 10 minutes blocked (`window`).
- [x] Reset clears storage.

### Accessibility

- [x] No unnamed buttons or links.
- [x] Every image has `alt`.
- [x] Skip link, landmarks, visible focus ring.
- [x] Mono muted text is 5:1 on canvas.
- [x] `aria-live` form status; `aria-invalid` + `aria-describedby`.

### Console / network

- [x] No page errors, console errors, or 4xx responses on load.

## Known gaps

- Canson screenshots pending.
- Real EmailJS delivery not sent during automated QA (owner step 1).
- Lighthouse not yet run; no local Chrome audit tooling installed.
- Canonical/OG URLs assume the existing Vercel deployment.
