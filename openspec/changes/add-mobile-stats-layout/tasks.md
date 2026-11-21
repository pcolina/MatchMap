# Tasks: add-mobile-stats-layout

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body. No API call changes, so no contract check is needed.

## 1. Translations

- [ ] **1.1 Stats label keys.** Test first: `packages/shared/test/stats-resume-i18n.spec.ts` checks that `stats.resume.label` has a non-empty value in `en` and in `es` (scenario "Label exists in both languages"). Code: add the key to `packages/shared/i18n/en.json` ("Statistics summary") and `packages/shared/i18n/es.json` ("Resumen de estadísticas"). Both texts go to "Translations to review" in the PR.

## 2. StatsResume component (`apps/mobile/src/app/shared/stats-resume/`)

- [ ] **2.1 Fixed height and accent background.** Test first: `stats-resume.test.ts` renders the component and checks that its height is 250 px (scenario "Panel height is 250 px"), and that its background is the `accent` token in light and dark scheme (scenarios "Panel background in light scheme" and "Panel background in dark scheme"). Code: `stats-resume.ts` with `:host` height 250 px and the `accent` token from `tokens.ts`.
- [ ] **2.2 No scroll.** Test first: the rendered tree has no `scroll-view` element and the content is clipped (scenarios "Panel does not scroll" and "Panel keeps its height in landscape"). Code: a `view` with `overflow: hidden`; no `scroll-view`.
- [ ] **2.3 Accessible pressable.** Test first: the panel is found with `getByRole('button', { name })` where the name is the translated `stats.resume.label` (scenario "Panel has an accessible name"). Code: a `pressable` with `accessibilityRole="button"` and `accessibilityLabel` from the translation key.
- [ ] **2.4 Press output.** Test first: tapping the panel emits one `press` event and nothing else (scenario "Panel emits a press"). Code: an output `press` wired to the pressable's `(press)`.

## 3. Main layout (`apps/mobile/src/app/shared/main-layout/`)

- [ ] **3.1 Two areas.** Test first: `main-layout.test.ts` checks that the screen has a map area followed by `app-stats-resume` at the bottom (scenario "Main screen shows both areas"). Code: the column in `main-layout.ts` with a map area and the panel.
- [ ] **3.2 Map area.** Test first: the map area has `flex: 1` and the `bg` token as background in light and dark scheme (scenarios "Map area takes the leftover height" and "Map area background is the neutral token"). Code: the map area style in `main-layout.ts`.
- [ ] **3.3 Safe area.** Test first: the panel is inside a `safe-area-view` so its bottom is above the bottom inset (scenario "Panel sits above the home indicator"). Code: wrap the layout in `safe-area-view`.

## 4. Checks and review

- [ ] **4.1 Full check (mobile).** Run `pnpm test` and `pnpm typecheck` in `apps/mobile`, and `pnpm test` in `packages/shared`. Paste the summary in the PR.
- [ ] **4.2 Visual check (mobile).** Done by the user on the Android emulator, with `pnpm mobile mock` and `pnpm android`: the map area is the neutral background above the 250 px green panel, the panel does not scroll, it stays above the home indicator, and it is tappable. Trial and error on the spacing is done here.
