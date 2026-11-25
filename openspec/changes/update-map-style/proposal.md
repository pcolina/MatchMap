# Proposal: update-map-style

## Why

The world map is the main screen of the app. Its styling is defined in the shared map style (`packages/shared/src/map/map-style.ts`) and in the map view component. Four things are hard to read or get in the way today: the capital points are too large when the map is zoomed out, the Antarctic strip shows at the bottom, the white country borders almost disappear on the light land colour, and they are hard to see in dark mode too.

## What Changes

- **Minimum zoom, Mercator.** The map cannot be zoomed out further than three zoom levels below today's smallest view. Today the style sets no minimum, so the smallest view is zoom 0 and the new minimum is zoom 3.
- **Minimum zoom, globe.** The globe cannot be zoomed out further than the zoom at which it fills the width of its container with a 4 px gap on each side. This zoom depends on the container width: the globe diameter in pixels is 512 · 2^zoom / π, so the minimum is log2((W − 8) · π / 512), where W is the container width. Examples: about 1.23 at 390 px, about 2.64 at 1024 px and about 3.14 at 1440 px.
- **Capital points grow with the zoom.** At the minimum zoom a capital point has a radius of 2 px. Every three zoom levels the radius grows by 1 px, so it reaches 3 px at zoom 6, 4 px at zoom 9 and 5 px at zoom 12. From there it stays at 5 px, which is today's size. A capital point is always visible.
- **No Antarctica.** The map cannot be panned south of latitude -60, so the Antarctic strip is not shown at the bottom. The northern limit stays as the map has it today. The same limit applies in the Mercator view. The globe view is not limited, see the open questions.
- **Country borders are visible in both modes.** In light mode the border colour is the `borderInput` token (`#6B7485`, 3.97:1 against the light land colour `#E8ECF2`), instead of white. In dark mode it is the `textSecondary` token (`#9AA6BA`, 6.16:1 against the dark land colour `#1D2638`), instead of `#0A1324`. Both are existing tokens, so no new colour is added.

## Scope across apps

The map style is shared: `apps/mobile` also builds its map with `buildMapStyle` from `packages/shared`. So the capital, border, Antarctica and minimum-zoom changes apply to the mobile app on phone-sized screens too, as well as to the web app. The globe minimum zoom is web only, because the globe is a web-only projection. Per the project rules, phone and web share one spec for this change.

Confirmed by the owner: the Mercator changes also apply to the mobile app on phone-sized screens.

## Capabilities

### Modified Capabilities

- `world-map`: the requirements about the capital points, the map background and the country colours are updated, and new requirements are added for the zoom limit, the pan limit and the border colour.

## Out of scope

- Changes to the data of the map (country shapes, the `{countryCode, status}` data from the API).
- Changes to the map controls and the header.
- New map states beyond `visited`, `lived` and `wantToGo`.
- Focus and hover of the mobile controls. That is a separate change, see `web-mobile-layout`.

## Depends on

- `world-map` (`openspec/specs/world-map`).

## Open questions

- **Globe gap:** the 4 px gap is taken on each side of the globe. Confirm, or say if the 4 px is the total gap.
- **Southern limit:** -60 is my choice, so the Antarctic strip is out of sight at the minimum zoom. It has to be checked on the phone and laptop sizes before it is approved.
- **Radius steps:** the steps of 1 px every 3 zoom levels are yours. Confirm them.
