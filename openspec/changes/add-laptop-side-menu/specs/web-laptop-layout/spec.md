# web-laptop-layout Delta

## ADDED Requirements

### Requirement: Side menu on laptop

The web laptop layout SHALL show a side menu on the left, 200 px wide and as high as the viewport, with the header background colour. The menu SHALL have two items: add a place, with a plus icon in the accent colour, and friends, with a users icon in the `textSecondary` colour. The menu SHALL be a navigation landmark with an accessible name from an i18n key.

#### Scenario: Menu is shown on laptop
- **WHEN** the viewport is 601 px or wider
- **THEN** the side menu is shown on the left, 200 px wide and the full viewport height, and the header and the map start to the right of it

#### Scenario: Menu is hidden on phones
- **WHEN** the viewport is narrower than 601 px
- **THEN** the side menu is not shown

#### Scenario: Items are in the menu
- **WHEN** the menu is shown
- **THEN** it has the add place item first and the friends item second, each a button with its name

#### Scenario: Keyboard order
- **WHEN** the user moves through the page with Tab from the last header icon
- **THEN** focus goes to the add place item, then the friends item, then a skip link that moves focus to the map

#### Scenario: Focus is visible
- **WHEN** an item or the skip link receives keyboard focus
- **THEN** it shows the same focus ring as the header buttons

#### Scenario: Hover on pointer devices
- **WHEN** a pointer hovers over an item on a device with a fine pointer
- **THEN** the item uses the `surfaceRaised` background, which stands out from the menu background
