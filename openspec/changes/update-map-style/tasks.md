# Tasks: update-map-style

Each task names its failing test first, then the code that makes it pass. One task is one commit, with `Task: x.x` in the body.

## 1. Shared style

- [ ] **1.1 Style tests.** In `packages/shared`, add: the capital layer's `circle-radius` is 2 at zoom 3, 3 at zoom 6, 4 at zoom 9 and 5 at zoom 12 and above; the `countryBorder` colour of the day palette is `#6B7485` and of the night palette is `#9AA6BA`. Run them and show the failure.
- [ ] **1.2 Style.** In `map-style.ts`, add the step expression `['step', ['zoom'], 2, 6, 3, 9, 4, 12, 5]` to the capital layer. In `tokens/tokens.json`, set `map.countryBorder` to `#6B7485` (light) and `#9AA6BA` (dark). Run `pnpm codegen`. Make 1.1 pass.

## 2. Spike: the two unverified assumptions

- [x] **2.1 Globe formula test.** Verified in the source of maplibre-gl 6.16.0: the globe radius is `worldSize / (2π · cos(lat))`, so at the centre latitude 0 the diameter is `512 · 2^zoom / π`, as the formula assumes. At other centre latitudes the globe is larger, never smaller, so the width constraint holds. Checked in source, not in a browser.
- [!] **2.2 ng-native options test.** BLOCKED, owner to decide. In `@maplibre/maplibre-react-native` 11.5.1, `minZoom` and `maxBounds` are props of `Camera`, not of `MapView`. The mobile map is `maplibre-map` (MapView) and has no `Camera` in its template, so the options cannot be added to `mapViewProps` alone. Options: add a `Camera` child to the mobile map template, or leave the mobile limits out of this change.

- **Rollback:** the Mercator and globe limits (tasks 3 and 4) were applied and removed again. Applying `maplibre-gl` 6.16 limits in the web map view made the map crash: `Cannot read properties of null (reading '0')` in MapLibre (`setMaxBounds` in the globe, then `maxBounds` in the constructor). Tasks 3 and 4 are open again and must be redone with a test that runs the real map in a browser before they are checked.

## 3. Web: Mercator limits

- [ ] **3.1 Mercator tests.** In the web map view, add: in Mercator the map is created with `minZoom` 3 and `maxBounds` `[[-180, -60], [180, 85]]`; zooming out stops at zoom 3; panning south stops at latitude -60. Run them and show the failure.
- [ ] **3.2 Mercator limits.** In `map-view.ts`, set `minZoom` and `maxBounds` when the projection is Mercator. Make 3.1 pass.

## 4. Web: globe minimum zoom

- [ ] **4.1 Globe tests.** In the web map view, add: in globe with a 390 px container the minimum zoom is about 1.23; in a 1024 px container it is about 2.64; a resize updates it; switching back to Mercator restores `minZoom` 3 and the bounds; a container of 8 px or less gives a minimum of 0. Run them and show the failure.
- [ ] **4.2 Globe minimum zoom.** In `map-view.ts`, use a `ResizeObserver` on the map element to set `minZoom` to `log2((W − 8) · π / 512)` for the globe, clamped at 0. Make 4.1 pass.

## 5. Mobile

- [ ] **5.1 Mobile props tests.** In `apps/mobile/src/app/shared/map-view/map-view.props.test.ts`, add: the props contain `minZoom` 3 and the `maxBounds` of section 3. Run them and show the failure.
- [ ] **5.2 Mobile props.** In `map-view.props.ts`, add the two options with the names recorded in 2.2. Make 5.1 pass.

## 6. Borders in the map

- [ ] **6.1 Visual check tests.** The map style tests of section 1 already cover the colours. Add in the web map view a test that the map is built with the night palette border colour after the scheme changes. Run it and show the failure.
- [ ] **6.2 Check.** Make 6.1 pass with the existing wiring.

## 7. Full check

- [ ] **7.1 Full check.** Run `pnpm check` and `pnpm build:web` and paste the summary in the PR.
- [ ] **7.2 Screen check.** The owner checks the capitals, the Antarctic strip, the borders and the globe width in Chrome and on a phone, in light and dark mode. Done by the owner, with the steps in the PR.

## Translations to review (for the PR)

None. The change adds no user-facing text.
