# Tasks: add-web-mobile-layout

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body. No API call changes, so no contract check is needed. The label key `stats.resume.label` already exists in `packages/shared/i18n` (added by the mobile change).

## 1. StatsResume component (`apps/web/src/app/shared/stats-resume/`)

- [x] **1.1 Fixed height and accent background.** Test first: `stats-resume.spec.ts` checks that the panel is 250 px high (scenario "Panel height is 250 px") and that its background is the `accent` token in light and dark scheme (scenarios "Panel background in light scheme" and "Panel background in dark scheme"). Code: `stats-resume.ts` and `stats-resume.css` with the `--mm-*` accent variable from `tokens.css`.
- [x] **1.2 No scroll.** Test first: the panel has `overflow: hidden` and is not a scrollable element (scenario "Panel does not scroll"). Code: the `overflow: hidden` rule.
- [x] **1.3 Accessible button.** Test first: the panel is found with `getByRole('button', { name })` where the name is the translated `stats.resume.label` (scenario "Panel has an accessible name"). Code: a native `<button>` with `aria-label` from the translation key.
- [x] **1.4 Press output.** Test first: a click emits one `press` event (scenario "Panel emits a press"), and Enter on the focused panel emits one `press` event (scenario "Panel is activated with the keyboard"). Code: the `press` output, wired to `(click)`; the native button handles Enter.

## 2. Main layout (`apps/web/src/app/shared/main-layout/`)

- [x] **2.1 Two areas at phone width.** Test first: `main-layout.spec.ts` checks that the main screen has the map area above `app-stats-resume` (scenario "Both areas are shown"). Code: the column in `main-layout.ts` with `app-map-view` and the panel.
- [x] **2.2 Map area takes the leftover height.** Test first: the map area has `flex: 1` and the panel has the fixed height, so the map area's height equals the viewport minus the panel (scenario "Map area takes the leftover height"). Code: `main-layout.css`.
- [x] **2.3 Phone breakpoint.** Test first: the stylesheet applies the phone layout in a `@media (max-width: 600px)` rule and keeps the current layout otherwise (scenarios "Phone layout at 600 px", "Current layout above 600 px", "Phone layout at 320 px"). Code: the media rule in `main-layout.css`. jsdom does not evaluate media queries, so this test reads the stylesheet rule text.
- [x] **2.4 Safe area.** Test first: the bottom of the panel is padded with `env(safe-area-inset-bottom)` (scenario "Panel sits above the bottom inset"). Code: the padding rule in `main-layout.css`.

## 3. Checks and review

- [x] **3.1 Full check (web).** Run `pnpm test` in `apps/web`, the web `ngc` check, and `pnpm build:web`. Paste the summary in the PR.
- [x] **3.2 Visual check (web).** Accepted by the owner in the browser at phone width and above 600 px.

## 4. Laptop layout (`web-laptop-layout`, added by the owner)

The header and the footer are empty components in `apps/web/src/app/shared/` (`layout-header/` and `layout-footer/`), with the `accent` token, as the decided spec says.

- [x] **4.1 Header bar.** Test first: `layout-header.spec.ts` checks that the header has the `accent` background in the light and in the dark scheme (scenario "Header has the accent background") and that its width is the full viewport (scenario "Header spans the full width"). Code: `layout-header.ts` and `layout-header.css`.
- [x] **4.2 Footer bar.** Test first: `layout-footer.spec.ts` checks the same two scenarios for the footer, "Footer has the accent background" and "Footer spans the full width at the bottom". Code: `layout-footer.ts` and `layout-footer.css`.
- [x] **4.3 Laptop layout order and map height.** Test first: `main-layout.spec.ts` checks, in the stylesheet, that from 601 px the screen is a column with the header, a map area of 50 % of the viewport height (scenario "Map area is 50 % of the viewport height"), the stats panel with the remaining height (scenario "Stats panel fills the remaining height") and the footer; and that the laptop rules start at `min-width: 601px` (scenarios "Laptop layout at 601 px" and "Phone layout at 600 px"). Code: `main-layout.ts` and `main-layout.css`. jsdom does not evaluate media queries, so the test reads the stylesheet, as in 2.3.
- [x] **4.4 Stats panel without scroll on laptop.** Test first: the `stats-resume` panel has `overflow: hidden` at laptop width (scenario "Stats panel does not scroll" for laptop). Code: the laptop rule in `main-layout.css`.
- [ ] **4.5 Full check (web, laptop).** Run `pnpm test` in `apps/web`, the web `ngc` check, and `pnpm build:web`. Paste the summary in the PR.
- [ ] **4.6 Visual check (laptop).** Done by the owner in the browser above 601 px: header and footer in accent with their height as they look, the map at half the height, the stats panel with the rest. Trial and error on the header and footer heights is done here; the owner gives the final values. Done by the owner in the browser at phone width with `pnpm web mock` (http://localhost:4333), and above 600 px to confirm the current layout. This is the definitive acceptance of the spec.
