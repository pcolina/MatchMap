# Tasks: add-globe-toggle

Each task starts with its failing test, run and shown failing before the code. Each task is one commit with its id in the body (`Task: 1.1`). Web only, phone-sized layout.

## 1. Projection store

- [ ] **1.1 Test first.** `apps/web/src/app/core/map-projection/map-projection.store.spec.ts`: the store defaults to `mercator` and `globe` is false when nothing is saved; `toggle()` switches to `globe` and writes `globe` under `matchmap.mapProjection`; a new store reads the saved `globe` back; a stored unknown value reads as `mercator`; when `localStorage` throws, `toggle()` still switches for the session and the store opens in `mercator`. Run it and show it failing.
- [ ] **1.2 Code.** `map-projection.store.ts` (`MapProjectionStore`, root-provided SignalStore, modelled on `ThemeStore`): state `projection`, computed `globe`, method `toggle()`, storage read and write inside `try/catch`. Run the test and show it passing.

## 2. Projection in the map style

- [ ] **2.1 Test first.** `apps/web/src/app/shared/map-view/map-view.style.spec.ts`: `buildMapStyle(states, scheme, 'globe')` has a top-level `projection` of `{ type: 'globe' }`; `'mercator'` gives `{ type: 'mercator' }`; the states and the scheme are unchanged. Run it and show it failing.
- [ ] **2.2 Code.** `map-view.style.ts`: add the `projection` argument and the top-level field. Run the test and show it passing.

## 3. Map view input

- [ ] **3.1 Test first.** `apps/web/src/app/shared/map-view/map-view.spec.ts`: the component has an input `projection` with default `mercator`; changing it to `globe` rebuilds the style with the globe projection and keeps the states; the map is created with the projection in use. Run it and show it failing.
- [ ] **3.2 Code.** `map-view.ts`: the `projection` input, passed to `buildMapStyle` in the constructor and in the effect. Run the test and show it passing.

## 4. Toggle emits a press

- [ ] **4.1 Test first.** `apps/web/src/app/shared/map-controls/map-bottom-controls.spec.ts`: clicking the button emits `pressed` once; `aria-pressed` is true when `globeActive` is true and false otherwise; the accessible name is `map.controls.mercator` when the globe is active and `map.controls.globe` otherwise. Run it and show it failing.
- [ ] **4.2 Code.** `map-bottom-controls.ts`: output `pressed`, emitted from the button's click. Run the test and show it passing.

## 5. Wiring in the main layout

- [ ] **5.1 Test first.** `apps/web/src/app/shared/main-layout/main-layout.spec.ts`: pressing the view toggle switches the store to `globe`, the toggle shows `aria-pressed` true, and the map view receives `projection` `globe`; pressing it again returns to `mercator`. Run it and show it failing.
- [ ] **5.2 Code.** `main-layout.ts`: inject `MapProjectionStore`; bind `[globeActive]`, `(pressed)` on `app-map-bottom-controls` and `[projection]` on `app-map-view`. Run the test and show it passing.

## 6. Accessibility

- [ ] **6.1 Test first.** `apps/web/src/app/features/auth/pages/accessibility.spec.ts`: add the main layout with the globe projection on, to the axe list. Run it and show it failing if there is a violation, or show it passing with the entry added first.
- [ ] **6.2 Code.** Fix any violation axe reports. Run the test and show it passing.

## 7. Checks

- [ ] **7.1 Full check.** `pnpm check` for `apps/web` (and `packages/shared` if touched), from the repo root, with the summary in the PR. Plus `pnpm build:web`, with the output.
- [ ] **7.2 Browser check.** In Chrome, at 320, 360 and 600 px, in day and night mode: switch to the globe and back, check that the zoom is unchanged after each switch, that the colours and outlines match in both projections, that the choice survives a reload, and that the flicker on switching is not visible. Done by the owner, as with the earlier visual checks, with the steps in the PR.

## Out of scope in these tasks

- The mobile app (its own change, after this one is archived).
- Tablet and laptop layouts.
- Any change to the country data, the states, the capital points or the i18n catalogues.
