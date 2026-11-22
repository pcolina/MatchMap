# web-account-sheet Specification

## ADDED Requirements

### Requirement: Account button opens the account sheet

On phone-sized viewports, activating the account button SHALL open the account sheet, and the account button SHALL expose that the sheet is open with `aria-expanded`. The sheet SHALL be a dialog with an accessible name.

#### Scenario: Tapping the account button opens the sheet
- **WHEN** the user activates the account button
- **THEN** the account sheet is shown and the account button has `aria-expanded` set to true

#### Scenario: The sheet is a named dialog
- **WHEN** the account sheet is open
- **THEN** it is exposed as a dialog whose accessible name is the display name of the user

### Requirement: Sheet is attached to the right edge and sized to its content

The account sheet SHALL be attached to the right edge of the viewport, SHALL take the height of its content, and SHALL take the width of its content up to a maximum of 320 px. It SHALL never be wider than the viewport.

#### Scenario: Sheet is at the right edge
- **WHEN** the account sheet is open on a phone-sized viewport
- **THEN** its right edge touches the right edge of the viewport

#### Scenario: Width is capped at 320 px
- **WHEN** the account sheet is open on a viewport wider than 320 px
- **THEN** its width is 320 px or less

#### Scenario: Narrow viewport
- **WHEN** the account sheet is open on a viewport of 320 px
- **THEN** the sheet is not wider than the viewport

### Requirement: Soft fade in and out

The account sheet and its backdrop SHALL fade in when opened and fade out when closed, over 200 ms. With the system reduced-motion setting, the sheet SHALL appear and disappear without a transition.

#### Scenario: Fade on open and close
- **WHEN** the account sheet is opened or closed without reduced motion
- **THEN** its opacity changes over 200 ms

#### Scenario: Reduced motion has no transition
- **WHEN** the account sheet is opened or closed with reduced motion set
- **THEN** it appears or disappears without a transition

### Requirement: Header shows the display name only

The header of the account sheet SHALL show the display name of the user. It SHALL NOT show the email address of the user.

#### Scenario: Display name is shown
- **WHEN** the account sheet is open
- **THEN** the header shows the display name of the user

#### Scenario: Email is not shown
- **WHEN** the account sheet is open
- **THEN** no email address is shown in the sheet

### Requirement: Rows are grouped in four blocks in order

The account sheet SHALL show four blocks in this order, each with a heading: Account (view profile), Settings (language, and day or night mode), About (about), and Session (sign out). Each row SHALL be a button with an accessible name.

#### Scenario: Blocks appear in order
- **WHEN** the account sheet is open
- **THEN** the blocks appear in the order Account, Settings, About, Session

#### Scenario: Rows are buttons with names
- **WHEN** the account sheet is open
- **THEN** each row is a button with an accessible name

#### Scenario: Rows are presentational
- **WHEN** a row is activated
- **THEN** no request is sent to the API and no state of the session changes

### Requirement: Sheet closes on backdrop tap, Escape and the close control

The account sheet SHALL close when the user taps the backdrop, presses Escape, or activates a close control in its header. When it closes, focus SHALL return to the account button.

#### Scenario: Tap outside closes the sheet
- **WHEN** the user taps the backdrop while the sheet is open
- **THEN** the sheet closes

#### Scenario: Escape closes the sheet
- **WHEN** the user presses Escape while the sheet is open
- **THEN** the sheet closes

#### Scenario: Close control closes the sheet
- **WHEN** the user activates the close control in the header
- **THEN** the sheet closes

#### Scenario: Focus returns to the account button
- **WHEN** the sheet closes
- **THEN** keyboard focus is on the account button

### Requirement: Focus stays in the sheet while it is open

While the account sheet is open, keyboard focus SHALL stay inside the sheet, and Tab SHALL cycle through its controls.

#### Scenario: Tab does not leave the sheet
- **WHEN** the sheet is open and the user presses Tab on the last control
- **THEN** focus moves to the first control of the sheet
