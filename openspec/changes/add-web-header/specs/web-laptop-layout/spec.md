# web-laptop-layout Delta

## REMOVED Requirements

### Requirement: Header is an empty full-width accent bar

Replaced by "Header shows the brand, the notifications bell and the profile". The header is no longer an empty accent bar.

## ADDED Requirements

### Requirement: Header is a full-width bar with the brand on the left

The laptop layout SHALL show a header at the top of the screen that spans the full viewport width, has no scroll, and uses the `surface` colour token as its background in the light scheme and the `accent` colour token in the dark scheme, with the `onAccent` colour token for its text and icons in the dark scheme. Its height SHALL be 50 px at every laptop width. The header SHALL show the matchMap horizontal logo lockup with its text on the left, always the light-background variant, which reads on both the surface and the accent background.

#### Scenario: Header is 50 px high at every width
- **WHEN** the laptop layout is shown at any width from 601 px upwards
- **THEN** the header is 50 px high

#### Scenario: Header spans the full width
- **WHEN** the laptop layout is shown
- **THEN** the header is at the top of the screen and its width equals the viewport width

#### Scenario: Header has the surface background in light
- **WHEN** the laptop layout is shown in the light scheme
- **THEN** the header background is the `surface` token

#### Scenario: Header has the accent background in dark
- **WHEN** the laptop layout is shown in the dark scheme
- **THEN** the header background is the `accent` token and its icons use the `onAccent` token

#### Scenario: Logo is the same in both schemes
- **WHEN** the laptop layout is shown in the light or in the dark scheme
- **THEN** the logo is the light-background variant

#### Scenario: Logo has an accessible name
- **WHEN** the header is read by an accessibility tool
- **THEN** the logo is announced as an image named matchMap

### Requirement: Header controls at the right

On the right of the header the header SHALL show two buttons from left to right: a notifications button and a profile button. The notifications button SHALL show a red dot with the number of pending notifications inside it while at least one notification is pending, and no dot while none is pending. The notifications button does nothing when it is activated. The profile button SHALL be the account button of the phone layout (`app-account-button`), with the same style and the same action: it opens the account sheet. The profile button SHALL show no red dot, and its accessible name SHALL be the value of `map.controls.account`, whatever the pending count. Both buttons SHALL be keyboard reachable with a visible focus.

#### Scenario: Bell and profile order
- **WHEN** the laptop layout is shown
- **THEN** the notifications button is to the left of the profile button

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

#### Scenario: Profile button shows no dot
- **WHEN** at least one notification is pending and the laptop layout is shown
- **THEN** the profile button shows no red dot and its name is the value of `map.controls.account`

#### Scenario: Keyboard focus is visible
- **WHEN** a header button has keyboard focus
- **THEN** a 2 px accent outline with a 2 px offset is shown around it
