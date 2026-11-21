# Spec Delta

## Purpose

Sets the layout of the mobile main screen after sign-in: a map area that takes the remaining height, and a fixed-height stats summary panel at the bottom that can be tapped. The panel is empty for now and the map is added in a later change.

## ADDED Requirements

### Requirement: Main layout has a map area and a stats panel

After sign-in, the mobile main screen SHALL show a column with two areas: a map area that takes the height left over, and a `stats-resume` panel at the bottom of the screen. The map component is not part of this change.

#### Scenario: Main screen shows both areas
- **WHEN** a signed-in user opens the main screen
- **THEN** the map area and the `stats-resume` panel are shown, with the panel at the bottom of the screen

### Requirement: Map area fills the remaining height

The map area SHALL take all the height that the stats panel does not use, and SHALL use the neutral `bg` colour token as its background, in the light and the dark scheme.

#### Scenario: Map area takes the leftover height
- **WHEN** the main screen is shown on a phone in portrait orientation
- **THEN** the map area's height equals the screen height minus the panel's height and the safe-area insets

#### Scenario: Map area background is the neutral token
- **WHEN** the system scheme is light, and then dark
- **THEN** the map area background is the `bg` token of that scheme

### Requirement: Stats panel has a fixed height and no scroll

The `stats-resume` panel SHALL have a height of exactly 250 px. Its content SHALL be clipped to that height, and it SHALL NOT show a vertical scroll bar or be a scroll view.

#### Scenario: Panel height is 250 px
- **WHEN** the main screen is shown on any phone in portrait orientation
- **THEN** the `stats-resume` panel is 250 px high

#### Scenario: Panel does not scroll
- **WHEN** the user drags vertically on the `stats-resume` panel
- **THEN** the panel does not scroll and no vertical scroll indicator is shown

#### Scenario: Panel keeps its height in landscape
- **WHEN** the device is rotated to landscape
- **THEN** the `stats-resume` panel is still 250 px high

### Requirement: Stats panel background is the accent token

The `stats-resume` panel SHALL use the `accent` colour token as its background, the same token as the sign-in button, in the light and the dark scheme. It SHALL NOT use a new colour.

#### Scenario: Panel background in light scheme
- **WHEN** the system scheme is light
- **THEN** the panel background is the light `accent` token

#### Scenario: Panel background in dark scheme
- **WHEN** the system scheme is dark
- **THEN** the panel background is the dark `accent` token

### Requirement: Stats panel is tappable with an accessible name

The `stats-resume` panel SHALL be a pressable element with the accessibility role `button` and an accessible label from the i18n key `stats.resume.label`. When pressed, it SHALL emit a press event. This change does not define what the press opens; the route for the fuller statistics comes in a later change.

#### Scenario: Panel has an accessible name
- **WHEN** the main screen is read by an accessibility tool
- **THEN** the panel is announced as a button with the label of `stats.resume.label`

#### Scenario: Panel emits a press
- **WHEN** the user taps the `stats-resume` panel
- **THEN** the panel emits a press event and the main layout takes no further action

### Requirement: Layout respects the safe area

The main layout SHALL keep the stats panel above the device safe area, so that the panel does not sit under the home indicator or the status bar.

#### Scenario: Panel sits above the home indicator
- **WHEN** the main screen is shown on a device with a bottom safe-area inset
- **THEN** the bottom of the `stats-resume` panel is above that inset

### Requirement: Translations for the panel label

The i18n key `stats.resume.label` SHALL have an English and a Spanish value in the catalogues of `packages/shared/i18n`. The Spanish and English texts are listed in the pull request for review.

#### Scenario: Label exists in both languages
- **WHEN** the catalogues are read
- **THEN** `stats.resume.label` has a non-empty value in `en` and in `es`
