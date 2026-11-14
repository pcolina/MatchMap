# Spec Delta: client-sign-in

## ADDED Requirements

### Requirement: Input limit error messages

The sign-in page SHALL show the translated message for an input limit error returned by the API, next to the field it belongs to, and SHALL keep the values the user typed.

#### Scenario: Limit error shown next to its field
- **WHEN** the API returns one of the input limit error codes for a sign-in request
- **THEN** the message is shown next to the field it belongs to and the typed email and password are kept

#### Scenario: Limit error does not replace the failure message
- **WHEN** the API returns one of the input limit error codes
- **THEN** the page does not show the text of `login.signIn.errorInvalidCredentials`, `login.signIn.errorTooManyAttempts`, `login.common.errorNetwork` or `login.common.errorUnknown`

#### Scenario: Client validation is unchanged
- **WHEN** the user submits an email or password that breaks the client rules
- **THEN** the field shows the same message as before this change and no request is sent

### Requirement: Email limit error codes

The sign-in page SHALL map the API error code `invalid_email` to the text of `login.signIn.errorInvalidEmail`, and the error code `email_too_long` to the text of `login.signIn.errorEmailTooLong`. Both messages are shown in the email field.

#### Scenario: Email rejected by the API
- **WHEN** the API returns the error code `invalid_email` for a sign-in request
- **THEN** the email field shows the text of `login.signIn.errorInvalidEmail`

#### Scenario: Email too long rejected by the API
- **WHEN** the API returns the error code `email_too_long` for a sign-in request
- **THEN** the email field shows the text of `login.signIn.errorEmailTooLong`

### Requirement: Password limit error code

The sign-in page SHALL map the API error code `invalid_password` to the text of `login.signIn.errorInvalidPassword`, and show it in the password field.

#### Scenario: Password rejected by the API
- **WHEN** the API returns the error code `invalid_password` for a sign-in request
- **THEN** the password field shows the text of `login.signIn.errorInvalidPassword`

The messages are:

| Key | en | es |
|---|---|---|
| `login.signIn.errorInvalidEmail` | Enter a valid email address. | Introduce un email válido. |
| `login.signIn.errorEmailTooLong` | Email must be at most 254 characters. | El email debe tener como máximo 254 caracteres. |
| `login.signIn.errorInvalidPassword` | Password must be 6 to 20 characters. | La contraseña debe tener entre 6 y 20 caracteres. |
