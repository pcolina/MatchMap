# WCAG contrast report

Generated from `tokens.json` (v1.0.0).

| Combination | Min. | Day | Night | Type |
|---|---|---|---|---|
| Text on background (`text` / `bg`) | 4.5:1 | 16.11:1 ✅ | 17.02:1 ✅ | text |
| Text on card (`text` / `surface`) | 4.5:1 | 17.74:1 ✅ | 15.47:1 ✅ | text |
| Secondary text on background (`textSecondary` / `bg`) | 4.5:1 | 6.86:1 ✅ | 7.78:1 ✅ | text |
| Secondary text on card (`textSecondary` / `surface`) | 4.5:1 | 7.56:1 ✅ | 7.07:1 ✅ | text |
| Primary button text (`onAccent` / `accent`) | 4.5:1 | 4.98:1 ✅ | 9.18:1 ✅ | text |
| Accent as text on card (`accent` / `surface`) | 4.5:1 | 4.98:1 ✅ | 9.34:1 ✅ | text |
| Accent as text on background (`accent` / `bg`) | 4.5:1 | 4.52:1 ✅ | 10.27:1 ✅ | text |
| Destructive button text (`onDanger` / `danger`) | 4.5:1 | 6.47:1 ✅ | 6.91:1 ✅ | text |
| Success (text) (`success` / `surface`) | 4.5:1 | 5.02:1 ✅ | 9.97:1 ✅ | text |
| Warning (text) (`warning` / `surface`) | 4.5:1 | 5.02:1 ✅ | 10.41:1 ✅ | text |
| Error (text) (`danger` / `surface`) | 4.5:1 | 6.47:1 ✅ | 6.28:1 ✅ | text |
| Info (text) (`info` / `surface`) | 4.5:1 | 6.70:1 ✅ | 6.84:1 ✅ | text |
| `map.visited` fill vs land (`map.land`) | 3:1 | 4.20:1 ✅ | 8.14:1 ✅ | non-text |
| `map.lived` fill vs land (`map.land`) | 3:1 | 7.31:1 ✅ | 12.01:1 ✅ | non-text |
| `map.compareBoth` fill vs land (`map.land`) | 3:1 | 4.20:1 ✅ | 8.14:1 ✅ | non-text |
| `map.score5` fill vs land (`map.land`) | 3:1 | 4.20:1 ✅ | 8.14:1 ✅ | non-text |
| `map.wantToGo` fill vs land (`map.land`) | 3:1 | 1.04:1 ⚠️ extra cue | 1.12:1 ⚠️ extra cue | non-text |
| `map.compareOnlyMe` fill vs land (`map.land`) | 3:1 | 1.39:1 ⚠️ extra cue | 2.22:1 ⚠️ extra cue | non-text |
| `map.compareOnlyFriend` fill vs land (`map.land`) | 3:1 | 1.79:1 ⚠️ extra cue | 1.61:1 ⚠️ extra cue | non-text |
| `map.excludedVisited` fill vs land (`map.land`) | 3:1 | 1.28:1 ⚠️ extra cue | 1.22:1 ⚠️ extra cue | non-text |
| `map.score1` fill vs land (`map.land`) | 3:1 | 1.02:1 ⚠️ extra cue | 1.23:1 ⚠️ extra cue | non-text |
| `map.score2` fill vs land (`map.land`) | 3:1 | 1.28:1 ⚠️ extra cue | 2.81:1 ⚠️ extra cue | non-text |
| `map.score3` fill vs land (`map.land`) | 3:1 | 2.11:1 ⚠️ extra cue | 3.91:1 ✅ | non-text |
| `map.score4` fill vs land (`map.land`) | 3:1 | 3.29:1 ✅ | 6.11:1 ✅ | non-text |
| Dashed border of `wantToGo` (`accent`) vs land | 3:1 | 4.20:1 ✅ | 8.14:1 ✅ | non-text |
| 1 px `text` outline (score scale) vs land | 3:1 | 14.96:1 ✅ | 13.48:1 ✅ | non-text |
| `map.visited` vs `map.wantToGo` (luminance) | 1.5:1 | 4.39:1 ✅ | 7.26:1 ✅ | non-text |
| `map.compareBoth` vs `map.compareOnlyMe` (luminance) | 1.5:1 | 3.03:1 ✅ | 3.66:1 ✅ | non-text |

**Reading:** `⚠️ extra cue` marks a graphic element below 3:1 that is also identified by a border, pattern or opacity (see `docs/design.md` §2.2). Map states do not depend on colour alone.
