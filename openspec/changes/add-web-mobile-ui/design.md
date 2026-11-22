# Design: add-web-mobile-ui

## Contract baseline

No API operation is called and no endpoint is added. The contract baseline in `matchmap-api` is `ca97e41`, unchanged.

## Scope

Web only, phone-sized viewports (600 px and less). Presentational controls: inputs only, no outputs, no store, no API. The controls are painted and laid out; their actions come in later changes.

## What checks were made

- `apps/web/src/app/shared/main-layout/main-layout.ts`: the page is a column with the header (hidden on phones), `app-map-view` (flex 1), `app-stats-resume` (250 px) and the footer (hidden on phones). The map area is the space above the stats panel.
- `apps/web/src/app/shared/map-view/map-view.ts`: creates `new MapLibreMap({ container, style })`, so MapLibre adds its default attribution control, with the MapLibre credit.
- Icons: `@ng-icons/tabler-icons` is in use (`NgIcon`), so the icons come from the same set.
- Tokens: `--mm-color-*` variables are in `apps/web/src/styles.css`.
- Accessibility: `axe-core` 4.14.0 is a dependency of the web app.
- `docs/design.md` 7.7 (tab bar), 7.9 (skeleton) and 4 (44 px touch target) apply.

## Decisions

### 1. Focus order follows the DOM

Keyboard focus follows the DOM order, not the screen position. The required order is: top-left column, top-right avatar, map, stats panel, bottom-right row. So the controls are in two components:

- `MapTopControls` is rendered before `app-map-view` in the map area. It holds the top-left column and the top-right avatar.
- `MapBottomControls` is rendered after `app-stats-resume`. It holds the attribution info control and the view toggle.

### 2. Overlay positioning

`main-layout` stays a column. `.map-area` wraps `app-map-view`, with `position: relative` and `flex: 1`:

- the top controls are absolutely positioned inside `.map-area`: `top: calc(16px + env(safe-area-inset-top))`, `left: 16px`, `right: 16px`.
- the bottom row is absolutely positioned against the section (`position: relative`), above the stats panel: `bottom: calc(var(--stats-height) + 16px)`, `right: 16px`.
- `--stats-height: 250px` is defined once in `main-layout.css`. The stats panel uses it for its height, and the bottom row uses it for its offset.

Reason: the bottom row must come after `app-stats-resume` in the DOM, so that keyboard focus follows the order of the spec (decision 1). It cannot be inside `.map-area`, which comes before the panel. The visual result is the same as placing it over the map area.

### 3. Icons and states

- Add place: `tablerPlus`.
- Friends: `tablerUsers`.
- Account: `tablerUser` inside a circle. When `avatarLoading` is true, the circle is a grey skeleton with no pulse under reduced motion (`docs/design.md` 7.9).
- Attribution: `tablerInfoCircle`.
- View toggle: the icon shows the view the button leads to. `tablerMap` (flat map) when `globeActive` is true, `tablerSphere` (ball with a horizon line) otherwise. The shape changes, so the state is not only colour (spec requirement).

### 4. Accessibility

- Each icon-only control is a native `<button>` with `aria-label` from an i18n key.
- Touch target: the button is 44 × 44 px; the icon is 24 px.
- Surface: each control has the `--mm-color-surface` background with a border, so the icon contrast over the map stays above 4.5:1. In day mode it also has the `elevation.card` shadow (`--mm-elevation-card`), so it stands out from the land colour; in night mode the token is `none` and the border gives the separation. The contrast is checked with `axe-core` on the page.
- The view toggle sets `aria-pressed` from `globeActive`.

### 5. Attribution and the MapLibre logo

In `map-view.ts`, the MapLibre constructor receives `attributionControl: false`. This removes the MapLibre logo and its credit from the map. The ⓘ button has no action in this change. Its modal comes with the avatar change, as agreed.

Consequence: until that change, the attribution credit is not visible on the web map. This is accepted for this step and flagged in the PR.

### 6. Parity with the phone

The phone app still shows the MapLibre attribution and logo, because its native view uses its defaults. This change is web only, so the two maps differ in the logo until a later change aligns them. Flagged in the PR.

### 7. i18n keys

Keys in `packages/shared/i18n/en.json` and `es.json`, under `map.controls`:

| Key | en | es |
|---|---|---|
| `map.controls.addPlace` | Add place | Añadir lugar |
| `map.controls.friends` | Friends | Amigos |
| `map.controls.account` | Account | Cuenta |
| `map.controls.attribution` | Map attribution | Atribución del mapa |
| `map.controls.globe` | Globe view | Vista globo |
| `map.controls.mercator` | Mercator view | Vista Mercator |

The `es` text is AI-generated and goes under «Translations to review» in the PR.

## Files

- `apps/web/src/app/shared/map-controls/map-top-controls.ts` (+ `.css`, `.spec.ts`)
- `apps/web/src/app/shared/map-controls/map-bottom-controls.ts` (+ `.css`, `.spec.ts`)
- `apps/web/src/app/shared/main-layout/main-layout.ts` and `.css`
- `apps/web/src/app/shared/map-view/map-view.ts` (`attributionControl: false`)
- `packages/shared/i18n/en.json`, `es.json`

## Tests (TDD)

- `MapTopControls`: the add-place button is above the friends button; both have accessible names; the avatar is the only control at the top right; the avatar shows the skeleton when `avatarLoading` is true.
- `MapBottomControls`: the attribution control is before the toggle; the toggle has `aria-pressed` matching `globeActive`; the icon changes with `globeActive`.
- `MainLayout`: the DOM order is top controls, map, stats panel, bottom controls (focus order).
- `MapView`: the MapLibre constructor receives `attributionControl: false`.
- Automated accessibility: `axe-core` on the phone main screen reports no violations.
- Manual, on the phone browser: the layout at 320 px, 360 px and 600 px, in light and dark mode.

## Risks

- Touch targets over a map can overlap map gestures. The controls are on the overlay, so gestures on the map outside them still work.
- The phone's bottom safe area is used for the bottom controls.

## Performance

The initial bundle warning of `apps/web/angular.json` is raised from 500 kB to 800 kB. The error limit stays at 1 MB.

Justification: the initial bundle includes the map, which loads MapLibre at start-up. Measured on `main` before this change the initial bundle is 557.58 kB, and with this change it is 558.18 kB. This change adds about 0.6 kB. The map was already above 500 kB, so the warning fired before these controls.

