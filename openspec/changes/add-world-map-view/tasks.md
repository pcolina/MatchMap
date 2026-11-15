# Tasks: add-world-map-view

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body.

No API call changes, so no contract check is needed.

## 1. Dependency and data

- [x] **1.1 Pinned dependency.** Test first: a spec reads `apps/web/package.json` and fails because `maplibre-gl` is not listed. It checks that `maplibre-gl` is `6.16.0`, with no `^` or `~`. Code: add it with `pnpm --filter @matchmap/web add -E maplibre-gl@6.16.0`.
- [x] **1.2 Countries data.** Test first: a spec checks that `apps/web/public/geo/countries.geojson` exists, is a FeatureCollection of polygons, and every feature has an `iso_a2` string. Code: convert the Natural Earth 1:50m `admin_0_countries` file, keep `iso_a2`, and simplify it.
- [x] **1.3 Capitals data.** Test first: a spec checks that `apps/web/public/geo/capitals.geojson` exists, every feature is a point, and every feature has `iso_a2` and `name`. Code: filter the Natural Earth 1:50m `populated_places` file to `FEATURECLASS = "Admin-0 capital"`.
- [x] **1.4 Measured sizes.** Measure both files after conversion and write the sizes in this file under "Measured sizes". If the total exceeds the budget in `CLAUDE.md` §9, the justification goes in `design.md` before the change continues. No test; recorded in the PR.

## 2. Style (`apps/web`)

- [x] **2.1 Ocean and land background.** Test first: `map-view.style.spec.ts` checks that `buildMapStyle(states, 'day')` uses the `ocean` colour as background, and that `'night'` uses the night value (scenarios "Background colours" and "Night colours"). Code: `shared/map-view/map-view.style.ts`.
- [x] **2.2 Default and state colours.** Test first: the fill expression gives each state its `mapColors` colour, and every other country the `land` colour (scenarios "Country with a colour state" and "Country without a colour state"). Code: the `match` expression in `buildMapStyle`.
- [ ] **2.3 State outline.** Test first: the outline layer exists, covers only the coloured countries, and is 1.5 px in the `text` colour (scenario "Colour is not the only cue"). Code: the `countries-state-outline` layer.
- [ ] **2.4 Capitals and no tiles.** Test first: the style has a `capitals-point` circle layer, no raster or vector source, and no `glyphs` (scenarios "Map needs no network service" and "Capital points are shown"). Code: the capitals source and layer, with the countries and capitals as GeoJSON sources only.

## 3. Component and page (`apps/web`)

- [ ] **3.1 Map component.** Test first: `map-view.spec.ts` mocks `maplibre-gl`, and checks that the component creates the map once with the built style, and rebuilds the style when the scheme changes (scenario "World map is shown"). Code: `shared/map-view/map-view.ts`, OnPush, input `states`.
- [ ] **3.2 Full page.** Test first: the host has `height: 100%` and the map container fills it (scenario "Map fills the page"). Code: `map-view.css`, and `.main-layout` with `height: 100dvh` in `main-layout.ts`.
- [ ] **3.3 Main layout.** Test first: `main-layout.spec.ts` checks that `app-map-view` is the only child content of the layout. Code: `shared/main-layout/main-layout.ts`.
- [ ] **3.4 Accessible name.** Test first: the map has `role="img"` and an `aria-label` from the catalogue key `map.world.label`. Code: the template, and the key in both catalogues (see 3.5).
- [ ] **3.5 Translations.** Add `map.world.label` to `packages/shared/i18n/en.json` ("World map") and `es.json` ("Mapa del mundo"). The PR lists both under "Translations to review".

## 4. Checks and review

- [ ] **4.1 Full check.** Run `pnpm test` in `apps/web`, and the web `ngc -p tsconfig.app.json --noEmit` check. Paste the summary in the PR.
- [ ] **4.2 Visual check.** In Chrome or Edge at phone width and at laptop width: the map fills the page, the borders and capital points show, a coloured country has its outline, and the background follows the system scheme. Done by the user, recorded in the PR.

## Measured sizes

- `apps/web/public/geo/countries.geojson`: 1,869,164 bytes raw, 679,933 bytes gzipped, 239 features.
- `apps/web/public/geo/capitals.geojson`: 25,104 bytes raw, 4,266 bytes gzipped, 200 features.
- Total: 1,894,268 bytes raw, 684,199 bytes gzipped. The Angular `initial` budget (500 kB warning, 1 MB error in `angular.json`) covers the JavaScript bundle, not `public/` files, so it does not apply to these files. No other asset budget is defined in the repo.

## Decisions taken for tasks 1.2 and 1.3

- `iso_a2` takes the value of Natural Earth `ISO_A2_EH`. Taiwan is `TW`, France `FR`, Norway `NO`, Kosovo `XK`.
- Features without a two-letter ISO code are dropped: Somaliland, N. Cyprus and Siachen (countries), and Hargeisa (capital). This removes 3 of 242 countries and 2 of 202 capitals.
- `Indian Ocean Ter.` and `Ashmore and Cartier Is.` keep `AU`, their `ISO_A2_EH` value.
- The capital filter field is `FEATURECLA` (Natural Earth's name), not `FEATURECLASS`.
- Coordinates are rounded to 4 decimals, and countries keep only `iso_a2`, capitals only `iso_a2` and `name`.
- Task 1.3 order: the data was generated before its spec was written, so the spec passed on its first run. It is not a red-first cycle.

