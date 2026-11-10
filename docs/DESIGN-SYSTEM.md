# Design System — Paper Graphite

A light, warm-grey monochrome system. No accent color. Project screenshots are
the only saturated content on the page.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#e7e6e1` | Page background |
| `--surface` | `#f1f0eb` | Bento cards, form, modal |
| `--surface-2` | `#dbdad3` | Matrix tile, secondary surface |
| `--surface-3` | `#cfcec6` | Image wells |
| `--ink` | `#171715` | Primary text, borders, buttons |
| `--ink-soft` | `#33332f` | Body copy |
| `--muted` | `#5c5c55` | Labels and metadata (5:1 on canvas) |
| `--line` | `rgba(23,23,21,0.14)` | Hairlines and grid |
| `--line-strong` | `rgba(23,23,21,0.34)` | Card and control borders |
| `--inverse` | `#171715` | Footer band, Canson tile |
| `--grid` | `20px` | Background grid unit |
| `--rail` | `236px` | Desktop navigation rail |
| `--maxw` | `1180px` | Content width |
| `--gutter` | `clamp(22px, 3.4vw, 54px)` | Page gutters |
| `--ease` | `cubic-bezier(0.22,1,0.36,1)` | Global easing |

## Type

| Role | Family | Notes |
|---|---|---|
| Display | Bricolage Grotesque | Hero, section and tile titles, tight tracking |
| Body | DM Sans | Copy and controls, base 17px / 1.65 |
| Mono | IBM Plex Mono | Labels, indices, metadata, buttons |

Sizes are fluid with `clamp()`. Mono labels never go below 10.5px. Rail labels
are 15.5px DM Sans. The hero title uses outlined text for the second line via
`-webkit-text-stroke`.

## Grid background

Four layered linear gradients create a 20px minor grid and a 100px major grid,
masked with a radial fade so the center is present and the edges fall away.
Drift is a 120s background-position loop. Disabled under reduced motion.

## Layout

- **Desktop (≥901px)** — fixed 236px rail with brand, numbered nav, availability
  status, socials, and location. Content is offset by the rail. Scroll progress
  is a 1px vertical line on the rail edge.
- **Mobile (≤900px)** — fixed 64px top bar with brand and menu toggle, plus a
  full-height drawer with large nav labels. Focus is trapped inside the drawer.
- **Hero** — eyebrow/location rule, oversized two-line title, portrait plate,
  tag list, and a four-column stats strip.
- **Sections** — `01` index column plus title and lede, separated by a strong
  hairline rule.

## Components

- **Buttons** — square, 1px ink border, mono uppercase label, invert on hover.
- **Tags** — 1px border, 10.5px mono uppercase.
- **Bento projects** — 12-column asymmetric grid. LMS spans 7 columns,
  TravelConnect 5, Canson a dark 5-column tile, and the capability matrix 7.
  Media tiles are 16:9 (feature) or 4:3 (side) and open the project modal.
- **Canson tile** — intentional dark typographic tile with an outlined `03`,
  "Screenshots pending" label, and repository action.
- **Capability matrix** — two-column ledger of eight capabilities inside the
  bento grid.
- **Certificate ledger** — editorial rows: index, badge thumb, title, issue
  date, verify arrow. Not cards. Badge thumbs hide on narrow screens.
- **Form** — underline inputs, mono labels, inline error text, `aria-live`
  status, square submit button.
- **Modal** — light panel, mono kicker, 54vh gallery with `contain` images,
  indicators, description, action button. Dark blurred backdrop.
- **Footer** — the only dark band; mono, three-column, thin inverted rule.

## Motion

| Effect | Duration | Trigger |
|---|---|---|
| Hero rise | 0.8s stagger | Load |
| Reveal | 0.7s | IntersectionObserver |
| Card hover | 0.25s | Pointer |
| Image zoom | 0.6s | Media hover |
| Gallery slide | 0.5s | Controls / 4s auto |

All of the above collapse under `prefers-reduced-motion: reduce`.

## Rules

1. No accent hue. If it needs emphasis, use weight, scale, rule, or inversion.
2. Square corners only.
3. Borders before shadows.
4. Mono for metadata; display for statements; body for explanation.
5. Project screenshots keep their real color inside a neutral frame.
6. Never trade readability for a smaller label. 10.5px is the mono floor.
