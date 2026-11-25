# Design: update-map-style

## 1. Capital point radius in the shared style

The capital layer in `packages/shared/src/map/map-style.ts` gets a zoom-dependent radius:

`'circle-radius': ['step', ['zoom'], 2, 6, 3, 9, 4, 12, 5]`

A step expression matches the spec exactly: 2 px from the minimum zoom 3 up to zoom 5, 3 px from zoom 6, 4 px from zoom 9 and 5 px from zoom 12 upwards. A linear interpolation would give in-between sizes that the spec does not ask for. The capital layer keeps its `circle-color` (the text token).

## 2. Country borders

The map palette in `tokens/tokens.json` (`map.countryBorder`) changes to the values of the two tokens the spec names:

- light: `#6B7485` (the value of `borderInput` in light)
- dark: `#9AA6BA` (the value of `textSecondary` in dark)

Both are copied, not referenced, because the map palette is a separate token group. A later token change must change both places. `pnpm codegen` regenerates `tokens/tokens.ts` and `tokens/tokens.css`. The `countryBorder` line width stays at 0.5.

## 3. Mercator zoom and pan limits

The limits are MapLibre map options, not style options, so they are set where the map is created:

- minimum zoom `3`;
- `maxBounds` `[[-180, -60], [180, 85]]`, which keeps the view from going south of latitude -60. The north limit is the Mercator limit of 85 degrees.

Both options are set only in the Mercator projection. The maximum zoom is not changed (MapLibre default).

## 4. Globe minimum zoom (web only)

When the globe is the projection, the web map view sets the minimum zoom from the container width each time the container is resized:

`minZoom = log2((W - 8) · π / 512)`, where W is the container width in pixels and the expression is clamped to be at least 0 when W is 8 px or less.

The derivation: the MapLibre globe has a diameter of `512 · 2^zoom / π` pixels. The formula is an assumption to be verified against the real projection in a test, see tasks. When the projection goes back to Mercator, the minimum zoom returns to 3 and `maxBounds` is restored.

The container width comes from a `ResizeObserver` on the map element, so a window resize or a change of layout updates the minimum.

## 5. Mobile

`apps/mobile/src/app/shared/map-view/map-view.props.ts` gets the same Mercator options: `minZoom: 3` and `maxBounds` as above. The mobile map is a native module through ng-native. **Open point:** the names of these options in the ng-native map module must be checked against its documentation before implementation. If the module does not support them, implementation stops and the question goes back to the owner, as `CLAUDE.md` §12 asks.

## 6. Tests

- `packages/shared`: the capital radius expression returns 2, 3, 4 and 5 at the zoom levels the spec names; the border colour in both palettes is the one the spec names.
- `apps/web` map view: Mercator sets `minZoom` 3 and `maxBounds`; globe sets the width-based `minZoom` and restores 3 and the bounds on Mercator; the formula is tested against the MapLibre projection at the widths in the spec scenarios.
- `apps/mobile` props: the props contain `minZoom: 3` and the bounds.

## 7. Not changed

- The data of the map and its API calls.
- The map controls and the header.
- The performance budget. The change adds no request and no asset.
