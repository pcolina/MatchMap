# Proposal: update-map-style

## Why

The world map is the main screen of the app, and its styling (state colours, land and water, country borders and labels, capital markers) is defined in the shared map style and the map view component. The owner wants to change parts of this styling. The exact changes are not yet written down, so they are listed below as open questions.

## What Changes

- **State colours** (`visited`, `lived`, `wantToGo`): [NEEDS CLARIFICATION: which colour or pattern for each state, in day and in night mode, and whether the change must keep the states distinguishable without colour (`docs/design.md` §2.2)?]
- **Land and water**: [NEEDS CLARIFICATION: which colours change for land, water and background, in day and night?]
- **Country borders and labels**: [NEEDS CLARIFICATION: which borders and country labels should be shown, at which zoom levels, with which size and colour?]
- **Capital markers**: [NEEDS CLARIFICATION: should capitals stay visible at every zoom, or only from a zoom level? Which size and colour?]
- **Projection**: [NEEDS CLARIFICATION: does the change affect the flat and globe projections equally?]

## Capabilities

### Modified Capabilities

- `world-map`: the requirements about colour per country, map background, capital points and projection are updated as the open questions are answered.

## Out of scope

- Changes to the data of the map (country shapes, the `{countryCode, status}` data from the API).
- Changes to the map controls and the header.
- New map states beyond `visited`, `lived` and `wantToGo`.

## Depends on

- `world-map` (`openspec/specs/world-map`).

## Open questions

- All the `[NEEDS CLARIFICATION]` markers above. The change cannot move to specs until none is left.
