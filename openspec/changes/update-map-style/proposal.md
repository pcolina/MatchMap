# Proposal: update-map-style

## Why

The world map is the main screen of the app. Its styling is defined in the shared map style (`packages/shared/src/map/map-style.ts`) and in the map view component. Four things are hard to read or get in the way today: the capital points are too large when the map is zoomed out, the Antarctic strip shows at the bottom, the white country borders are hard to see in light mode, and they are hard to see in dark mode too.

## What Changes

- **Capital points grow with the zoom.** The point size follows the zoom level: small when the map is zoomed out, and growing to the size it has today at the largest zoom. A capital point is always visible, with a minimum size. [NEEDS CLARIFICATION: the zoom level at which the point reaches today's size (today's size is a fixed radius of 5 px), and the minimum radius in px that keeps it visible.]
- **Minimum zoom.** The map cannot be zoomed out further than three zoom levels below today's minimum. [NEEDS CLARIFICATION: today the style sets no minimum zoom, so the default is 0. Confirm that the new minimum is 3.]
- **Antarctica is not shown.** The map cannot be panned to show the Antarctic strip at the bottom. [NEEDS CLARIFICATION: the southern latitude limit of the visible area, and the northern limit. Confirm that the same limit applies in Mercator and in the globe view.]
- **Country borders are visible in light and in dark mode.** Today the border colour is white in light mode (`countryBorder` light `#FFFFFF`) and `#0A1324` in dark mode. [NEEDS CLARIFICATION: the exact grey for each mode, as a hex value or as a token. The change does not pick a colour on its own.]

## Capabilities

### Modified Capabilities

- `world-map`: the requirements about capital points, the map background, the projection and the country colours are updated, and a requirement about the zoom and pan limits and the border visibility is added.

## Out of scope

- Changes to the data of the map (country shapes, the `{countryCode, status}` data from the API).
- Changes to the map controls and the header.
- New map states beyond `visited`, `lived` and `wantToGo`.
- Focus and hover of the mobile controls. That is a separate change, see `web-mobile-layout`.

## Depends on

- `world-map` (`openspec/specs/world-map`).

## Open questions

- All the `[NEEDS CLARIFICATION]` markers above. The change cannot move to specs until none is left.
