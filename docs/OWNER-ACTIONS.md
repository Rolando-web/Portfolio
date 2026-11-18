# Owner Actions

Tasks that need account or deployment access.

| # | Action | Why | Status |
|---|---|---|---|
| 1 | Send one real test message through the contact form | Confirms the rebuilt EmailJS handler and template still deliver | Open |
| 2 | In EmailJS → Account → Security, allow only the production origin(s) | The public key is in the browser; origin rules are the real protection | Open |
| 3 | Confirm the final domain | `canonical`, Open Graph, `sitemap.xml` currently use `https://portfolio-gold-two-93.vercel.app/` | Open |
| 4 | Confirm the hosting target | Add host-specific headers/caching (Vercel, Netlify, GitHub Pages) | Open |
| 5 | Confirm the Canson live deployment or keep the repository action | The card now ships 11 owner-supplied screenshots; the action still opens the repository | Open |
| 6 | Approve screenshot use and the Canson repository link | Public content lock | Done |
| 7 | Decide whether the four removed placeholder projects return as real projects | They were removed rather than shipped as fake work | Open |

## Notes

- EmailJS identifiers were recovered from git history (`d89dd57`) and now live
  in `src/js/config.js`. They are not secrets; the old gitignored `email.js`
  approach is what silently broke the form.
- The EmailJS template body uses `{{name}}`, `{{time}}`, `{{Email}}`, and
  `{{message}}`. The form now sends those exact keys, plus `title`, `email`, and
  `reply_to`. `{{title}}` is not rendered by the current template body; add it
  there if the project title should appear in the notification email.
- TravelConnect admin screenshots were captured with credentials passed only as
  temporary environment variables. Nothing was written to the repo, logs, or
  screenshots beyond the authenticated UI itself.
- Canson screenshots were supplied by the owner in November 2026 and now ship
  in login → dashboard → operations order. Earlier probes of the Render
  deployment (25s, 90s, 240s, plus a 240s background retry) all timed out, so
  the card action remains the repository link.
