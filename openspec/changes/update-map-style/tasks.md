# Tasks: update-map-style

Each task names its failing test first, then the code that makes it pass. One task is one commit, with `Task: x.x` in the body. Tasks marked done were committed before this list was rewritten; their commits are listed.

## 1. Shared style

- [x] **1.1 Style tests.** Done in `packages/shared/test/map-style.spec.ts`: capital radius steps, day border `#6B7485`, night border `#9AA6BA`.
- [x] **1.2 Style.** Done: capital step expression, token copies in `tokens/tokens.json`, `tokens.ts`, `tokens.css` and mobile `tokens.ts`. Commits `c28f8fa`, `852ef25`.

## 2. Spike: the two unverified assumptions

- [x] **2.1 Globe formula test.** Verified in the source of maplibre-gl 6.16.0: the globe radius is `worldSize / (2π · cos(lat))`, so at the centre latitude 0 the diameter is `512 · 2^zoom / π`. Checked in source, not in a browser.
- [!] **2.2 ng-native options test.** BLOCKED, owner to decide. In `@maplibre/maplibre-react-native` 11.5.1, `minZoom` and `maxBounds` are props of `Camera`, not of `MapView`. The mobile map has no `Camera` in its template. Options: add a `Camera` child to the mobile map template, or leave the mobile limits out of this change.
- **Rollback record:** the earlier `maxBounds` approach crashed MapLibre (`Cannot read properties of null (reading '0')`) and was reverted in `6b3f40d`. The approach now in use is described in section 3.

## 3. Web: Mercator view

- [x] **3.1 Start view and limits.** Centre `[0, 42]`, `minZoom` -2, `zoom` -2 and `renderWorldCopies` false, with tests in `map-view.center.spec.ts` and `map-view.bounds.spec.ts`. Commits `88bce31`, `651c317`, `6ab49cb`, `a17654f`, `67ee022`, `729d04f`, `54c771e`.
- [x] **3.2 Antarctica in the style.** Mercator-only filter `iso_a2 != AQ` in the shared style, with parity tests in `map-view.style.spec.ts`. Commit `852ef25`.
- [x] **3.3 Pan limit at -60.** After a `moveend`, the map eases north when the visible bottom is south of -60, ignoring the `moveend` of its own animation and resetting on a user gesture. Tests in `map-view.bounds.spec.ts`. Commit `fdde8ae`.

## 4. Web: globe minimum zoom

- [x] **4.1 Globe tests.** In `map-view.globe-zoom.spec.ts`. Shown failing before the change. In `map-view.bounds.spec.ts` or a new spec: in globe with a 390 px container the minimum zoom is about 1.23; in a 1024 px container it is about 2.64; a resize updates it; a container of 8 px or less gives a minimum of 0. Run them and show the failure.
- [x] **4.2 Globe minimum zoom.** Done in `map-view.ts` (`applyMinZoom`, a `ResizeObserver`, also reapplied on projection change). Browser check still open, see 8.2. In `map-view.ts`, use a `ResizeObserver` on the map element to set `minZoom` to `log2((W − 8) · π / 512)` for the globe, clamped at 0. Make 4.1 pass. Then check in a browser that the globe does not get smaller than the container.

## 5. Web: laptop view toggle

- [x] **5.1 Toggle visibility test.** In `main-layout.spec.ts`, the stylesheet does not hide `app-map-bottom-controls` at the desktop breakpoint. Shown failing before the change. Commit `9f9f086`.
- Follow-up (owner request, same change): the toggle moves into `.map-area` in `main-layout.ts`, with `bottom: calc(16px + env(safe-area-inset-bottom))`, so it sits inside the map on laptop and at the same place on phones. This changes the focus order: the toggle comes after the map and before the stats panel. The focus-order and placement specs in `main-layout.spec.ts` are updated.
- [x] **5.2 Show the toggle.** In `main-layout.css`, the `display: none` rule now lists only `app-map-top-controls`. The base position rule stays, so the toggle sits where it sits on phones. Commit `9f9f086`.

## 6. Mobile

- [ ] **6.1 Mobile props tests.** In `apps/mobile/src/app/shared/map-view/map-view.props.test.ts`, add: the props contain `minZoom` -2 and the Antarctica limit. Run them and show the failure. Blocked until 2.2 is decided.
- [ ] **6.2 Mobile props.** In `map-view.props.ts`, add the options with the names recorded in 2.2. Make 6.1 pass. Blocked until 2.2 is decided.

## 7. Borders in the map

- [x] **7.1 Border tests and wiring.** The colours are covered by section 1 tests and the map uses the night palette after the scheme changes.

## 8. Full check

- [x] **8.1 Full check.** `pnpm check` passes: shared 229/229, mobile 198/198, web 399/399. The timing failures came from shared mocks between spec files; the web unit tests now run with `isolate: true` in `angular.json`. `pnpm build:web` not yet run.
- [ ] **8.2 Screen check.** The owner checks the capitals, the Antarctic strip, the borders, the laptop toggle and the globe width in Chrome and on a phone, in light and dark mode. Done by the owner, with the steps in the PR.

## Translations to review (for the PR)

None. The change adds no user-facing text; the toggle uses its existing i18n key.
