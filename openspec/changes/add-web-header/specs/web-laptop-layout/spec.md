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

### Requirement: Header controls at the right

On the right of the header, from left to right, the header SHALL show a notifications button and then a profile button. While at least one notification is pending, the notifications button SHALL show a red dot with the number of pending notifications inside it, and while none is pending it SHALL show no dot. The notifications button does nothing when it is activated. The profile button SHALL be the same control as the account button of the phone layout (`app-account-button`), with the same style, the same accessible name, the same red dot while notifications are pending, and the same action: it opens the account sheet. Both buttons SHALL be keyboard reachable with a visible focus.

#### Scenario: Bell and profile order
- **WHEN** the laptop layout is shown
- **THEN** the notifications button is to the left of the profile button, and both are at the right of the header

#### Scenario: Notifications dot shows the pending count
- **WHEN** two notifications are pending and the laptop layout is shown
- **THEN** the notifications button shows a red dot with the number 2 inside it

#### Scenario: No notifications dot without pending notifications
- **WHEN** no notification is pending and the laptop layout is shown
- **THEN** the notifications button shows no dot

#### Scenario: Notifications button does nothing
- **WHEN** the user activates the notifications button
- **THEN** no request is sent to the API and no state changes

#### Scenario: Profile button opens the account sheet
- **WHEN** the user activates the profile button
- **THEN** the account sheet opens

#### Scenario: Profile button shows the same dot as the phone account button
- **WHEN** at least one notification is pending
- **THEN** the profile button shows the same red dot as the account button of the phone layout

#### Scenario: Keyboard focus order
- **WHEN** the user moves focus with the keyboard through the header
- **THEN** focus visits the notifications button and then the profile button

#### Scenario: Keyboard focus is visible
- **WHEN** a header button has keyboard focus
- **THEN** a 2 px accent outline with a 2 px offset is shown around it

#### Scenario: Buttons have accessible names
- **WHEN** the header is read by an accessibility tool
- **THEN** the notifications button is named with the value of `account.sheet.notifications` and the profile button with the value of `map.controls.account`
