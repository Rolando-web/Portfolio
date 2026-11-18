# Design System — Editorial Dossier

A warm-paper technical monograph. The page reads like a printed architecture
dossier: a fixed masthead, numbered sheets, full-bleed project plates, a
credential ledger, and a dark closing spread. No accent colour — project
screenshots are the only colour on the page.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#e9e7df` | Page background |
| `--paper-2` | `#f2f0e8` | Inset panels, modal, credential preview |
| `--paper-3` | `#dcd8cc` | Image wells |
| `--ink` | `#161613` | Primary text, borders, buttons |
| `--ink-soft` | `#2f2e29` | Body copy |
| `--muted` | `#5d5b51` | Metadata (5.5:1 on paper) |
| `--line` | `rgba(22,22,19,0.16)` | Hairlines and grid |
| `--line-strong` | `rgba(22,22,19,0.4)` | Section and control borders |
| `--inverse` | `#161613` | Canson plate, contact, footer |
| `--inverse-ink` | `#f1efe7` | Text on ink |
| `--inverse-muted` | `#b9b6aa` | Metadata on ink (8.9:1) |
| `--grid` | `20px` | Background graph unit |
| `--maxw` | `1240px` | Content width |
| `--gutter` | `clamp(20px, 4vw, 64px)` | Page gutters |
| `--edge` | `max(gutter, (100vw − maxw) / 2)` | Copy alignment inside full-bleed plates |
| `--mh` | `66px` | Masthead height |
| `--ease` | `cubic-bezier(0.19,1,0.22,1)` | Global easing |

## Type

| Role | Family | Notes |
|---|---|---|
| Display | Anton | Hero, sheet titles, project titles, indices. Uppercase, tight, 0.8–0.92 line-height |
| Accent | Instrument Serif italic | One word per major heading, portrait caption |
| Body | Archivo | Copy and controls, 18px / 1.65, weight 500 |
| Labels | Archivo | 12px uppercase, weight 500–600, 0.12–0.16em tracking |

No monospace face is used. Arrows are text glyphs (`↗ ↓ ← → ×`), not icon fonts.
The mobile label floor is 12px; body copy never goes below 17px.

## Background

Two layers, both fixed and decorative:

1. **Graph paper** — one uniform grid: a 20px square, 16% line alpha at 30%
   layer opacity. No nested 100px major lines. Static.
2. **Print trim** — a 1px white frame inset 10px with `mix-blend-mode:
   difference`, so it reads as a dark trim on paper and a light trim on the
   dark spreads.

A 2px scroll-progress bar sits at the top edge.

## Layout

- **Masthead (all widths)** — three-part fixed bar: brand, sheet indicator
  (`Sheet 02 / 04 — Credentials`), live Davao clock, and Index button. Height
  compresses from 66px to 56px after 24px of scroll.
- **Index overlay** — full-screen paper panel revealed with a bottom-up
  `clip-path` wipe. Four editorial rows (number / name / italic tag / arrow),
  staggered entrance, focus trap, `inert` background, Escape and link close.
- **Hero** — meta rule, oversized two-line name (Anton + serif italic) with a
  small gap between the two lines, portrait plate, lede, actions, stack list,
  four-column stats strip, and a full-bleed marquee ticker.
- **Work sheets** — each project is a full-viewport-width spread:
  `1.16fr / 0.84fr` media-and-copy. Even rows reverse to
  `0.84fr / 1.16fr`. Copy padding resolves to `--edge`, so text aligns to the
  1240px measure while media bleeds to the viewport. Below 900px the spread
  stacks copy-first with a fixed media band.
- **Canson plate** — the third row inverts to ink, carries the login screenshot
  in its media well, and keeps the outlined giant `03` in the copy.
- **Sheet rules** — section heads close with a 3px ink rule that draws from left
  to right on first view. Section and plate boundaries use 2–3px ink rules
  instead of hairlines.
- **Capability index** — two-column numbered ledger under the work plates.
- **Credentials** — `1.5fr / 0.7fr` ledger + sticky badge preview. Hover or
  focus a row and the preview swaps; on mobile the badge thumbnail appears in
  the row instead and the preview is hidden.
- **Contact / footer** — a single dark closing spread: statement, email,
  details, socials, and the form on the right. Footer is the colophon.

## Components

- **Buttons** — square, 1px ink border, uppercase label, invert on hover.
  Primary hero button is magnetic on fine pointers.
- **Work plate** — the whole media area is a button that opens the project
  modal; an "Open file ↗" chip appears on hover/focus. The copy side keeps a
  second text trigger.
- **Credential row** — index, title, issuer, date, arrow. Hover inverts the row
  to ink and indents it. Rows are real links to Credly.
- **Form** — underline inputs on ink, uppercase labels, striped error fields,
  inline error text, `aria-live` status, full-width submit.
- **Modal** — paper panel with a bordered header, `contain` gallery, square
  controls, indicators, description, and action. Dark scrim; focus trapped.
- **Cursor** — 34px difference-blend ring with a 5px dot, created only for fine
  pointers and disabled under reduced motion.

## Motion

| Effect | Duration | Trigger |
|---|---|---|
| Hero line wipe | 1.1s, 0.14s stagger | Load |
| Portrait rise | 0.9s | Load |
| AOS section reveal | 0.8s fade-up, 28px travel | AOS scroll observer |
| Work plate reveal | 0.8–0.9s | IntersectionObserver |
| Plate wipe | 1.1s clip-path | First view / scroll |
| Project copy slide | 0.9s, 160ms delay | First view / scroll |
| Project image zoom | 1.2s, 1.07 → 1 | First view / scroll |
| Sheet rule draw | 1.05s scaleX | First view / scroll |
| Credential stagger | 0.7s, 50ms steps | IntersectionObserver |
| Ticker | 38s linear loop, pauses on hover | Always |
| Image parallax | rAF, ±30px | Scroll |
| Number parallax | rAF, ±22px | Scroll |
| Magnetic button | 0.25s follow | Fine-pointer hover |
| Index wipe | 0.7s clip-path | Open / close |
| Index row stagger | 0.55s, 60ms steps | Overlay open |
| Certificate swap | 0.22s fade | Row hover / focus |
| Gallery slide | 0.55s; 4s auto | Controls / autoplay |

Everything above collapses under `prefers-reduced-motion: reduce`: AOS and
custom reveals and hero lines render immediately, the ticker becomes a
scrollable strip, parallax, magnetism, and the custom cursor are disabled, and
the gallery stops auto-advancing.

## Rules

1. No accent hue. Emphasis comes from scale, weight, rules, and inversion.
2. Square corners only.
3. Borders before shadows. Structural rules are 2–3px ink, not hairlines.
4. Anton for statements, Instrument Serif italic for one accent word, Archivo
   for everything that must be read. Body copy is never lighter than 500.
5. Project screenshots keep their real colour inside a neutral frame.
6. Full-bleed media, measured copy. Never let copy run wider than 64ch.
7. One uniform 20px graph grid; no nested major lines.
8. Motion must clarify hierarchy, not decorate empty space.
