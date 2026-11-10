# Rolando-web Portfolio

Monochrome editorial-dossier portfolio for Rolando Luayon — semi full stack
web developer in Davao City. The page is built as a printed technical
monograph: a fixed masthead, numbered sheets, full-bleed project plates, a
credential ledger, and a dark closing spread.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:4173>.

No build step is required. The page is static HTML plus native ES modules and
five CSS partials. `npm install` is only needed for the screenshot and image
tooling.

## Structure

```
index.html                 page markup and project content
assets/images/
  brand/                   favicon / brand mark
  profile/                 portrait
  certificates/            Credly badges
  projects/lms/            Library Management System screenshots
  projects/travelconnect/  TravelConnect screenshots
  projects/canson/         pending (see README inside)
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
  reveal.js                scroll reveals, image parallax, magnetic buttons
  cursor.js                difference-blend custom cursor (fine pointers only)
  cert-preview.js          credential hover preview
  rate-limit.js            reusable request throttle
  contact-form.js          validation + EmailJS submission
  config.js                EmailJS identifiers (public by design)
  config.example.js        template for other deployments
scripts/
  dev-server.mjs           zero-dependency static server
  capture-baseline.mjs     before/after screenshots
  capture-review.mjs       desktop, mobile, index overlay, modal screenshots
  capture-travelconnect-admin.mjs  admin captures (env credentials only)
  optimize-images.mjs      resize + PNG compression
  audit.mjs                layout, contrast, overlay, image, and modal audit
  verify.mjs               rate limit, reduced motion, overlay, a11y audit
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
| `npm run dev` | Serve the site at `http://localhost:4173` |
| `npm run capture:baseline` | Save before/after screenshots to `docs/baseline/` |
| `npm run optimize:images` | Resize to 1440px wide and re-compress PNGs |
| `node scripts/audit.mjs` | Layout, contrast, overlay, modal, and form sweep |
| `node scripts/verify.mjs` | Rate limit, reduced motion, overlay, and a11y checks |
| `node scripts/capture-review.mjs` | Review captures in `docs/baseline/review/` |

Adjacent scripts run directly with `node scripts/<name>.mjs`.

## Contact form

The form uses EmailJS. Identifiers live in `src/js/config.js`; they are
delivered to the browser by design, so protect the service with allowed-origin
rules in the EmailJS dashboard rather than by hiding the file.

Client-side guards: 3-second minimum fill, honeypot, 60-second cooldown,
3 submissions per rolling 10 minutes, input caps, double-submit lock, and an
`aria-live` status region. This is abuse friction, not a security boundary.
See `docs/OWNER-ACTIONS.md` for the provider-side steps.

## Motion

All animation respects `prefers-reduced-motion: reduce`. Under reduced motion
the hero lines and scroll reveals render immediately, the ticker becomes a
scrollable strip, image parallax, magnetic buttons, and the custom cursor are
disabled, and the project gallery stops auto-advancing.

The motion set: hero line wipe, staggered index-overlay rows, scroll reveals,
image parallax inside the work plates, a full-bleed technology ticker, a
magnetic primary button, a difference-blend cursor, a live Davao clock, a
scroll progress bar, a sheet indicator, and the credential preview swap.

## Credits

Built by Rolando Luayon. Project screenshots belong to their respective
projects.
