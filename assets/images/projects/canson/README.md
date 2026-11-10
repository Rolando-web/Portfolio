# Canson screenshots — pending

The Canson deployment at
`https://canson-s-order-tracking-and-workforce.onrender.com/`
did not respond after repeated probes (25s, 90s, 240s) on 2026-11-09/10,
and the repository does not contain UI screenshots.

## To finish this folder

1. Wake the Render service and confirm the login page loads.
2. Sign in with an approved account.
3. Capture five screens at `1440×900`:
   - `01-login.png`
   - `02-dashboard.png`
   - `03-orders.png`
   - `04-workforce.png`
   - `05-analytics.png`
4. Update `index.html` for the Canson card:
   - set `data-images` to the five paths
   - point `data-url` at the live site
   - remove `data-url-label="View repository"` if a live link exists
   - replace the `project-media--empty` block with an `<img>` cover
5. Delete this file.

Until then the card renders an intentional "Screenshots pending" tile and the
modal opens an empty-gallery state instead of broken images.
