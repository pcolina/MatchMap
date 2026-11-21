# Tasks: add-web-mobile-layout

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body. No API call changes, so no contract check is needed. The label key `stats.resume.label` already exists in `packages/shared/i18n` (added by the mobile change).

## 1. StatsResume component (`apps/web/src/app/shared/stats-resume/`)

- [x] **1.1 Fixed height and accent background.** Test first: `stats-resume.spec.ts` checks that the panel is 250 px high (scenario "Panel height is 250 px") and that its background is the `accent` token in light and dark scheme (scenarios "Panel background in light scheme" and "Panel background in dark scheme"). Code: `stats-resume.ts` and `stats-resume.css` with the `--mm-*` accent variable from `tokens.css`.
- [ ] **1.2 No scroll.** Test first: the panel has `overflow: hidden` and is not a scrollable element (scenario "Panel does not scroll"). Code: the `overflow: hidden` rule.
- [ ] **1.3 Accessible button.** Test first: the panel is found with `getByRole('button', { name })` where the name is the translated `stats.resume.label` (scenario "Panel has an accessible name"). Code: a native `<button>` with `aria-label` from the translation key.
- [ ] **1.4 Press output.** Test first: a click emits one `press` event (scenario "Panel emits a press"), and Enter on the focused panel emits one `press` event (scenario "Panel is activated with the keyboard"). Code: the `press` output, wired to `(click)`; the native button handles Enter.

## 2. Main layout (`apps/web/src/app/shared/main-layout/`)

- [ ] **2.1 Two areas at phone width.** Test first: `main-layout.spec.ts` checks that the main screen has the map area above `app-stats-resume` (scenario "Both areas are shown"). Code: the column in `main-layout.ts` with `app-map-view` and the panel.
- [ ] **2.2 Map area takes the leftover height.** Test first: the map area has `flex: 1` and the panel has the fixed height, so the map area's height equals the viewport minus the panel (scenario "Map area takes the leftover height"). Code: `main-layout.css`.
- [ ] **2.3 Phone breakpoint.** Test first: the stylesheet applies the phone layout in a `@media (max-width: 600px)` rule and keeps the current layout otherwise (scenarios "Phone layout at 600 px", "Current layout above 600 px", "Phone layout at 320 px"). Code: the media rule in `main-layout.css`. jsdom does not evaluate media queries, so this test reads the stylesheet rule text.
- [ ] **2.4 Safe area.** Test first: the bottom of the panel is padded with `env(safe-area-inset-bottom)` (scenario "Panel sits above the bottom inset"). Code: the padding rule in `main-layout.css`.

## 3. Checks and review

- [ ] **3.1 Full check (web).** Run `pnpm test` in `apps/web`, the web `ngc` check, and `pnpm build:web`. Paste the summary in the PR.
- [ ] **3.2 Visual check (web).** Done by the owner in the browser at phone width with `pnpm web mock` (http://localhost:4333), and above 600 px to confirm the current layout. This is the definitive acceptance of the spec.
