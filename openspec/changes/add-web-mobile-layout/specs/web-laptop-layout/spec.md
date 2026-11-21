# Spec Delta

## Purpose

Sets the web main screen on laptop-sized viewports, from 601 px upwards: an empty full-width header, a map area at half the viewport height, the stats summary panel with the rest of the height, and an empty full-width footer. Header and footer are placeholders with the accent colour until their content is designed in later changes.

## ADDED Requirements

### Requirement: Laptop layout applies from 601 px

The web main screen SHALL use the laptop layout when the viewport width is 601 px or more. Below that width the phone layout applies.

#### Scenario: Laptop layout at 601 px
- **WHEN** the viewport is 601 px wide
- **THEN** the laptop layout is shown

#### Scenario: Phone layout at 600 px
- **WHEN** the viewport is 600 px wide
- **THEN** the phone layout is shown and the laptop layout is not

### Requirement: Header is an empty full-width accent bar

The laptop layout SHALL show a header at the top of the screen that spans the full viewport width, uses the `accent` colour token as its background, and has no content. Its height SHALL be 56 px at every laptop width.

#### Scenario: Header is 56 px high at every width
- **WHEN** the laptop layout is shown at any width from 601 px upwards
- **THEN** the header is 56 px high

#### Scenario: Header spans the full width
- **WHEN** the laptop layout is shown
- **THEN** the header is at the top of the screen and its width equals the viewport width

#### Scenario: Header has the accent background
- **WHEN** the laptop layout is shown in the light and in the dark scheme
- **THEN** the header background is the `accent` token of that scheme

### Requirement: Map area is half the viewport height

The laptop layout SHALL give the map area a height of 50 % of the viewport height, directly below the header. The value is a starting point and may be adjusted by the owner after the visual check.

#### Scenario: Map area is 50 % of the viewport height
- **WHEN** the laptop layout is shown in a viewport of any height
- **THEN** the height of the map area is 50 % of the viewport height

### Requirement: Stats panel takes the rest of the height

The laptop layout SHALL give the `stats-resume` panel the height that remains between the map area and the footer. The panel SHALL NOT show a vertical scroll bar.

#### Scenario: Stats panel fills the remaining height
- **WHEN** the laptop layout is shown
- **THEN** the `stats-resume` panel height equals the viewport height minus the header, the map area and the footer

#### Scenario: Stats panel does not scroll
- **WHEN** the user scrolls over the `stats-resume` panel on a laptop
- **THEN** the panel does not scroll and no vertical scroll bar is shown

### Requirement: Footer is an empty full-width accent bar

The laptop layout SHALL show a footer at the bottom of the screen that spans the full viewport width, uses the `accent` colour token as its background, and has no content. Its height is not fixed by this spec; it is set during the visual check.

#### Scenario: Footer spans the full width at the bottom
- **WHEN** the laptop layout is shown
- **THEN** the footer is at the bottom of the screen and its width equals the viewport width

#### Scenario: Footer has the accent background
- **WHEN** the laptop layout is shown in the light and in the dark scheme
- **THEN** the footer background is the `accent` token of that scheme
