# Proposal: add-world-map-view

## Why

The web app needs a world map: the first step toward the personal map that `CLAUDE.md` §1 describes (countries pinned as `VISITED`, `WANT_TO_GO` and `LIVED`). This change adds the map itself, with country borders, a capital point for each country, and the ability to colour each country. Nothing is persisted yet.

## What Changes

- **New component `MapView`** in `apps/web/src/app/shared/map-view/`. It is presentational: it receives its data through inputs and has no store and no Apollo, as `CLAUDE.md` §3 requires for `shared/`.
- **Projection:** Mercator, the MapLibre GL JS default for a world view.
- **Borders:** country outlines from the Natural Earth 1:50m countries dataset, bundled with the web app. Each country is identified by its `iso_a2` code.
- **Capitals:** one point per country, from the Natural Earth populated places dataset, filtered to capitals.
- **Colour per country:** an input maps a country code to a colour state. The map colours the country with a data-driven fill by `iso_a2`. The colours come from the existing map tokens (`mapColors`), not from hard-coded values.
- **Colour states are not only colour:** each coloured country also has a visible outline, as `docs/design.md` §2.2 requires.
- **Background:** the ocean and land colours from `mapColors`. No external tile server is used, so the map needs no network service.
- **Dependency:** `maplibre-gl`, pinned to an exact version at least two weeks old, added to `apps/web/package.json`.

## Capabilities

### New Capabilities

- `world-map`: the web map component with country borders, capital points and per-country colour.

### Modified Capabilities

None.

## Impact

- **Code:** `apps/web/src/app/shared/map-view/` (new), `apps/web/package.json` (new dependency), the map data under `apps/web/public/geo/` (new).
- **Data:** two Natural Earth files, public domain. Their size is measured before implementation and checked against the performance budget in `CLAUDE.md` §9.
- **APIs:** none.
- **Mobile:** not changed. The mobile map needs a development build and is a separate change.

## Out of scope

- The mobile app.
- Saving a colour per user, and any backend change. The colour input is supplied by the page.
- Tapping a country or a capital, and any interaction with the map.
- Pins, the friends map and the comparison views.
- Map tiles and any external map service.

## Depends on

- Spec `client-sign-in` is not affected.
- `docs/design.md` §2.2 (map colours and extra cues).

## Open questions

None.
