# matchMap — Design system (design.md)

> **Version 1.0 · 26 Oct 2026 · Visual direction: Atlas nocturno**
> This document defines **how the interface looks and behaves**. The **why** (purpose, audience, personality, tone, tagline) is in [`brand.md`](./brand.md): read it first.
> Source of truth for the values: [`../tokens/tokens.json`](../tokens/tokens.json). If this document and `tokens.json` disagree, `tokens.json` wins.

---

## 0. Golden rules (for people and for Claude)

1. **Never write a colour, size, radius or spacing by hand.** Always import from `tokens.ts` (app) or use the `--mm-*` variables from `tokens.css` (web). Styles are component CSS in both apps; Tailwind and utility-class libraries are not used.
2. **One accent only: turquoise.** It is used for the main action, the match and the ego counter. There is no second brand colour.
3. **At most one primary button per screen.**
4. **Day and night, always.** Every component is designed and tested in both modes. By default it follows the system mode.
5. **AA minimum.** Text ≥ 4.5:1, large text (≥ 24 px, or ≥ 18.5 px bold) and graphic elements ≥ 3:1. See [`../tokens/contrast-report.md`](../tokens/contrast-report.md).
6. **Colour is never the only cue.** On the map, every state also has a border or pattern (colour-blindness requirement for the MVP).
7. **Touch targets ≥ 44 × 44 pt.**
8. **No visible text is hard-coded:** everything is an i18n key (`feature.screen.element`), with `en` and `es` values.
9. **Mobile first.** The map is the main screen and takes almost the whole screen. The rest lives in cards and in the bottom sheet.
10. For any design question not covered here: **ask, do not invent** (same as `CLAUDE.md` §12).

---

## 1. Brand in one line

**Tagline:** «Compara, planea, descubre.» [Compare, plan, discover.] (sign-in page, set in Caveat 600 and slanted `skewX(-4deg)`)
**Personality:** companionable but not intrusive · smart but not technical · adventurous but not reckless.
**Compass:** *fresh* (airy, bright colours that do not shout, humour) + *useful* (the match is understood in 2 seconds, zero tables) + *visible ego* (the counter always in view).
→ Full detail in [`brand.md`](./brand.md).

---

## 2. Colour

Each token has a **day** and a **night** value. Hex in uppercase.

### 2.1 Interface

| Token | Day | Night | Use |
|---|---|---|---|
| `accent` | `#0F7C80` | `#2DD4BF` | Primary button, match, ego counter, links, selection |
| `onAccent` | `#FFFFFF` | `#04201C` | Text and icons on `accent` |
| `accentSubtle` | `#D5EFED` | `#0E3B3A` | Background of selected chips or badges, soft highlights |
| `bg` | `#F2F4F8` | `#0A0F1C` | Screen background |
| `surface` | `#FFFFFF` | `#121A2B` | Cards, bottom sheet, tab bar |
| `surfaceRaised` | `#FFFFFF` | `#18223A` | Modals and menus above `surface` |
| `text` | `#111827` | `#EEF2F8` | Main text |
| `textSecondary` | `#4B5563` | `#9AA6BA` | Secondary text, labels, legends |
| `border` | `#E1E5EC` | `#222C40` | Card borders, separators, bar tracks |
| `borderStrong` | `#C3CCD9` | `#3B4660` | Input borders and inactive focus |
| `success` | `#15803D` | `#4ADE80` | Confirmations |
| `warning` | `#B45309` | `#FBBF24` | Warnings (e.g. visa required) |
| `danger` | `#B91C1C` | `#F87171` | Errors, destructive actions |
| `onDanger` | `#FFFFFF` | `#0A0F1C` | Text and icons on `danger` (destructive button) |
| `info` | `#1D4ED8` | `#60A5FA` | Neutral information (e.g. date of the visa data) |

> `accent` on `bg` in day mode gives 4.5:1, right at the AA limit. For small text in the accent colour, prefer it on `surface` (5.0:1).

### 2.2 Map (MapLibre)

The map colours are **muted** (ocean and land), so the accent stands out only where it matters.

