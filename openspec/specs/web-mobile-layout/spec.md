# web-mobile-layout Specification

## Purpose

Sets the web main screen on phone-sized viewports to the same layout as the mobile app after sign-in: a map area that takes the remaining height, and a fixed-height tappable stats summary panel at the bottom. Wider viewports keep the current layout until their own change.

## Requirements

### Requirement: Phone layout applies up to 600 px

The web main screen SHALL use the phone layout when the viewport width is 600 px or less, and SHALL keep the current layout when it is wider. The phone layout SHALL fill the full viewport width.

#### Scenario: Phone layout at 600 px
- **WHEN** the viewport is 600 px wide
- **THEN** the phone layout is shown and fills the full width

#### Scenario: Current layout above 600 px
- **WHEN** the viewport is 601 px wide
- **THEN** the current main layout is shown, with the map filling the page and no stats panel

#### Scenario: Phone layout at 320 px
- **WHEN** the viewport is 320 px wide
- **THEN** the phone layout is shown without horizontal scroll

### Requirement: Main screen has a map area and a stats panel

In the phone layout, the main screen SHALL show a column with two areas: a map area that takes the height the stats panel does not use, and the `stats-resume` panel at the bottom of the screen.

#### Scenario: Both areas are shown
- **WHEN** a signed-in user opens the main screen at a phone width
- **THEN** the map area is shown above the `stats-resume` panel

#### Scenario: Map area takes the leftover height
- **WHEN** the main screen is shown at a phone width
- **THEN** the height of the map area equals the viewport height minus the panel height and the bottom safe-area inset

### Requirement: Stats panel has a fixed height and no scroll

The `stats-resume` panel SHALL have a height of exactly 250 px. Its content SHALL be clipped to that height, and it SHALL NOT show a vertical scroll bar.

#### Scenario: Panel height is 250 px
- **WHEN** the phone layout is shown
- **THEN** the `stats-resume` panel is 250 px high

#### Scenario: Panel does not scroll
- **WHEN** the user scrolls with the mouse wheel or drags over the `stats-resume` panel
- **THEN** the panel does not scroll and no vertical scroll bar is shown

### Requirement: Stats panel background is the accent token

The `stats-resume` panel SHALL use the `accent` colour token as its background, the same token as the mobile panel, in the light and the dark scheme. It SHALL NOT use a new colour.

#### Scenario: Panel background in light scheme
- **WHEN** the system scheme is light
- **THEN** the panel background is the light `accent` token

#### Scenario: Panel background in dark scheme
- **WHEN** the system scheme is dark
- **THEN** the panel background is the dark `accent` token

### Requirement: Stats panel is tappable with an accessible name

The `stats-resume` panel SHALL be a button with the accessible name from the i18n key `stats.resume.label`. Activating it with a click or the keyboard SHALL emit a press event. This change does not define what the press opens.

#### Scenario: Panel has an accessible name
- **WHEN** the main screen is read by an accessibility tool
- **THEN** the panel is announced as a button named with the value of `stats.resume.label`

#### Scenario: Panel is activated with the keyboard
- **WHEN** the panel has focus and the user presses Enter
- **THEN** the panel emits one press event

#### Scenario: Panel emits a press
- **WHEN** the user clicks the `stats-resume` panel
- **THEN** the panel emits one press event and the main layout takes no further action

### Requirement: Layout respects the bottom safe area

The phone layout SHALL keep the bottom of the `stats-resume` panel above the device bottom safe-area inset.

#### Scenario: Panel sits above the bottom inset
- **WHEN** the phone layout is shown on a device with a bottom safe-area inset
- **THEN** the bottom of the `stats-resume` panel is above that inset

### Requirement: Top-left control column

The web main screen on phone-sized viewports SHALL show, at the top left over the map, one column with two icon controls, the add-place control first and the friends control below it. Both controls SHALL be presentational in this change and SHALL NOT call the API or change any state.

#### Scenario: Add-place control is at the top of the column
- **WHEN** the phone layout is shown
- **THEN** the add-place control is at the top left of the map, above the friends control

#### Scenario: Friends control is below the add-place control
- **WHEN** the phone layout is shown
- **THEN** the friends control is directly below the add-place control, in the same column

### Requirement: Top-right avatar control

The web main screen on phone-sized viewports SHALL show one avatar control at the top right over the map. While the user information is loading, the avatar SHALL show a grey placeholder circle with the shape of the avatar, as `docs/design.md` section 7.9 requires. While at least one notification is pending, the avatar SHALL show a red dot, and its accessible name SHALL state the number of pending notifications, from an i18n key. When no notification is pending, the avatar SHALL show no dot.

#### Scenario: Avatar placeholder while loading
- **WHEN** the user information is loading
- **THEN** the avatar control shows a grey circle with no pulse when reduced motion is set

#### Scenario: Avatar control is alone at the top right
- **WHEN** the phone layout is shown
- **THEN** no other control is at the top right of the map

#### Scenario: Red dot while notifications are pending
- **WHEN** at least one notification is pending
- **THEN** the avatar control shows a red dot and its accessible name states the number of pending notifications

#### Scenario: No dot without pending notifications
- **WHEN** no notification is pending
- **THEN** the avatar control shows no dot and its accessible name does not state a count

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

### Requirement: Icon-only controls have accessible names

Every control of this change that shows only an icon SHALL have an accessible name, and SHALL have a touch target of at least 44 px in each direction, even when the icon itself is smaller.

#### Scenario: Icon-only controls have names
- **WHEN** the phone layout is shown
- **THEN** the add-place, friends, avatar and view toggle controls each have an accessible name

#### Scenario: Touch targets are at least 44 px
- **WHEN** the phone layout is shown
- **THEN** each control has a touch target of at least 44 px by 44 px

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
