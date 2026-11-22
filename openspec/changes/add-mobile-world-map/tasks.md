# Tasks: add-mobile-world-map

Each task starts with its failing test, which is run and shown failing before the code is written. Each task is one commit, with the task id in the body (`Task: 1.1`). For the refactor in task 2, the existing web tests are the safety net, and the parity test is run before and after the change.

## 1. Shared map style

- [x] **1.1 Test first.** `packages/shared/test/map-style.spec.ts`: `buildMapStyle(states, scheme, sources)` returns the layers `background`, `countries-fill`, `countries-border`, `countries-state-outline` and `capitals-point`, in that order. The fill uses `mapColors` for each state and `land` for the rest, in day and night. The sources are the ones passed as arguments. Run it and show it failing.
- [x] **1.2 Code.** `packages/shared/src/map/map-style.ts` with a plain return type. Export it from the shared index. Run the test and show it passing.

## 2. Web uses the shared style

- [x] **2.0 Single geo source.** Move `apps/web/public/geo/countries.geojson` and `capitals.geojson` to `packages/shared/geo/countries.json` and `capitals.json` with `git mv`. The web copies them to `public/geo/` with `apps/web/scripts/copy-geo.mjs`, run in `prestart`, `prebuild` and `prewatch`, because Angular `assets` cannot point outside the web workspace. `public/geo/` is git-ignored. Run `pnpm build:web` and show that `geo/countries.json` is in the output.
- [x] **2.1 Parity test first.** `apps/web/src/app/shared/map-view/map-view.style.spec.ts`: the style built by the web function, with its `/geo/` URLs, equals the style built by the shared function with the same URLs, for day and night and for an empty and a filled state set. Run it and show the result before the refactor (it passes, because the logic is the same).
- [x] **2.2 Code.** `apps/web/src/app/shared/map-view/map-view.style.ts` calls the shared function with the URLs. Run the parity test and the existing web map tests, and show them passing.

## 3. Dependency

- [x] **3.1 Install.** `pnpm add --filter @matchmap/mobile --save-exact @maplibre/maplibre-react-native@11.5.1` from the repo root. The version has no `^` or `~`. Check that the peers resolve: `react-native` 0.86.3, `react` 19.2.3, `expo` ~57.0.26. Commit `package.json` and `pnpm-lock.yaml`, and show the result of `pnpm check`.

## 4. Bundled geo data

- [x] **4.1 Test first.** `packages/shared/test/geo-data.spec.ts`: `packages/shared/geo/countries.json` and `capitals.json` exist, parse as GeoJSON, and every country feature has an `iso_a2` property. Run it and show it failing before task 2.0 moves the files.
- [x] **4.2 Code.** The files are the ones moved in task 2.0. The mobile map imports them from `packages/shared/geo/`. Run the test and show it passing.

## 5. Native view registration

- [x] **5.1 Test first.** `apps/mobile/src/app/shared/map-view/register-map-view.test.ts`: `registerMapView()` calls `registerViewName('maplibre-map', 'MLRNMapView')` from `@ng-native/fabric`, with the library mocked. Run it and show it failing.
- [x] **5.2 Code.** `apps/mobile/src/app/shared/map-view/register-map-view.ts`. `apps/mobile/src/main.ts` calls `registerMapView()` after `registerPlatformComponents(Platform.OS)`. Run the test and show it passing.

## 6. Phone map component

- [x] **6.1 Test first.** `apps/mobile/src/app/shared/map-view/map-view.test.ts`, with `@ng-native/testing` `render`: the `maplibre-map` element receives a `mapStyle` object equal to `buildMapStyle(states, 'day', { countries, capitals })`, with `dragPan`, `touchZoom` and `doubleTapZoom` on and `touchRotate` and `touchPitch` off. Run it and show it failing.
- [x] **6.2 Code.** `apps/mobile/src/app/shared/map-view/map-view.ts`, a presentational component with the `states` input and `:host { flex: 1 }`. Run the test and show it passing.
- [x] **6.3 Test first.** The same file: when `colorSchemeSource()` reports dark mode, the `mapStyle` uses the night palette. Run it and show it failing.
- [x] **6.4 Code.** Read the colour scheme from `colorSchemeSource()` in `@ng-native/device` and pass `day` or `night`. Run the test and show it passing.
- [x] **6.5 Wire the map.** The main screen of `mobile-main-layout` shows `<maplibre-map>` in its map area. Run `pnpm check` for `apps/mobile` and show the result.

## 7. Props and build checks on the emulator

- [x] **7.1 Props reach the native view.** Checked on the physical Android phone: the map draws with the style and the gesture props. Found on the emulator: the first run failed with `ReadableNativeMap cannot be cast to java.lang.String`, fixed by sending the style as JSON text. Start `pnpm mobile mock -l`, run the app on the Android emulator, and check that the map is drawn. If the props do not reach `MLRNMapView` without `declareNativeProps`, stop and report before changing the component.
- [x] **7.2 Build.** The native build for the emulator's ABI succeeds (`pnpm android`). Record the result. The `arm64-v8a` build for a physical phone is a known issue and is not part of this check.

## 8. Full check and parity

- [x] **8.1 Full check.** `pnpm check` for `packages/shared`, `apps/web` and `apps/mobile`. Paste the summary in the PR.
- [x] **8.2 Visual parity on the phone.** Checked on the physical phone by the owner: the map matches the web in day and in dark mode. The emulator `MPOS_PAX_77` (Android 11, x86) cannot draw MapLibre: `Mbgl-EGLConfigChooser` finds no EGL configuration, with GPU auto or software. The check moves to the physical phone. Compare the phone map with the web map in day and night: country borders, capital points, one country for each colour state, and the background. Record the result, with screenshots, in the PR.
- [x] **8.3 Gestures on the phone.** Checked by the owner: pan with one finger and pinch zoom work, and two-finger rotation does not rotate the map. One-finger pan and pinch zoom move and scale the map, with no rotation. Record the result in the PR.
- [x] **8.4 Manual check by the owner.** Done by the owner on the phone and in the browser. Compare the map on the physical phone and on the web in the browser. Done by the owner.
