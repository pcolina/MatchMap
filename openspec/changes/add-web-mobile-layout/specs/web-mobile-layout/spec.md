# Spec Delta

## Purpose

Sets the web main screen on phone-sized viewports to the same layout as the mobile app after sign-in: a map area that takes the remaining height, and a fixed-height tappable stats summary panel at the bottom. Wider viewports keep the current layout until their own change.

## ADDED Requirements

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
