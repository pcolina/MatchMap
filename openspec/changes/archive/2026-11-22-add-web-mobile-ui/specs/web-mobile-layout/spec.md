# web-mobile-layout Delta

## ADDED Requirements

### Requirement: Top-left control column

The web main screen on phone-sized viewports SHALL show, at the top left over the map, one column with two icon controls, the add-place control first and the friends control below it. Both controls SHALL be presentational in this change and SHALL NOT call the API or change any state.

#### Scenario: Add-place control is at the top of the column
- **WHEN** the phone layout is shown
- **THEN** the add-place control is at the top left of the map, above the friends control

#### Scenario: Friends control is below the add-place control
- **WHEN** the phone layout is shown
- **THEN** the friends control is directly below the add-place control, in the same column

### Requirement: Top-right avatar control

The web main screen on phone-sized viewports SHALL show one avatar control at the top right over the map. While the user information is loading, the avatar SHALL show a grey placeholder circle with the shape of the avatar, as `docs/design.md` section 7.9 requires.

#### Scenario: Avatar placeholder while loading
- **WHEN** the user information is loading
- **THEN** the avatar control shows a grey circle with no pulse when reduced motion is set

#### Scenario: Avatar control is alone at the top right
- **WHEN** the phone layout is shown
- **THEN** no other control is at the top right of the map

### Requirement: Bottom-right view toggle

The web main screen on phone-sized viewports SHALL show, at the bottom right over the map, one view toggle that switches between the globe and the flat view. The map SHALL NOT show the MapLibre logo or its attribution, and the matchMap brand mark SHALL NOT be shown in this row.

#### Scenario: Toggle at the bottom right
- **WHEN** the phone layout is shown
- **THEN** the view toggle is at the bottom right of the map, and it is the only control in that row

#### Scenario: No MapLibre logo or attribution on the map
- **WHEN** the map is shown
- **THEN** neither the MapLibre logo nor the attribution credit is visible on the map

### Requirement: Icon-only controls have accessible names

Every control of this change that shows only an icon SHALL have an accessible name, and SHALL have a touch target of at least 44 px in each direction, even when the icon itself is smaller.

#### Scenario: Icon-only controls have names
- **WHEN** the phone layout is shown
- **THEN** the add-place, friends, avatar and view toggle controls each have an accessible name

#### Scenario: Touch targets are at least 44 px
- **WHEN** the phone layout is shown
- **THEN** each control has a touch target of at least 44 px by 44 px

### Requirement: View toggle exposes its state

The globe/mercator view toggle SHALL expose whether the globe view is active with `aria-pressed`, and SHALL show the active state with a change of icon shape, not only of colour.

#### Scenario: Pressed state is exposed
- **WHEN** the globe view is active
- **THEN** the view toggle has `aria-pressed` set to true

#### Scenario: Active state is not only colour
- **WHEN** the view toggle changes state
- **THEN** its icon changes shape

### Requirement: Controls keep text contrast over the map

The controls over the map SHALL sit on a surface background, with a contrast of at least 4.5:1 between their icon or text and that background, in light and dark schemes.

#### Scenario: Controls over the map in light scheme
- **WHEN** the map is shown in light scheme
- **THEN** each control has a surface background and at least 4.5:1 contrast for its icon

#### Scenario: Controls over the map in dark scheme
- **WHEN** the map is shown in dark scheme
- **THEN** each control has a surface background and at least 4.5:1 contrast for its icon

### Requirement: Focus order follows the screen

The keyboard focus order on the phone layout SHALL be: top-left column, top-right avatar, map, stats panel, bottom-right row.

#### Scenario: Focus moves in the set order
- **WHEN** the user moves focus with the keyboard from the first control
- **THEN** focus visits the controls in the order top-left column, top-right avatar, map, stats panel, bottom-right row