| Token | Day | Night | Use | Extra cue (colour blindness) |
|---|---|---|---|---|
| `map.ocean` | `#CCD7E6` | `#0A1324` | Water | — |
| `map.land` | `#E8ECF2` | `#1D2638` | Country without a pin («to discover») | — |
| `map.countryBorder` | `#FFFFFF` | `#0A1324` | Borders, 0.5–1 px | — |
| **Personal map** | | | | |
| `map.visited` | `#0F7C80` | `#2DD4BF` | `VISITED` | Solid fill |
| `map.lived` | `#0A5458` | `#99F6E4` | `LIVED` | Solid fill + 2 px `text` border |
| `map.wantToGo` | `#E3F4F2` | `#0C3432` | `WANT_TO_GO` | Dashed 1.5 px `accent` border (very light fill: the border is the cue) |
| **Compare with a friend** | | | | |
| `map.compareBoth` | `#0F7C80` | `#2DD4BF` | You have both been there (the «match») | Solid fill |
| `map.compareOnlyMe` | `#98D5D0` | `#12665D` | Only me | Dot pattern |
| `map.compareOnlyFriend` | `#A9B3C2` | `#3B4660` | Only my friend | Diagonal stripe pattern |
| **Group proposals** | | | | |
| `map.excludedVisited` | `#CBD2DD` | `#2B3448` | Someone in the group has already been (excluded) | Opacity 0.6 |
| `map.score1` … `score5` | `#D5EFED` `#A6DCD7` `#4FB3AE` `#1A8F92` `#0F7C80` | `#0E3B3A` `#16776F` `#169184` `#22B8A6` `#2DD4BF` | Sequential score scale (0–100 in 5 bands: 0–19, 20–39, 40–59, 60–79, 80–100) | 1 px `text` border on every scored country, and the % on the card or tooltip |

Light fills do not reach 3:1 against `map.land`. That is why every state carries a cue that does not depend on colour (border, pattern or opacity). Each map token has its own value; only `visited`, `compareBoth` and `score5` share the accent, on purpose. The palette needs a visual review on the real map before it is considered closed.

---

## 3. Typography

| Family | Role | Weights | Expo package |
|---|---|---|---|
| **Sora** | Display: logotype, titles, counter, destination names | 600 · 700 · 800 | `@expo-google-fonts/sora` |
| **Inter** | Text: body, UI, buttons, labels | 400 · 500 · 600 · 700 | `@expo-google-fonts/inter` |
| **Caveat** | Handwritten accent: the sign-in tagline only, slanted `skewX(-4deg)` | 600 | `@expo-google-fonts/caveat` |

All are Google Fonts under the **SIL Open Font License** (free commercial use). Do not use other families or weights.

### Scale (sizes in pt/dp; line-height in pt)

| Style | Family | Weight | Size / Line height | Tracking | Use |
|---|---|---|---|---|---|
| `counter` | Sora | 800 | 48 / 52 | −1 | The ego number («23 cities») |
| `display` | Sora | 800 | 32 / 40 | −0.5 | Featured destination, onboarding |
| `title1` | Sora | 700 | 24 / 32 | −0.25 | Screen title |
| `title2` | Sora | 700 | 20 / 28 | 0 | Section or card title |
| `title3` | Sora | 600 | 17 / 24 | 0 | Subtitle, name in a list |
| `body` | Inter | 400 | 16 / 24 | 0 | General text |
| `bodyStrong` | Inter | 600 | 16 / 24 | 0 | Emphasis |
| `callout` | Inter | 400 | 14 / 20 | 0 | Secondary text, match explanations |
| `label` | Inter | 600 | 14 / 20 | 0 | Chips, tabs, form labels |
| `caption` | Inter | 500 | 12 / 16 | +0.2 | Legends, dates, metadata |
| `button` | Inter | 700 | 16 / 20 | 0 | Buttons |

- Respect the system text scaling (Dynamic Type / font scale). Layouts must not break at 130 %.
- Numbers use `fontVariant: ['tabular-nums']` in counters, rankings and percentages.

---

## 4. Spacing, radii, elevation and motion

