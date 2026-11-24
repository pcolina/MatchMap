# web-mobile-layout Delta

## MODIFIED Requirements

### Requirement: Bottom-right view toggle

The web main screen on phone-sized viewports SHALL show, at the bottom right over the map, one view toggle that switches the map between the Mercator projection and the globe projection. The map SHALL NOT show the MapLibre logo or its attribution, and the matchMap brand mark SHALL NOT be shown in this row.

#### Scenario: Toggle at the bottom right
- **WHEN** the phone layout is shown
- **THEN** the view toggle is at the bottom right of the map, and it is the only control in that row

#### Scenario: Pressing the toggle switches the projection
- **WHEN** the user presses the view toggle
- **THEN** the map switches between the Mercator projection and the globe projection, as described in `world-map`

#### Scenario: No MapLibre logo or attribution on the map
- **WHEN** the map is shown
- **THEN** neither the MapLibre logo nor the attribution credit is visible on the map

### Requirement: View toggle exposes its state

The globe/mercator view toggle SHALL expose whether the globe view is active with `aria-pressed`, SHALL show the active state with a change of icon shape, not only of colour, and SHALL keep its state in step with the map projection.

#### Scenario: Pressed state is exposed
- **WHEN** the globe view is active
- **THEN** the view toggle has `aria-pressed` set to true

#### Scenario: Active state is not only colour
- **WHEN** the view toggle changes state
- **THEN** its icon changes shape

#### Scenario: Toggle follows the saved projection
- **WHEN** the app opens with the globe projection saved on this device
- **THEN** the view toggle has `aria-pressed` set to true and shows the flat-map icon

#### Scenario: Accessible name describes the destination
- **WHEN** the Mercator projection is shown
- **THEN** the view toggle is named "Globe view", and when the globe is shown it is named "Mercator view"

