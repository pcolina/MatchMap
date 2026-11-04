# client-registration

## ADDED Requirements

### Requirement: Registration page layout

The registration page SHALL centre its content horizontally and vertically, in portrait and landscape. On mobile, the layout SHALL respect the safe area. The language switcher SHALL appear in the top-right corner, as on the sign-in page.

#### Scenario: Centred content on phone
- **WHEN** the registration page is shown on a phone in portrait or landscape
- **THEN** its content is centred horizontally and vertically

#### Scenario: Switcher is shown
- **WHEN** the registration page is shown
- **THEN** a circular button with the `languages` icon is visible in the top-right corner, with the accessible name of `login.signIn.languageSwitcher`, and it does nothing

### Requirement: Registration fields and actions

The registration page SHALL show an email field (label `login.register.emailLabel`), a password field (label `login.register.passwordLabel`), one primary button (text `login.register.submit`) and a link back to sign-in (text `login.register.goToSignIn`).

#### Scenario: Fields and actions are shown
- **WHEN** the registration page is shown
- **THEN** both fields, the registration button and the link back to sign-in are visible with their translated labels

#### Scenario: Link back to sign-in
- **WHEN** the user activates the link back to sign-in
- **THEN** the sign-in page is shown

### Requirement: Email validation

The client SHALL validate the email with the same rules as the API: standard email format, at most 254 characters, and trimmed and lower-cased before sending.

#### Scenario: Invalid email format
- **WHEN** the user submits an email that is not in standard email format
- **THEN** the email field shows an error and no request is sent

#### Scenario: Email is normalised before sending
- **WHEN** the user submits " User@Example.com " with spaces and capitals
- **THEN** the request sends "user@example.com"

### Requirement: Password validation

The password SHALL have between 6 and 20 characters, with at least one lowercase letter, one uppercase letter and one special character. The client SHALL apply the same rules as the API.

#### Scenario: Password too short
- **WHEN** the user submits a password with 5 characters
- **THEN** the password field shows an error and no request is sent

#### Scenario: Password too long
- **WHEN** the user submits a password with 21 characters
- **THEN** the password field shows an error and no request is sent

#### Scenario: Password without a required character class
- **WHEN** the user submits a password without a lowercase letter, without an uppercase letter or without a special character
- **THEN** the password field shows an error and no request is sent

#### Scenario: Valid password
- **WHEN** the user submits a password of 6 to 20 characters with a lowercase letter, an uppercase letter and a special character
- **THEN** the password field shows no error

The password field shows the text of `login.register.errorPasswordInvalid`: `en` "Use 6 to 20 characters, with a lowercase letter, an uppercase letter and a special character.", `es` "Usa de 6 a 20 caracteres, con una letra minúscula, una mayúscula y un carácter especial."

### Requirement: Field errors

An invalid field SHALL show its border in `danger`, and its error message below the field in `caption` with the `danger` colour.

#### Scenario: Error state on a field
- **WHEN** a field is invalid
- **THEN** its border is `danger` and its error message is shown below it in `caption` with the `danger` colour

### Requirement: Registration request

Registration SHALL call the GraphQL mutation `register(input: RegisterInput!): User!` through the operations and generated types in `packages/shared`. The `RegisterInput` SHALL contain `email` and `password`.

#### Scenario: Request contains email and password
- **WHEN** the user submits valid data
- **THEN** exactly one `register` mutation is sent with `email` and `password`

#### Scenario: Submit is blocked while the request runs
- **WHEN** a registration request is in progress
- **THEN** the registration button is disabled so the request cannot be sent twice

#### Scenario: Skeleton screen while the request runs
- **WHEN** a registration request is in progress
- **THEN** the form is shown as a skeleton screen, as defined in `docs/design.md` §7.9, with blocks in the shape of the two fields and the button

#### Scenario: Reduced motion
- **WHEN** the system «Reduce motion» setting is on and a registration request is in progress
- **THEN** the skeleton blocks are static

### Requirement: Registration form uses Signal Forms

The registration form SHALL use Signal Forms (`@angular/forms/signals`) on web, as on mobile.

#### Scenario: Form is built with Signal Forms
- **WHEN** the registration page is inspected
- **THEN** its form state is built with `@angular/forms/signals`

### Requirement: Registration errors

The registration page SHALL show the translated message for each error case, and keep the values the user typed.

#### Scenario: Email already registered
- **WHEN** the API returns the stable error code for a registered email
- **THEN** the page shows the text of `login.register.errorEmailTaken`

#### Scenario: Network failure
- **WHEN** the request fails because there is no network connection
- **THEN** the page shows the text of `login.common.errorNetwork`

#### Scenario: Values are kept after an error
- **WHEN** registration fails
- **THEN** both fields keep the values the user typed

### Requirement: Sign-in after registration

After a successful `register` mutation, the client SHALL sign the user in with the same email and password, through `POST /api/auth/login`, exactly as the sign-in page does. Then the user is taken to `/`.

#### Scenario: Automatic sign-in after registration
- **WHEN** the `register` mutation succeeds
- **THEN** the client sends one `POST /api/auth/login` with the same email and password, and then the user is taken to `/`

#### Scenario: Sign-in after registration fails
- **WHEN** the automatic sign-in fails after a successful registration
- **THEN** the user is taken to the sign-in page, and the sign-in page shows the text of `login.signIn.errorInvalidCredentials`

#### Scenario: Network failure during the sign-in after registration
- **WHEN** the request fails because there is no network connection during the automatic sign-in
- **THEN** the user is taken to the sign-in page, which shows the text of `login.register.errorSignInAfterRegister`: `en` "Your account was created, but we could not sign you in. Sign in again.", `es` "Tu cuenta se ha creado, pero no hemos podido iniciar sesión. Inicia sesión de nuevo."

### Requirement: Language selection

The web app SHALL start in the browser language when it is `en` or `es`, and in `en` otherwise.

#### Scenario: Browser language is Spanish
- **WHEN** the browser language is `es`
- **THEN** the registration page shows the `es` texts

#### Scenario: Browser language is not supported
- **WHEN** the browser language is `fr`
- **THEN** the registration page shows the `en` texts

### Requirement: Accessibility

Every interactive element on the registration page SHALL have a role and an accessible name, and the tests SHALL query elements by role.

#### Scenario: Interactive elements have roles
- **WHEN** the registration page is inspected
- **THEN** each field, the registration button, the switcher and the link back to sign-in have a role and an accessible name
