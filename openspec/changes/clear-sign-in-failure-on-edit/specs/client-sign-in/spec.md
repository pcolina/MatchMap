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
