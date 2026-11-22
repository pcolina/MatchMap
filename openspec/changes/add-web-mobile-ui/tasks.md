# Tasks: add-web-mobile-ui

Each task starts with its failing test, run and shown failing before the code. Each task is one commit with its id in the body (`Task: 1.1`). Web only; the controls are presentational, with inputs and no outputs.

## 1. Translation keys

- [x] **1.1 Test first.** `packages/shared/test/map-controls-i18n.spec.ts`: `map.controls.addPlace`, `friends`, `account`, `attribution`, `globe` and `mercator` exist in `en.json` and `es.json`, with non-empty strings and the same keys in both languages. Run it and show it failing.
- [x] **1.2 Code.** Add the six keys to `packages/shared/i18n/en.json` and `es.json` with the texts of `design.md` section 7. Run the test and show it passing.

## 2. Bottom controls: attribution and view toggle

- [x] **2.1 Test first.** `apps/web/src/app/shared/map-controls/map-bottom-controls.spec.ts`: the attribution button comes before the view toggle in the DOM; both are native `<button>` elements with the accessible names from `map.controls.attribution` and `map.controls.globe`/`mercator`; the toggle has `aria-pressed` equal to `globeActive`; the icon changes shape when `globeActive` changes. Run it and show it failing.
- [x] **2.2 Code.** `map-bottom-controls.ts`, `.css` and the template: a row with the info button and the toggle, 44 × 44 px hit areas, `--mm-color-surface` background, `--mm-color-borderStrong` border. Icons `tablerInfoCircle`, `tablerWorld` and `tablerMap` through `NgIcon`. Run the test and show it passing.

## 3. Top controls: add, friends and account

- [x] **3.1 Test first.** `apps/web/src/app/shared/map-controls/map-top-controls.spec.ts`: the add-place button is above the friends button in the same column; the account button is the only control at the top right; each control is a native button with its accessible name; the account shows a grey placeholder when `avatarLoading` is true and the user icon otherwise. Run it and show it failing.
- [x] **3.2 Code.** `map-top-controls.ts`, `.css` and the template: a column at the top left and one account button at the top right, with `safe-area-inset-top` added to the offset. Icons `tablerPlus`, `tablerUsers` and `tablerUser`. Run the test and show it passing.

## 4. Layout and focus order

- [x] **4.1 Test first.** `apps/web/src/app/shared/main-layout/main-layout.spec.ts`: on a phone viewport the DOM order is top controls, map, stats panel, bottom controls, so keyboard focus follows the spec. The map area is a relative container that holds the top and bottom controls as overlays. Run it and show it failing.
- [x] **4.2 Code.** `main-layout.ts` and `main-layout.css`: wrap `app-map-view` in `.map-area` (relative, flex 1). Place `app-map-top-controls` before the map and `app-map-bottom-controls` after the stats panel, both absolutely positioned inside the map area. Run the test and show it passing.

## 5. Attribution without the MapLibre logo

- [x] **5.1 Test first.** `apps/web/src/app/shared/map-view/map-view.spec.ts`: the MapLibre constructor receives `attributionControl: false`, so the MapLibre logo and its credit are not added to the map. Run it and show it failing.
- [x] **5.2 Code.** `map-view.ts`: pass `attributionControl: false`. Run the test and show it passing. The existing web map tests keep passing.

## 6. Accessibility

- [ ] **6.1 Test first.** `apps/web/src/app/features/auth/pages/accessibility.spec.ts` (or the file that lists the page checks): add `MainLayout` with the phone controls to the axe list, so that axe reports no violations for the top controls, the bottom controls and the main screen. Run it and show it failing if any violation exists, or show it passing with the list entry added first.
- [ ] **6.2 Code.** Fix any violation axe reports, without changing the design. Run the test and show it passing.

## 7. Checks

- [ ] **7.1 Full check.** `pnpm check` for `packages/shared` and `apps/web`, with the summary in the PR. Plus `pnpm build:web` and the output of the build.
- [ ] **7.2 Phone widths.** Check the layout at 320 px, 360 px and 600 px, in light and dark mode, in the browser (Chrome or Edge). Record the screenshots in the PR. Done by the owner, as with the earlier visual checks.

## Out of scope in these tasks

- The ⓘ action (its modal and its text), which comes with the avatar change.
- The full-screen button, which comes with the stats component change.
- The stats panel tap requirement, which conflicts with the idea of a single tappable button and is resolved with the stats component.
