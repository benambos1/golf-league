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
A single self-contained `index.html`. Data saves in the browser's localStorage, so it stays on one device. Use **Download backup** / **Restore from backup** on the Roster tab to move it.
