# Sim Golf League

Scoring tracker for a 9-hole simulator golf league: 8 golfers plus subs, 2-man alternate shot, one match per week.

- **Roster:** golfers and subs with 18-hole course handicaps
- **Schedule:** 7-week round robin, so every golfer partners every other golfer once
- **Scores:** enter team gross; net uses the exact (unrounded) team handicap
- **Leaderboard:** totals and averages per golfer, ranked by average net

## Handicaps
- 9 holes: each golfer's 18-hole course handicap is halved
- Team allowance (WHS Appendix C): 60% of the low handicap + 40% of the high (Greensomes / Chapman), or 50% of combined for straight alternate shot

## Data
- `data.json` holds the published league: roster, schedule and scores. Visitors see it read-only.
- **Admin:** open the site with `#admin` at the end of the address. Edits save in that browser only. When ready, click **Download data.json to publish** and replace `data.json` in this repo. The site updates on the next deploy.
- Anyone can open `#admin`, but their edits stay in their own browser and never reach the published site.

## App (PWA)
- Installable: on iPhone use Safari's Share > **Add to Home Screen**; on Android, Chrome's **Install app**.
- The latest `data.json` is fetched every time the app opens or comes back to the foreground, and the **↻ Refresh** button pulls it on demand.
- `sw.js` is network-first, so a saved copy is used only when offline. Bump `VERSION` in `sw.js` if you add files to the app.
