## MODIFIED Requirements

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
- **WHEN** the view profile or the language row is activated
- **THEN** no request is sent to the API and no state of the session changes

## ADDED Requirements

### Requirement: Sign out clears the session and shows the sign-in page

Activating sign out SHALL call the logout operation of the API. Whatever the result of that call, the app SHALL clear the access token on this device and SHALL show the sign-in page. A failed call SHALL NOT keep the user signed in.

#### Scenario: Sign out after a successful call
- **WHEN** the user activates sign out and the logout operation succeeds
- **THEN** the access token is cleared on this device and the sign-in page is shown

#### Scenario: Sign out after a failed call
- **WHEN** the user activates sign out and the logout operation fails
- **THEN** the access token is cleared on this device and the sign-in page is shown

### Requirement: About dialog shows the app name and version

Activating about SHALL open a dialog that shows the app name, `matchMap`, and its version, `1.0.0`, with the version in the accent colour. The dialog SHALL close with its close control, with Escape, or with a tap outside it. When it closes, focus SHALL return to the about row.

#### Scenario: About shows the name and version
- **WHEN** the user activates about
- **THEN** a dialog shows `matchMap` and the version `1.0.0` in the accent colour

#### Scenario: About closes and returns focus
- **WHEN** the about dialog is open and the user closes it with its close control, Escape or a tap outside it
- **THEN** the dialog closes and focus is on the about row
