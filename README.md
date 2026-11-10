# Rolando-web Portfolio

Monochrome "Paper Graphite" portfolio for Rolando Luayon — semi full stack
web developer in Davao City.

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
  tokens.css               colors, type, spacing
  base.css                 reset, grid background, focus, skip link
  layout.css               header, hero, sections, footer, responsive
  components.css           buttons, cards, forms, modal, certificates
  animations.css           keyframes, reveal states, reduced motion
src/js/
  main.js                  entry — initializes modules
  navigation.js            drawer, scroll progress, active nav
  swiper-init.js           project carousel
  project-modal.js         modal, gallery, focus trap, autoplay rules
  reveal.js                scroll reveals + cursor highlight
  rate-limit.js            reusable request throttle
  contact-form.js          validation + EmailJS submission
  config.js                EmailJS identifiers (public by design)
  config.example.js        template for other deployments
scripts/
  dev-server.mjs           zero-dependency static server
  capture-baseline.mjs     before/after screenshots
  capture-review.mjs       desktop, mobile, and modal screenshots
  capture-travelconnect-admin.mjs  admin captures (env credentials only)
  optimize-images.mjs      resize + PNG compression
  audit.mjs                layout, image, and modal audit
  verify.mjs               rate limit, reduced motion, drawer, a11y audit
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

All animation respects `prefers-reduced-motion: reduce`: the grid stops
drifting, reveals render immediately, the cursor highlight is removed, and
the project gallery stops auto-advancing.

## Credits

Built by Rolando Luayon. Project screenshots belong to their respective
projects.
