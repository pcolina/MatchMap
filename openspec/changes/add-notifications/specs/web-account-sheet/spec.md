# web-account-sheet Delta

## MODIFIED Requirements

### Requirement: Rows form one list in order

The account sheet SHALL show its rows as one list, with no group headings, in this order: view profile, notifications, language, day or night mode, about, and sign out. A divider SHALL separate sign out from the rows above it. The day or night mode row SHALL be a switch that exposes whether dark mode is on. Each row SHALL be a button with an accessible name.

#### Scenario: Rows appear in order
- **WHEN** the account sheet is open
- **THEN** the rows appear in the order view profile, notifications, language, day or night mode, about, sign out

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
- **WHEN** the view profile, the notifications or the language row is activated
- **THEN** no request is sent to the API and no state of the session changes

## ADDED Requirements

### Requirement: Notifications row shows the pending count

While at least one notification is pending, the notifications row SHALL show the number of pending notifications as a red badge at the end of the row. The number SHALL be text, not only colour. While no notification is pending, the row SHALL show no badge. The accessible name of the row SHALL state the number of pending notifications, from an i18n key.

#### Scenario: Badge with the count
- **WHEN** two notifications are pending and the account sheet is open
- **THEN** the notifications row shows a red badge with the number 2 at its end, and its accessible name states 2 unread notifications

#### Scenario: No badge without pending notifications
- **WHEN** no notification is pending and the account sheet is open
- **THEN** the notifications row shows no badge and its accessible name does not state a count
