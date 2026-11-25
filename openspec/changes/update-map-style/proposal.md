# Proposal: update-map-style

## Why

The world map is the main screen of the app. Its styling is defined in the shared map style (`packages/shared/src/map/map-style.ts`) and in the map view component. Four things are hard to read or get in the way today: the capital points are too large when the map is zoomed out, the Antarctic strip shows at the bottom, the white country borders almost disappear on the light land colour, and they are hard to see in dark mode too. On laptop the globe/Mercator toggle is hidden, so the user cannot switch projection there.

## What Changes

- **Minimum zoom, Mercator.** The Mercator map cannot be zoomed out below zoom -2, the lowest zoom MapLibre allows. It starts at that zoom, centred on latitude 42, so the map shows as much of the world as possible.
- **World shown once.** The Mercator map does not repeat the world horizontally.
- **Minimum zoom, globe.** The globe cannot be zoomed out further than the zoom at which it fills the smaller of the width and height of its container with a 4 px gap on each side. The minimum is log2((S − 8) · π / 512), where S is the smaller of the container width W and height H. Examples: about 1.23 at 390 × 844 px, about 2.09 at 1024 × 700 px.
- **Capital points grow with the zoom.** At the minimum zoom a capital point has a radius of 2 px. Every three zoom levels the radius grows by 1 px, so it reaches 3 px at zoom 6, 4 px at zoom 9 and 5 px at zoom 12. From there it stays at 5 px. A capital point is always visible.
- **No Antarctica in Mercator.** The Mercator map does not draw Antarctica, and the visible area cannot go south of latitude -60: when the bottom goes below it, the map moves north. The globe keeps Antarctica and is not limited.
- **Laptop view toggle.** The globe/Mercator toggle that the phone layout shows is also visible on laptop, in the same position. Its hiding rule in `main-layout.css` is removed.
- **Country borders are visible in both modes.** In light mode the border colour is the `borderInput` token (`#6B7485`, 3.97:1 against the light land colour `#E8ECF2`), instead of white. In dark mode it is the `textSecondary` token (`#9AA6BA`, 6.16:1 against the dark land colour `#1D2638`), instead of `#0A1324`. Both are existing tokens, so no new colour is added.

## Scope across apps

The map style is shared: `apps/mobile` also builds its map with `buildMapStyle` from `packages/shared`. So the capital, border, Antarctica and minimum-zoom changes apply to the mobile app on phone-sized screens too. The globe minimum zoom and the laptop toggle are web only. The mobile limits depend on the blocked task 2.2 (see tasks). Per the project rules, phone and web share one spec for this change.

Confirmed by the owner: the Mercator changes also apply to the mobile app on phone-sized screens.

## Capabilities

### Modified Capabilities

- `world-map`: the requirements about the capital points and the pan and zoom are updated, and new requirements are added for the Antarctica limit, the Mercator start view, the laptop toggle and the border colour.

## Out of scope

- Changes to the data of the map (country shapes, the `{countryCode, status}` data from the API).
- Changes to the map controls and the header, apart from the laptop visibility of the existing toggle.
- New map states beyond `visited`, `lived` and `wantToGo`.
- Focus and hover of the mobile controls. That is a separate change, see `web-mobile-layout`.
- The laptop layout with a free 200 px column on the left. That is a separate request not yet proposed.

## Depends on

- `world-map` (`openspec/specs/world-map`).

## Open questions

- **Mobile limits:** the mobile map needs a `Camera` child in its template for the zoom limit (task 2.2 is blocked). Until the owner decides, the mobile zoom limit is not applied.
- **Globe gap:** the 4 px gap is taken on each side of the globe. Confirm, or say if the 4 px is the total gap.
- **Radius steps:** the steps of 1 px every 3 zoom levels are yours. Confirm them.
