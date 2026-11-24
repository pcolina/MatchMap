# Proposal: add-globe-toggle

## Why

The bottom-right view toggle on the phone web layout is rendered (`MapBottomControls`, `web-mobile-layout`) and shows the right icon and `aria-pressed`, but it has no click handler and the map always uses the Mercator projection (`world-map`). The toggle must switch the map between the globe and the flat view.

## What Changes

- Pressing the toggle switches the world map between the globe projection and the Mercator projection, and the toggle state (`aria-pressed`, icon, accessible name) follows the map.
- The app opens in the Mercator view, as today.
- The chosen view is saved on this device and survives a reload, the same way the day or night choice is saved (`web-theme-mode`). Nothing is sent to the API.
- The toggle and the globe behaviour apply to the phone layout of the web app only. The mobile app is out of this change (see Out of scope).

## Capabilities

- **Modified:** `world-map`. Its requirement "Mercator projection" becomes: the map shows either the Mercator or the globe projection, with the same borders and the same country states in both.
- **Modified:** `web-mobile-layout`. The requirement "Bottom-right view toggle" gets its behaviour: it switches the projection.

## Out of scope

- The mobile app: the globe projection and the view toggle there. The globe in `@maplibre/maplibre-react-native` 11.5.1 is not confirmed, so mobile goes to its own change, opened after this one is archived.
- Tablet and laptop layouts (each needs its own change).
- Any change to the country states, pins, colours or the map data.
- Rotation, zoom limits or other globe controls beyond the projection switch.

## Depends on

- `world-map` (`openspec/specs/world-map`).
- `web-mobile-layout` (`openspec/specs/web-mobile-layout`).
- `web-theme-mode` (`openspec/specs/web-theme-mode`), only if the choice is saved on the device.

## Decisions

- None yet. Waiting for the clarifications above.
