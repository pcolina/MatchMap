# matchMap — Design kit v1.0

Everything needed to start development with the matchMap identity (direction **Atlas nocturno**).

**Start here:** [`docs/brand.md`](docs/brand.md) (the why) → [`docs/design.md`](docs/design.md) (the how) → [`tokens/`](tokens/) (the values).

## Contents

| Folder | What it contains | Where it goes in the monorepo |
|---|---|---|
| `docs/` | `brand.md`, `design.md` | `docs/` |
| `tokens/` | `tokens.json` (source of truth), `tokens.ts` (app), `tokens.css` (web), `contrast-report.md` | `apps/mobile/src/app/core/theme/` (the `.ts`) |
| `logo/symbol/` | Folded map only, no letters: transparent SVG + PNG at 256/512/1024 px wide, in 4 variants (on light, on dark, mono black, mono white) | `apps/mobile/assets/images/` or wherever needed |
| `logo/lockup/svg-sora/` | Logos with text in SVG that request the **Sora** font | — |
| `logo/lockup/png-preview-poppins/` | The same logos as PNG @1x/@2x, with the **provisional Poppins** font (see below) | Mockups and presentations |
| App icons | `icon.png` (1024, opaque), `adaptive-icon.png` (Android foreground), `monochrome-icon.png` (Android 13+), `splash-icon.png` (dark) / `splash-icon-light.png`, `favicon.png` | Already in `apps/mobile/assets/` and `apps/mobile/assets/images/` |
| Store icons | App Store icon (1024) and Google Play icon (512) | `docs/stores/` |
| Web icons | `favicon.ico` (16/32/48), `favicon.svg` (changes with the browser theme), favicon PNGs, `apple-touch-icon.png`, `icon-192/512`, `icon-maskable-512`, `site.webmanifest`, `head-snippet.html` | `apps/web/public/` (already there) |

## ⚠️ Source of the logos with text

When this kit was generated, the **Sora** font was not available, so the PNGs with text use **Poppins** as a provisional substitute. **The symbol, the app icons and the favicons have no text and are final.**

To get the final PNGs with text:

1. Install Sora 800 (Google Fonts, OFL licence).
2. Open any SVG in `logo/lockup/svg-sora/` in the browser, Figma or Inkscape: it already requests `font-family: Sora`.
3. Export to PNG. In Inkscape, first convert the text to paths (*Path → Object to Path*), so the logo does not depend on the font.

Or compose the text yourself next to `logo/symbol/`, following `design.md` §6.

## Fonts in the app (Expo)

```powershell
pnpm --filter @matchmap/mobile add @expo-google-fonts/sora @expo-google-fonts/inter expo-font
```

Run it from the repository root, never inside an app (`CLAUDE.md` §4).

Weights used: Sora 600/700/800 · Inter 400/500/600/700. Remember the `CLAUDE.md` rule: new dependencies must appear in the change that introduces them.

## Quick palette

| | Day | Night |
|---|---|---|
| Accent | `#0F7C80` | `#2DD4BF` |
| Background | `#F2F4F8` | `#0A0F1C` |
| Surface | `#FFFFFF` | `#121A2B` |
| Text | `#111827` | `#EEF2F8` |
| Secondary text | `#4B5563` | `#9AA6BA` |
| App icon (background) | `#111827` | — |