**Spacing (base 4):** `space.1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=20 · `6`=24 · `8`=32 · `10`=40 · `12`=48 · `16`=64.

- Screen side margin: `space.5` (20).
- Card padding: `space.4` (16).
- Gap between cards: `space.3` or `space.4`.

**Radii:** `sm`=8 (small chips) · `md`=12 (inputs, member chips) · `lg`=16 (buttons) · `xl`=20 (cards, bottom sheet) · `xxl`=32 (full-screen modals) · `pill`=999 (badges, avatars).

**Elevation:**

- **Day:** cards have a very soft shadow (`elevation.card`) + `border`.
- **Night:** no shadows. Depth is shown with `surface` → `surfaceRaised` + `border`.
- The bottom sheet uses `elevation.sheet`.

**Motion:**

- Durations: `fast` 150 ms (presses, toggles) · `base` 250 ms (panels, state changes) · `slow` 400 ms (match celebrations).
- Curve: `cubic-bezier(0.2, 0, 0, 1)`.
- Respect the system «Reduce motion» setting: no decorative animations.

**Sizes:** minimum touch target 44 · button height 52 · input 48 · tab bar 56 · icons 16/20/24.

---

## 5. Iconography

- **Tabler** (`@ng-icons/tabler-icons`, used with `NgIcon` on web and on mobile): 2 px stroke, rounded corners, size 20 by default and 24 in the tab bar. It also provides the brand logos for social sign-in (Google, Facebook, Apple).
- Icons use the `text` or `textSecondary` colour, and `onAccent` inside primary buttons.
- Never emojis as interface icons (they are allowed in user content).
- Icons that work as buttons have an `accessibilityLabel`.
- Adding `@ng-icons/core` and `@ng-icons/tabler-icons` is a new dependency: under `CLAUDE.md`, it must appear in the change that introduces it. On mobile, ng-native only renders icons from ng-icons sets, which is why `lucide-react-native` is not used.

---

## 6. Logo

Concept: a **map folded like an accordion** whose top edge draws two M's (**M**atch + **M**ap). The central fold uses the accent colour and represents what the group shares.

| Piece | File | When |
|---|---|---|
| Symbol on light | `logo/symbol/*/symbol-on-light.*` | Light backgrounds |
| Symbol on dark | `logo/symbol/*/symbol-on-dark.*` | Dark backgrounds, app icon |
| Monochrome symbol | `symbol-mono-black` / `symbol-mono-white` | Single colour (stamps, print, Android themed icon) |
| Horizontal (main) | `logo/lockup/*/horizontal-on-*.svg` | Headers, web, emails |
| Stacked (+ tagline) | `logo/lockup/*/stacked-*` | Splash, social networks, posters |

- **Logotype:** `match` in the `text` colour + `Map` in `accent`, **Sora 800**, tracking about −1.5 %. Always one word, with the M of Map capitalised.
- **Clear space:** around the logo, at least the width of one fold (1/5 of the symbol's width).
- **Minimum size:** symbol 16 px (favicon) · horizontal 96 px wide.
- **Do not:** change the fold colours, rotate it, add shadows or gradients, or place the symbol on photos without a background plate.
- ⚠️ The PNGs in `png-preview-poppins/` use **provisional Poppins** because Sora was not available when they were generated. The SVGs in `svg-sora/` already request Sora: with Sora installed they render correctly. See `docs/design-kit.md` to regenerate them.

---

## 7. Key components (MVP)

> Visual specification. The implementation follows `apps/mobile/AGENTS.md` and `apps/web/AGENTS.md`: presentational components in `shared/` or `features/*/ui/`, OnPush and no business logic.

### 7.1 Button

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| `primary` | `accent` | `onAccent` | — | One main action per screen («See the group route», «Add destination») |
| `secondary` | `surface` | `text` | 1 px `borderStrong` | Alternative actions |
| `ghost` | transparent | `accent` | — | Tertiary actions, «See all» |
| `destructive` | `danger` | `onDanger` | — | Delete account, remove friend (always with confirmation) |

Height 52, radius `lg`, horizontal padding 20, text in the `button` style. States:

- **Pressed:** opacity 0.85 + scale 0.98.
- **Disabled:** opacity 0.4.
- **Loading:** spinner in `onAccent`, same width.
- **Focus (keyboard or screen reader):** every interactive element shows the same focus style: a 3 px `accent` ring (the `borderWidth.focus` token of 2 px plus 1 px), offset 2 px, and an outer halo in `accent` that fades out in three layers at 45 %, 35 % and 18 % opacity (spread 4 px, blur 20 px with spread 8 px, blur 40 px with spread 16 px). The halo is defined once as `--mm-focus-halo` in `apps/web/src/styles.css`, and components that set their own `box-shadow` (such as the language switcher) add it back on `:focus-visible`, so the halo is never lost.

### 7.2 Ego counter (`EgoCounter`)

Always visible at the top of Map and Profile.

- Number in `counter` in the `accent` colour + unit («cities») in `bodyStrong` + summary in `callout` `textSecondary` («9 countries · 4 % of the world»).
- **Mini group ranking:** up to 3 rows (name · bar · number). The user's bar uses `accent` and the others use `map.compareOnlyFriend`, with the track in `border`. Bar height 8, radius 4.
- Friendly rivalry copy under the ranking: «Vas 2.º del grupo. Marta te saca 8 ciudades.» [You're 2nd in the group. Marta is 8 cities ahead of you.]
- When a country is added: the number counts up (`slow`) and a celebration toast appears.

### 7.3 Match card (`MatchCard`)

- Context in `callout` `textSecondary` («Escapada con Marta y Javi» [Getaway with Marta and Javi]).
- Destination in `display` (Sora 800 32).
- **Badge** `«91 % match»`: `accent` background, `onAccent` text, `label`, radius `pill`, padding 6 × 12.
- Hook line in `body` («Nadie del grupo ha ido. Ya no hay excusa.» [Nobody in the group has been. No more excuses.]).
- **Reasons** (F4 / G5): chips in `caption`, `accentSubtle` background.
- **Members:** chips with a 24 avatar (initials), name and individual affinity.
- **Visa notice** (if applicable): icon + text in `warning`.

### 7.4 Chip / filter

Height 36, radius `pill`, `label` style.

- **Inactive:** `surface` + `border` border.
- **Active:** `accentSubtle` background, `accent` text (day) or `text` (night), and a 16 check.

### 7.5 Map legend

A wrapping row. Each item has a 10 × 10 swatch (circle for the accent, square for the rest) and text in `caption` `textSecondary`. The swatch also shows the extra cue (dashed border or stripes).

### 7.6 Bottom sheet (when a country is tapped)

`surface`, radius `xl` at the top, `elevation.sheet`, and a 36 × 4 handle in `borderStrong`. Contains:

- Flag (optional) and country name in `title2`.
- Three status buttons (Visited · Want to go · Have lived) as a segmented control: the selected one uses `accent`/`onAccent`.
- Optional year and note.

### 7.7 Tab bar

Four tabs (Map · Destinations · Friends · Profile), `surface` background and a `border` top edge.

- **Icon + label:** label in `caption`.
- **Active:** `accent`.
- **Inactive:** `textSecondary`.

### 7.8 Empty states

A minimal illustration with the symbol in monochrome `textSecondary` at 30 %, a witty headline and a CTA. Example: «Tu mapa está más vacío que un aeropuerto a las 4 a. m. → Añade tu primer país» [Your map is emptier than an airport at 4 a.m. → Add your first country].

### 7.9 Loading (skeleton screens)

On every screen of the app, while content loads or a request runs, the screen shows a skeleton screen instead of a spinner. A skeleton screen is grey placeholder blocks with the shape of the content they replace: cards, text lines, buttons and input fields. The blocks keep the layout of the final screen, so nothing jumps when the content arrives.

- Colour of the blocks: `border`.
- Animation: a soft opacity pulse. With the system «Reduce motion» setting, the blocks are static, as section 4 requires.
- Pulse duration: `base` (250 ms).

---

## 8. Screen patterns

- **Map (home):** full-screen map → compact floating `EgoCounter` at the top (`surface` card at 92 % opacity) → «Add destination» FAB at the bottom right (`accent`, 56 × 56, radius `xl`) → bottom sheet when a country is tapped.
- **Compare:** friend selector at the top → tabs Map · Differences · Wishlist · Ideas → the compatibility % always visible in a match badge.
- **Travel group:** header with avatars → list of `MatchCard` sorted by score → List/Map toggle.
- **Onboarding:** 2 or 3 slides with the tagline → sign-up → **mark the first 3–5 countries** with quick gestures (not 30), with the promise «The more you mark, the better the match» [«Cuantos más marques, mejor match»].

---

## 9. Voice and tone in the interface

Informal, using "tú", with humour and some hook, but **never at the expense of clarity**. The fact comes first and the joke after.

| ✅ Yes | ❌ No |
|---|---|
| «91 % de match con Eslovenia. Nadie ha ido. Ya no hay excusa.» [91 % match with Slovenia. Nobody has been. No more excuses.] | «Coincidencia calculada: 0,91.» [Calculated match: 0.91.] |
| «¿Otra vez a la playa de siempre? Ni de broma.» [The same beach again? No way.] | «Recomendaciones disponibles.» [Recommendations available.] |
| «Vas 2.º. Marta te saca 8 ciudades.» [You're 2nd. Marta is 8 cities ahead.] | Humour in serious errors or in privacy and visa topics |

- **Errors:** clear and kind, no jokes: «No hemos podido guardar el país. Revisa tu conexión y vuelve a intentarlo.» [We could not save the country. Check your connection and try again.]
- **Visas and privacy:** neutral and precise tone, always with the date of the data.

---

## 10. Accessibility (checklist per screen)

- [ ] AA contrast in day and night (use only pairs from the `contrast-report.md` table).
- [ ] Map states distinguishable without colour (border or pattern) and readable by a screen reader («France, visited»).
- [ ] Touch targets ≥ 44.
- [ ] Text at 130 % without cut-offs.
- [ ] Logical focus order; `accessibilityRole` and `accessibilityLabel` on everything interactive.
- [ ] «Reduce motion» respected.

---

## 11. Where each file is

| What | Path |
|---|---|
| Brand and design | `docs/brand.md`, `docs/design.md` |
| Kit guide (logos, icons, fonts) | `docs/design-kit.md` |
| Tokens (source and generated) | `tokens/tokens.json` (source), `tokens/tokens.ts`, `tokens/tokens.css`, `tokens/contrast-report.md` |
| Tokens in the app | `apps/mobile/src/app/core/theme/tokens.ts` |
| Logo | `logo/symbol/`, `logo/lockup/` |
| Mobile app icons | `apps/mobile/assets/images/` |
| Store icons | `docs/stores/` |
| Web icons, manifest and `tokens.css` | `apps/web/public/` |
