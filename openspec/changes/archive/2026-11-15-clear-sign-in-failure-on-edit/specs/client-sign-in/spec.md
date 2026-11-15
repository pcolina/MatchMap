# Spec Delta: client-sign-in

## ADDED Requirements

### Requirement: Failure cleared when the user edits a field

The sign-in page SHALL hide the sign-in failure message when the user changes the email or the password after a failed sign-in. The typed values SHALL be kept, and the reserved space of the failure message SHALL stay, so the layout does not move.

#### Scenario: Editing the email hides the failure
- **WHEN** a sign-in failure message is shown and the user changes the email
- **THEN** the sign-in failure message is hidden, and the typed email and password are kept

#### Scenario: Editing the password hides the failure
- **WHEN** a sign-in failure message is shown and the user changes the password
- **THEN** the sign-in failure message is hidden, and the typed email and password are kept

#### Scenario: Field error is shown alone after an edit
- **WHEN** a sign-in failure message is shown and the user changes the password to a value shorter than 6 characters
- **THEN** only the password field error `login.signIn.errorPasswordLength` is shown, and the sign-in failure message is hidden

#### Scenario: Reserved space stays after the failure is hidden
- **WHEN** the sign-in failure message is hidden by an edit
- **THEN** the Sign in button and the social buttons do not move

#### Scenario: Failure shown again after a new failed submit
- **WHEN** the user submits again and the sign-in request fails
- **THEN** the sign-in failure message is shown again

#### Scenario: Failure cleared before a submit with empty fields
- **WHEN** a sign-in failure message is shown and the user submits with an empty email
- **THEN** the sign-in failure message is hidden before the field errors are shown, and no request is sent

## MODIFIED Requirements

### Requirement: Sign-in failure position

The sign-in page SHALL show the sign-in failure message directly below the Sign in button, on the web app at every supported width and on the mobile app. The space for the message SHALL stay reserved, so that showing or hiding the message does not move the Sign in button, the divider or the social buttons.

#### Scenario: Failure message below the Sign in button
- **WHEN** a sign-in failure message is shown
- **THEN** the message is directly below the Sign in button and above the divider

#### Scenario: Social buttons do not move
- **WHEN** the sign-in failure message is shown or hidden
- **THEN** the Sign in button, the divider and the social buttons keep their position

#### Scenario: Same position on mobile
- **WHEN** a sign-in failure message is shown in the mobile app
- **THEN** the message is shown in the same position as on the web layout
