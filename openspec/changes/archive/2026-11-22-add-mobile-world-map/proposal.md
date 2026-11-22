# Proposal: add-mobile-world-map

## Why

The mobile main screen has an empty map area (`mobile-main-layout`: "the map is added in a later change"). The web app already shows the world map (`world-map`). `CLAUDE.md` §1 says the app on phone-sized screens and the web app share one design and one behaviour, so the same map must appear on the phone.

## What Changes

- The world map of `world-map` is also shown on phone-sized screens of the mobile app. It fills the map area of `mobile-main-layout`, with the same country borders, capital points, colour states and background tokens as the web.
- The map is a MapLibre native view, `@maplibre/maplibre-react-native` `11.5.1`, the version named in `apps/mobile/AGENTS.md`. It is a **new dependency** of `apps/mobile`, so it is listed here and needs approval.
- The Natural Earth 1:50m countries and populated places datasets are bundled in the mobile app, as the web app bundles them.
- The map uses the `map` and `mapColors` tokens from `tokens/tokens.json`. No colour, size or spacing is written in the code.
- The map has no store and no API call, as in the web spec.

Compatibility checked for `11.5.1`: its peers are `react-native >=0.80.0`, `react >=19.1.0` and `expo >=54.0.0`. The project has `react-native` `0.86.3`, `react` `19.2.3` and `expo` `~57.0.26`. The release was published on 2026-10-29, more than two weeks before this proposal.

## Capabilities

- **Modified:** `world-map`. Its requirements now apply to the mobile app on phone-sized screens too. The web behaviour does not change.
- **Depends on:** `world-map` (main spec), `mobile-main-layout` (main spec, map area).

## Out of scope

- The tablet layout. The tablet follows the phone spec (`CLAUDE.md` §6), so no separate spec is written here.
- Data on the map from the API. The map still shows no data, as in `world-map`.
- Verification on iOS. There is no iOS simulator on Windows (`CLAUDE.md` §4). The check is on Android.
- Any change to the web map or to `maplibre-gl`.

## Decisions

- Pan and zoom with the finger are allowed on the mobile map. The web spec defines no gestures, so the gesture behaviour is specified in this change for the phone only.
- The dependency `@maplibre/maplibre-react-native` `11.5.1` is approved for `apps/mobile`. It needs a development build, because Expo Go does not include native modules (`README.md`).

## Depends on

- `world-map` (main spec), `mobile-main-layout` (main spec).
- `add-mock-auto-login` is archived (archive PR #38, merged together with implementation PR #37). Only one change is open at a time.
