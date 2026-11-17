# Sim Golf League

Scoring tracker for a 9-hole simulator golf league: 8 golfers plus subs, 2-man alternate shot, one match per week.

- **Roster:** golfers and subs with 18-hole course handicaps
- **Schedule:** 7-week round robin, so every golfer partners every other golfer once
- **Scores:** enter team gross; net uses the exact (unrounded) team handicap
- **Weekly placement bonus:** 1st −4, 2nd −3, 3rd −2, 4th −1 off that week's net. Ties share the better place.
- **Leaderboard:** totals and averages per golfer, ranked by average final net (net minus bonus)

## Handicaps
- 9 holes: each golfer's 18-hole course handicap is halved
- Team allowance (WHS Appendix C): 60% of the low handicap + 40% of the high (Greensomes / Chapman), or 50% of combined for straight alternate shot

## Data
- Published league data lives in **Vercel Blob** (store `golf-league-data`) and is served by `api/league.js`.
  - `GET /api/league` returns the latest league JSON.
  - `PUT /api/league` publishes and needs the `x-admin-pin` header to match the `ADMIN_PIN` env var.
  - The last 30 published versions are kept in the store as history.
- `data.json` is the fallback used only if the API has nothing published yet.
- **Admin:** open the site with `#admin`. Every change auto-publishes about 1 second later after a one-time PIN entry. The bar shows **● Live** once everyone can see it.
- Visitors' apps pull new scores when opened, when brought back to the foreground, every 30 seconds while open, and on **↻ Refresh**.

## App (PWA)
- Installable: on iPhone use Safari's Share > **Add to Home Screen**; on Android, Chrome's **Install app**.
- `sw.js` is network-first, so a saved copy is used only when offline. Bump `VERSION` in `sw.js` if you add files to the app.
