# Rolando-web Portfolio

Monochrome editorial-dossier portfolio for Rolando Luayon — semi full stack
web developer in Davao City. The page is built as a printed technical
monograph: a fixed masthead, numbered sheets, full-bleed project plates, a
credential ledger, a dark closing spread, and one uniform 20px graph grid.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:4173>. The dev server rebuilds `index.html` from
`src/html/` before each page load, so partial edits appear on refresh.
`npm install` is only needed for the screenshot and image tooling.

## Markup

`index.html` is generated. Edit the files in `src/html/` instead:

- `index.template.html` is the page shell and the ordered include manifest.
- `partials/` holds shared regions: head, masthead, index overlay, footer,
  scripts, and the project modal.
- `sections/` holds one file per sheet: hero, selected work, credentials, and
  contact.

Run `npm run build` after changing a source file. The generated `index.html`
is committed next to the source so the site also works on static hosting
without a build step.

## Structure

```
index.html                 generated page — edit src/html, not this file
src/html/
  index.template.html      page shell and ordered @include manifest
  partials/
    head.html              metadata, fonts, styles, noscript fallback
    masthead.html          fixed header, clock, index trigger
    index-overlay.html     full-screen section index
    footer.html            closing footer
    project-modal.html     project gallery dialog
    scripts.html           vendor/module scripts and JSON-LD
  sections/
    sheet-00-hero.html     Sheet 00 — identity
    sheet-01-work.html     Sheet 01 — selected work
    sheet-02-credentials.html  Sheet 02 — credentials
    sheet-03-contact.html  Sheet 03 — contact
assets/images/
  brand/                   favicon / brand mark
  profile/                 portrait
  certificates/            Credly badges
  projects/lms/            Library Management System screenshots
  projects/travelconnect/  TravelConnect screenshots
  projects/canson/         Canson screenshots (11)
src/css/
  main.css                 entry — imports only
  tokens.css               paper/ink palette, type, grid, easing
  base.css                 reset, graph paper, print trim, focus, skip link
  layout.css               masthead, index overlay, hero, work plates, ledger
  components.css           buttons, modal/carousel, custom cursor
  animations.css           keyframes, reveal states, reduced motion
src/js/
  main.js                  entry — initializes modules
  navigation.js            masthead, index overlay, clock, sheet marker, progress
  project-modal.js         modal, gallery, focus trap, autoplay rules
  reveal.js                custom work-plate reveals, parallax, magnetic buttons
  scroll-animations.js     AOS initialization and reduced-motion fallback
  cursor.js                difference-blend custom cursor (fine pointers only)
  cert-preview.js          credential hover preview
  rate-limit.js            reusable request throttle
  contact-form.js          validation + EmailJS submission
  email-params.js          maps form values to the EmailJS template variables
  config.js                EmailJS identifiers (public by design)
  config.example.js        template for other deployments
src/vendor/aos/            vendored AOS 2.3.4 (scroll reveals)
scripts/
  build-html.mjs           composes index.html from src/html includes
  dev-server.mjs           static server with automatic HTML build
  capture-baseline.mjs     before/after screenshots
  capture-review.mjs       desktop, mobile, index overlay, modal screenshots
  capture-travelconnect-admin.mjs  admin captures (env credentials only)
  optimize-images.mjs      resize + PNG compression
  audit.mjs                layout, contrast, overlay, image, and modal audit
  verify.mjs               rate limit, motion, overlay, a11y, EmailJS mapping
docs/
  PLAN.md                  full phased plan and gates
  DESIGN-SYSTEM.md         tokens, components, motion rules
  CONTENT.md               approved project copy
  OWNER-ACTIONS.md         account-level tasks
  QA-CHECKLIST.md          test results and screenshot provenance
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run build` | Rebuild `index.html` from `src/html/` |
| `npm run dev` | Build on load and serve the site at `http://localhost:4173` |
| `npm run capture:baseline` | Save before/after screenshots to `docs/baseline/` |
| `npm run optimize:images` | Resize to 1440px wide and re-compress PNGs |
| `node scripts/audit.mjs` | Layout, contrast, overlay, modal, and form sweep |
| `node scripts/verify.mjs` | Rate limit, reduced motion, overlay, a11y, and EmailJS payload checks |
| `node scripts/capture-review.mjs` | Review captures in `docs/baseline/review/` |

Adjacent scripts run directly with `node scripts/<name>.mjs`. The admin capture
script writes the shipped dashboard shot to `assets/` and exploratory views to
ignored `docs/baseline/`.

## Contact form

The form uses EmailJS. Identifiers live in `src/js/config.js`; they are
delivered to the browser by design, so protect the service with allowed-origin
rules in the EmailJS dashboard rather than by hiding the file.

The template body expects `{{name}}`, `{{time}}`, `{{Email}}`, and
`{{message}}`. The form also sends lowercase `email`, `title`, and `reply_to`
so template copy changes do not silently blank the sender or reply address.

Client-side guards: 3-second minimum fill, honeypot, 60-second cooldown,
3 submissions per rolling 10 minutes, input caps, double-submit lock, and an
`aria-live` status region. This is abuse friction, not a security boundary.
See `docs/OWNER-ACTIONS.md` for the provider-side steps.

## Motion

All animation respects `prefers-reduced-motion: reduce`. Under reduced motion
the hero lines and scroll reveals render immediately, the ticker becomes a
scrollable strip, image parallax, magnetic buttons, and the custom cursor are
disabled, and the project gallery stops auto-advancing.

The motion set: hero line wipe, staggered index-overlay rows, AOS section
reveals (with a custom observer for the work plates and credential ledger), full
plate clip-path wipes, project-copy slides, image and number parallax, a
sheet-rule draw, ledger row staggering, a full-bleed technology ticker, a
magnetic primary button, a difference-blend cursor, a live Davao clock, a
scroll progress bar, a sheet indicator, and the credential preview swap.

## Credits

Built by Rolando Luayon. Project screenshots belong to their respective
projects. Scroll reveals use [AOS](https://michalsnik.github.io/aos/) by Michał
Sajnóg, vendored under the MIT license.
