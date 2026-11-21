# Design: add-world-map-view

## Context

The web app needs a world map that fills the main page, with country borders, a capital point per country, and a colour per country. `CLAUDE.md` §3 puts the stack on MapLibre GL JS, and `docs/design.md` §2.2 defines the map colours. The app has no tile server and no map code yet.

## Decisions

### Dependency

- `maplibre-gl` pinned to exactly `6.16.0`, in `apps/web/package.json`, with no `^` or `~`. It is the newest version published at least two weeks before the proposal date (2026-11-15): `6.16.0` on 2026-10-25. `6.18.0` (2026-11-11) is too recent and is not used.

### Component

- `apps/web/src/app/shared/map-view/map-view.ts`: a standalone presentational component, `ChangeDetectionStrategy.OnPush`, with no store and no API. Its input is `states`, a record from ISO country code (`iso_a2`) to a key of `mapColors.light` (`visited`, `lived` or `wantToGo`).
- The host element is `display: block; width: 100%; height: 100%`. The map container fills the host.
- `MainLayout` (`apps/web/src/app/shared/main-layout/main-layout.ts`) renders `<app-map-view>` as its only content. Its `.main-layout` section takes `height: 100dvh`, so the map fills the viewport.

### Style, built by a pure function

- `buildMapStyle(states, scheme)` in `map-view.style.ts` returns the MapLibre style object. It is a pure function, so it can be tested without WebGL.
- Sources: two GeoJSON sources, `countries` and `capitals`, both loaded from `public/geo/`. No raster or vector tile source, so the map makes no tile request.
- Layers, in order:
  1. `background`: `background-color` = `mapColors[scheme].ocean`.
  2. `countries-fill`: fill with a data-driven `match` on `iso_a2`. Coloured countries take their state colour from `mapColors[scheme]`. Every other country takes `mapColors[scheme].land`, the default defined in `docs/design.md` §2.2. No state colour is `map.land`.
  3. `countries-border`: the lines between countries, `mapColors[scheme].countryBorder`, 0.5 px.
  4. `countries-state-outline`: a 1.5 px outline in the `text` colour for the coloured countries only. It is the visible cue that does not depend on colour (`docs/design.md` §2.2).
  5. `capitals-point`: a circle layer, one point per capital, `text` colour.
- No `glyphs` and no label layer. The map shows no text, so it requests no fonts.

### Scheme

- The style is built with the scheme in use. The component reads `matchMedia('(prefers-color-scheme: dark)')` and rebuilds the style when it changes. **Assumption:** the web app follows the system scheme, as its tokens do in `tokens.css`. If the app gets a manual theme later, this reads from it instead.

### Data

- Natural Earth 1:50m `admin_0_countries` (public domain), converted to GeoJSON with the `iso_a2` property, and simplified for size before it is added to `apps/web/public/geo/countries.geojson`.
- Natural Earth 1:50m `populated_places`, filtered to `FEATURECLASS = "Admin-0 capital"`, as `apps/web/public/geo/capitals.geojson`.
- The sizes are measured after the conversion and written in `tasks.md`. If the total exceeds the performance budget of `CLAUDE.md` §9, the change records the budget and its justification here before it goes in.

### Accessibility

- The map has `role="img"` and an `aria-label` from the i18n catalogue. It has no keyboard interaction in this change, so no focus is needed.

## Tests (TDD, written first)

- `map-view.style.spec.ts`:
  - the background uses `mapColors` `ocean` for day and night;
  - the fill expression gives each state its `mapColors` colour, and every other country the `land` colour;
  - the outline layer exists and covers only the coloured countries;
  - the style has no raster or vector source and no `glyphs`.
- `map-view.spec.ts`: `maplibre-gl` is mocked. The component creates the map once, passes the built style, and rebuilds the style when the scheme changes.
- `main-layout.spec.ts`: the layout renders `app-map-view` as its only content.
- Dependency test: `package.json` pins `maplibre-gl` to `6.16.0` with no range operator.

## Risks

- **Size:** the GeoJSON may be large for a mobile connection. Measured before implementation, as above.
- **Scheme:** the system-scheme assumption above. Confirmed in the visual check.
- **WebGL in tests:** jsdom has no WebGL, so the map itself is mocked in unit tests. The rendering is checked by hand in the visual check (task "visual check").

## Open questions

None.
