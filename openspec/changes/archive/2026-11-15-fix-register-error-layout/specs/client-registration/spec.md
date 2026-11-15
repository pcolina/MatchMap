# Spec Delta: client-registration

## MODIFIED Requirements

### Requirement: Field errors

An invalid field SHALL show its border in `danger`, and its error message below the field in `caption` with the `danger` colour. The message SHALL be preceded by a red alert icon, and its space SHALL reserve the height of two lines, so that a message that wraps to two lines, or that appears and disappears, does not move any other element on the page.

#### Scenario: Error state on a field
- **WHEN** a field is invalid
- **THEN** its border is `danger`, and its error message is shown below it in `caption` with the `danger` colour, preceded by a red alert icon

#### Scenario: Two-line error keeps the layout
- **WHEN** a field error message takes two lines
- **THEN** the space reserved for it is at least two lines high, and the elements below it do not move

#### Scenario: Error space stays when there is no error
- **WHEN** a field has no error message
- **THEN** its error space is still reserved with the height of two lines, and no icon is shown

## ADDED Requirements

### Requirement: Registration failure below the submit button

The registration page SHALL show the general registration failure message directly below the `Create account` button, with the same alert icon and reserved space as the field errors. If the message does not fit in the visible area below the button, the whole form SHALL scroll so that the message is visible. The message SHALL never be cut off.

#### Scenario: Failure message below the button
- **WHEN** a registration request fails
- **THEN** the failure message is shown directly below the `Create account` button, preceded by a red alert icon

#### Scenario: Button does not move when the message appears
- **WHEN** the failure message is shown or hidden
- **THEN** the `Create account` button stays in place

#### Scenario: Form scrolls when the message does not fit
- **WHEN** the failure message is below the visible area of the screen
- **THEN** the whole form scrolls up until the message is visible

#### Scenario: Same behaviour on mobile
- **WHEN** a registration request fails in the mobile app
- **THEN** the failure message is shown below the `Create account` button, and the form scrolls in the same way
