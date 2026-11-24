# web-laptop-layout Delta

## REMOVED Requirements

### Requirement: Header is an empty full-width accent bar

Replaced by "Header shows the brand, the notifications bell and the profile". The header is no longer an empty accent bar.

## ADDED Requirements

### Requirement: Header is a full-width surface bar with the brand on the left

The laptop layout SHALL show a header at the top of the screen that spans the full viewport width, has no scroll, and uses the `surface` colour token as its background. Its height SHALL be 50 px at every laptop width. The header SHALL show the matchMap horizontal logo lockup with its text on the left: the light-background variant in the light scheme and the dark-background variant in the dark scheme.

#### Scenario: Header is 50 px high at every width
- **WHEN** the laptop layout is shown at any width from 601 px upwards
- **THEN** the header is 50 px high

#### Scenario: Header spans the full width
- **WHEN** the laptop layout is shown
- **THEN** the header is at the top of the screen and its width equals the viewport width

#### Scenario: Header has the surface background
- **WHEN** the laptop layout is shown in the light and in the dark scheme
- **THEN** the header background is the `surface` token of that scheme

#### Scenario: Logo follows the scheme
- **WHEN** the laptop layout is shown in the light scheme
- **THEN** the logo is the light-background variant, and in the dark scheme it is the dark-background variant

#### Scenario: Logo has an accessible name
- **WHEN** the header is read by an accessibility tool
- **THEN** the logo is announced as an image named matchMap

### Requirement: Header profile button at the right

On the right of the header the header SHALL show one profile button, which is the same control as the account button of the phone layout (`app-account-button`), with the same style, the same accessible name, and the same red dot while notifications are pending. The profile button SHALL open the account sheet. The header SHALL NOT show a notifications button. The profile button SHALL be keyboard reachable with a visible focus.

#### Scenario: Profile button opens the account sheet
- **WHEN** the user activates the profile button
- **THEN** the account sheet opens

#### Scenario: Profile button shows the same dot as the phone account button
- **WHEN** at least one notification is pending
- **THEN** the profile button shows the same red dot as the account button of the phone layout, and its name states the number of pending notifications

#### Scenario: No notifications button in the header
- **WHEN** the laptop layout is shown
- **THEN** the header has no notifications button

#### Scenario: Keyboard focus is visible
- **WHEN** the profile button has keyboard focus
- **THEN** a 2 px accent outline with a 2 px offset is shown around it

#### Scenario: Profile button is named
- **WHEN** the header is read by an accessibility tool
- **THEN** the profile button is named with the value of `map.controls.account`, or with the pending count when notifications are pending
