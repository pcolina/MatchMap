# Design: add-globe-toggle

Web only, phone-sized layout. The mobile app is out of this change (see `proposal.md`).

## Decisions

### 1. The projection is part of the map style

`buildMapStyle` (`apps/web/src/app/shared/map-view/map-view.style.ts`) gets a third argument, the projection (`'mercator' | 'globe'`), and adds the style's top-level `projection` (`{ type: 'globe' }`) only for the globe. Mercator is MapLibre's default and keeps the shared style unchanged. The existing effect in `MapView` already calls `setStyle` when its inputs change, so a projection change is applied by the same path as a theme change.

- Why: the style is the single source of truth. A projection set with `map.setProjection()` outside the style can be lost on the next `setStyle` (theme change), and this design avoids that second path.
- Trade-off: each switch reloads the style, so the GeoJSON sources are parsed again. The 1:50m dataset is bundled, so the cost is one reload per press. The camera (centre and zoom) is kept by `setStyle`, which meets the "does not change the zoom" requirement. The check is a browser test, see tasks.
- The attribution and the logo stay off (`attributionControl: false`, unchanged).

### 2. A small store holds the choice

A new `MapProjectionStore` (`apps/web/src/app/core/map-projection/map-projection.store.ts`, root-provided SignalStore), modelled on `ThemeStore`:

- State: `projection: 'mercator' | 'globe'`, default `mercator`.
- Computed: `globe` (boolean, for the toggle).
- Method: `toggle()` switches, writes the choice and patches state.
- Storage: key `matchmap.mapProjection` in `localStorage`, read and written inside `try/catch`. When storage fails, the choice works for the session and the app opens in Mercator. An unknown stored value reads as `mercator`.
- No API call (spec requirement).

Why a store and not an input from the page: the choice must survive a reload and be known by `MainLayout` and by `MapView`. CLAUDE.md §3 puts state in a SignalStore.

### 3. Wiring

- `MapBottomControls` keeps its `globeActive` input and its markup. It is presentational and adds no store.
- `MainLayout` binds `[globeActive]="projection.globe()"` and `(pressed)="projection.toggle()"` on `app-map-bottom-controls`. `MapBottomControls` gets one output `pressed` emitted from the button's click.
- `MapView` gets a new input `projection` (default `'mercator'`). `MainLayout` passes `[projection]="projection.projection()"` to `app-map-view`.

### 4. Accessibility

- The button keeps `aria-pressed` and its accessible name from `map.controls.globe` and `map.controls.mercator` (keys already exist in `en.json` and `es.json`). No new strings, so no i18n change.
- The icon change (`globeWorld` / `tablerMap`) stays the non-colour cue.

### 5. Performance budget

No budget changes. The switch reloads a bundled style, which is not a budgeted path. If the browser check shows a visible pause, the design is reviewed before any budget change.

## Files

- `apps/web/src/app/shared/map-view/map-view.style.ts`: `projection` argument and top-level field.
- `apps/web/src/app/shared/map-view/map-view.ts`: `projection` input, passed to the style builder and to the effect.
- `apps/web/src/app/core/map-projection/map-projection.store.ts` (new).
- `apps/web/src/app/shared/map-controls/map-bottom-controls.ts`: `pressed` output.
- `apps/web/src/app/shared/main-layout/main-layout.ts`: binds the store to the two components.

No change to `packages/shared`, `contracts/`, the API, `tokens/` or the i18n catalogues.

## Test plan (TDD, mapped in tasks.md)

- `map-view.style.spec.ts`: `buildMapStyle(..., 'globe')` has `projection.type === 'globe'`; `'mercator'` has `'mercator'`.
- `map-projection.store.spec.ts`: defaults to mercator; `toggle()` persists and reads back; storage that throws leaves the session working and opens in mercator; an unknown value reads as mercator.
- `map-bottom-controls.spec.ts`: the button emits `pressed` on click; `aria-pressed` follows `globeActive`.
- `main-layout.spec.ts`: pressing the toggle switches the projection in the store and the map input.
- `map-view.spec.ts`: a change of the `projection` input sets the style with the new projection and keeps the states.
- Browser check: switch both ways at 320, 360 and 600 px, the zoom is unchanged after a switch, the colours and outlines match in both projections (`world-map` scenarios).

## Open risks

- `setStyle` on each switch may flash the map. Measured in the browser check; if it is visible, the fallback is `map.setProjection()` in a separate effect, re-applied on `style.load`. That is a design change and is not taken without approval.
