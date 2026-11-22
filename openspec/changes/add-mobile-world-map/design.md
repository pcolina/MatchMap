# Design: add-mobile-world-map

## Contract baseline

This change calls no API operation and adds no endpoint. The contract baseline in `matchmap-api` is `ca97e41`, and it is not affected.

## Goal

The phone map behaves as the web map: the same country borders, the same capital points, the same colour states, the same background, in day and night. The phone map adds pan and zoom with touch.

## What checks were made

- **Web map.** `apps/web/src/app/shared/map-view/map-view.style.ts` builds the style with a pure function, `buildMapStyle(states, scheme)`. It has five layers: `background`, `countries-fill` (data-driven by `iso_a2`), `countries-border`, `countries-state-outline` and `capitals-point`. Colours come from `mapColors` in `tokens/tokens.json`. The GeoJSON sources are URLs under `/geo/`.
- **Data.** `apps/web/public/geo/countries.geojson` (1,869,164 bytes) and `capitals.geojson` (25,104 bytes) are the Natural Earth data. The mobile app has no copy yet.
- **Tokens.** `apps/mobile/src/app/core/theme/tokens.ts` already exports `mapColors`, with the same values as the web.
- **Native component.** The package `@maplibre/maplibre-react-native` 11.5.1 (downloaded to a scratch folder, not into the repo) registers the native map view as `MLRNMapView` (`src/components/map/MapViewNativeComponent.ts`). The component `Map` accepts `mapStyle` as a URL or as a style object, which it sends as JSON (`src/components/map/Map.tsx`). A `GeoJSONSource` accepts its `data` as a GeoJSON object, which it sends as JSON, so no network request is needed.
- **ng-native.** `registerViewName(elementName, nativeName)` from `@ng-native/fabric` maps a lowercase element to a Fabric native component. `@ng-native/components` uses it for `gradient-text` → `RNCMaskedView` (`node_modules/@ng-native/components/dist/gradient-text.js`). `colorSchemeSource()` from `@ng-native/device` is the source of the colour scheme.
- **Documentation.** The ng-native documentation page was read in part only. The sections on third-party views and on known limitations were not read. The rules below that depend on them are marked as checks in the tasks.

## Decisions

### 1. One style function for web and phone

The style builder becomes a pure function in `packages/shared`, used by both apps. Then the borders, capitals, colours and background cannot drift apart. The function receives the data sources as arguments, so the web passes its URLs and the phone passes its GeoJSON objects.

- The web changes only in its import and in the source arguments. Its rendered style must stay the same. A test in `packages/shared` compares the layers and the colours with the current web values.
- `packages/shared` does not import `maplibre-gl` or `@maplibre/maplibre-react-native`. The return type is a plain object type defined in the shared module.

### 2. Native view registration

`main.ts` calls `registerViewName('maplibre-map', 'MLRNMapView')` once, next to `registerPlatformComponents(Platform.OS)`, before `mount`. The element is used only in the mobile map component.

### 3. Map component on the phone

`apps/mobile/src/app/shared/map-view/map-view.ts` is a presentational component with no store and no API call, as the spec requires. It has the same input as the web map, `states`, and it builds the style with the shared function.

- Gestures: `dragPan` on, `touchZoom` on, `doubleTapZoom` on. `touchRotate` and `touchPitch` off, because the spec asks for pan and zoom only. The web map keeps MapLibre's default rotation, so this is one difference from the web, and it is flagged for the owner.
- Attribution and logo: the MapLibre defaults, as on the web.
- Size: `:host { flex: 1 }`, so the map fills the map area of `mobile-main-layout`.

### 4. Colour scheme

The map reads `colorSchemeSource()` from `@ng-native/device` and uses `day` or `night`. The palette values come from `mapColors`, as on the web.

### 5. Data bundled in the app

`apps/mobile/src/assets/geo/countries.geojson` and `capitals.geojson` are copies of the web files. They are imported with Metro and passed as objects, so no request is made.

- The bundle grows by about 1.9 MB. This is flagged for the owner, and the performance budget check of `CLAUDE.md` §9 applies to it.
- The web keeps its own copies under `apps/web/public/geo/`. The two copies are identical; a later change may share them.

### 6. Dependency

`@maplibre/maplibre-react-native` `11.5.1` is added to `apps/mobile` with an exact version (no `^`), as `apps/mobile/AGENTS.md` requires. Its peers are `react-native >=0.80.0`, `react >=19.1.0` and `expo >=54.0.0`, and the project has `0.86.3`, `19.2.3` and `~57.0.26`.

## Risks and checks before the code is final

1. **Props on the native view.** The native component is generated from codegen types. It is not yet confirmed that ng-native passes `mapStyle`, `dragPan` and the other props from the Angular template to `MLRNMapView` without `declareNativeProps`. The first mobile test task checks this on the emulator.
2. **Native build.** The MapLibre native code must build for the emulator's ABI (x86_64) and for a physical phone (`arm64-v8a`). The earlier build failure for `arm64-v8a` (Gradle with JDK 25) is not solved yet. It is a known issue of the project.
3. **Development build only.** The map needs a development build, not Expo Go (`README.md`).
4. **Verification.** Node tests cannot render the native map. The visual parity check (borders, capitals, colours in day and night) is done on the emulator and recorded in the PR.

## Tests (TDD)

- `packages/shared`: `buildMapStyle` returns the five layers in the same order, the same colours for every state and scheme, and the data sources given as arguments.
- Web: the style of the web map is unchanged after the move (the existing map view tests keep passing).
- Mobile: the map component passes the style object and the gesture props; the colour scheme chooses the night palette when the device is in dark mode.
- Manual, on the emulator: day and night, the borders, the capitals, one country with each colour state, pan and pinch.

## Performance

The mobile bundle grows by about 1.9 MB (see decision 5). No other budget is affected.
