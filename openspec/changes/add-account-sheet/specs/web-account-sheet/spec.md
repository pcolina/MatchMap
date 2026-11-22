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

### Requirement: Sheet sits 16 px from the right edge and is sized to its content

The account sheet SHALL sit 4 px from the right edge of the viewport, with all four corners rounded. It SHALL take the height of its content, and SHALL take the width of its content up to a maximum of 320 px. It SHALL never be wider than the viewport.

#### Scenario: Sheet is near the right edge
- **WHEN** the account sheet is open on a phone-sized viewport
- **THEN** its right edge is 4 px from the right edge of the viewport and its four corners are rounded

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

### Requirement: Header shows the username and the email

The header of the account sheet SHALL show the username of the signed-in user in the accent colour, with the email of the user in smaller text under it. Both SHALL come from the `me` query. While the query has not answered, the header SHALL show a loading line in place of the username and no email.

#### Scenario: Username is shown
- **WHEN** the account sheet is open and the `me` query has answered
- **THEN** the header shows the username of the user in the accent colour

#### Scenario: Email is shown under the username
- **WHEN** the account sheet is open and the `me` query has answered
- **THEN** the header shows the email of the user in smaller text under the username

#### Scenario: Loading line while the query is pending
- **WHEN** the account sheet is open and the `me` query has not answered
- **THEN** the header shows a loading line in place of the username and no email

### Requirement: Rows form one list in order

The account sheet SHALL show its rows as one list, with no group headings, in this order: view profile, language, day or night mode, about, and sign out. A divider SHALL separate sign out from the rows above it. The day or night mode row SHALL be a switch that exposes whether dark mode is on. Each row SHALL be a button with an accessible name.

#### Scenario: Rows appear in order
- **WHEN** the account sheet is open
- **THEN** the rows appear in the order view profile, language, day or night mode, about, sign out

#### Scenario: Sign out is last
- **WHEN** the account sheet is open
- **THEN** sign out is the last row and a divider comes before it

#### Scenario: Day or night mode is a switch
- **WHEN** the account sheet is open
- **THEN** the day or night mode row is a switch and exposes whether dark mode is on

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
