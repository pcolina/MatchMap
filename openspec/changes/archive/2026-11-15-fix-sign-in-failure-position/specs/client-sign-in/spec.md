# Spec Delta: client-sign-in

## ADDED Requirements

### Requirement: Sign-in failure position

The sign-in page SHALL show the sign-in failure message directly below the password field, closer to the password field than to the Sign in button, on the web app at every supported width and on the mobile app.

#### Scenario: Failure message below the password field
- **WHEN** a sign-in request fails with any sign-in failure message
- **THEN** the failure message is shown directly below the password field and above the Sign in button

#### Scenario: Failure message closer to the password field than to the button
- **WHEN** a sign-in failure message is shown on the laptop web layout or the web layout at phone width
- **THEN** the gap between the password field and the message is smaller than the gap between the message and the Sign in button

#### Scenario: Same position on mobile
- **WHEN** a sign-in failure message is shown in the mobile app
- **THEN** the message is shown in the same position as on the web layout at phone width

#### Scenario: Reserved space keeps the layout still
- **WHEN** a sign-in failure message is shown or hidden
- **THEN** the Sign in button and the social buttons do not move

#### Scenario: Position does not change the message
- **WHEN** a sign-in request fails with `login.signIn.errorInvalidCredentials`, `login.signIn.errorTooManyAttempts`, `login.common.errorNetwork` or `login.common.errorUnknown`
- **THEN** the page shows the same text as before this change
