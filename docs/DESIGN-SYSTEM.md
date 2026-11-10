# Design System — Paper Graphite

A light, warm-grey monochrome system. No accent color. Project screenshots are
the only saturated content on the page.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#e6e5e0` | Page background |
| `--surface` | `#efeee9` | Cards, form, modal |
| `--surface-2` | `#deddd7` | Hover surface |
| `--surface-3` | `#d4d3cc` | Image wells |
| `--ink` | `#1a1a18` | Primary text, borders, buttons |
| `--ink-soft` | `#3a3a36` | Body copy |
| `--muted` | `#5f5f59` | Labels and metadata (5:1 on canvas) |
| `--line` | `rgba(26,26,24,0.12)` | Hairlines and grid |
| `--line-strong` | `rgba(26,26,24,0.28)` | Card and control borders |
| `--inverse` | `#1a1a18` | Footer band |
| `--grid` | `40px` | Background grid unit |
| `--maxw` | `1240px` | Content width |
| `--ease` | `cubic-bezier(0.22,1,0.36,1)` | Global easing |

## Type

| Role | Family | Notes |
|---|---|---|
| Display | Bricolage Grotesque | Hero and section titles, tight tracking |
| Body | DM Sans | Copy and controls |
| Mono | IBM Plex Mono | Labels, indices, metadata, buttons |

Sizes are fluid with `clamp()`. The hero title uses outlined text for the
second line via `-webkit-text-stroke`.

## Grid background

Four layered linear gradients create a 40px minor grid and a 200px major grid,
masked with a radial fade so the center is present and the edges fall away.
Drift is a 90s background-position loop. Disabled under reduced motion.

## Components

- **Buttons** — square, 1px ink border, mono uppercase label, invert on hover.
- **Tags** — 1px border, surface fill, 8–9px mono uppercase.
- **Project card** — 14px inset, surface fill, 1px strong border, 16:10 media,
  mono index chip, title, copy, stack tags, underlined "View project" action.
- **Certificate card** — square badge well, mono kicker, display title, date,
  full-width credential link with rule.
- **Form** — underline inputs, mono labels, inline error text, `aria-live`
  status, square submit button.
- **Modal** — light panel, mono kicker, 50vh gallery with `contain` images,
  indicators, description, action button. Dark blurred backdrop.
- **Footer** — the only dark band; mono, three-column, thin inverted rule.

## Motion

| Effect | Duration | Trigger |
|---|---|---|
| Hero rise | 0.8s stagger | Load |
| Re-reveal | 0.7s | IntersectionObserver |
| Rule draw | 1.1s | IntersectionObserver |
| Card hover | 0.3s | Pointer |
| Image zoom | 0.6s | Card hover |
| Gallery slide | 0.5s | Controls / 4s auto |

All of the above collapse under `prefers-reduced-motion: reduce`.

## Rules

1. No accent hue. If it needs emphasis, use weight, scale, rule, or inversion.
2. Square corners only; `--radius` is 2px and used sparingly.
3. Borders before shadows.
4. Mono for metadata; display for statements; body for explanation.
5. Project screenshots keep their real color inside a neutral frame.
