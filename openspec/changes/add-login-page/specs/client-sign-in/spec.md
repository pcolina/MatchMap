# client-sign-in

## ADDED Requirements

### Requirement: Sign-in page layout

The sign-in page SHALL show a header with the MatchMap logo (the stacked lockup) and the tagline `login.brand.tagline` below it, on a gradient from the `accentSubtle` token to the `bg` token. The header SHALL take the space left over by the content, so it grows or shrinks with the screen height. The content SHALL be centred horizontally and SHALL stay at the bottom of the page, directly above the registration link, with a comfortable margin under the link, in portrait and landscape. The page SHALL NOT scroll vertically at the default text size on a phone-sized screen, unless the content does not fit in the available height. On mobile, the layout SHALL respect the safe area.

#### Scenario: Centred content on phone
- **WHEN** the sign-in page is shown on a phone in portrait or landscape
- **THEN** its content is centred horizontally and vertically

#### Scenario: Centred content on web
- **WHEN** the sign-in page is shown in a web browser on a phone-sized screen, in portrait or landscape
- **THEN** its content is centred horizontally and vertically

### Requirement: Language switcher

The sign-in page SHALL show a language switcher floating over the header, in the top-right corner, without taking a row of its own. It is a circle with the Tabler icon `language` centred inside it, and a small shadow (`elevation.card`). It has no behaviour in this change.

#### Scenario: Switcher is visible
- **WHEN** the sign-in page is shown
- **THEN** a circular button with the `languages` icon is visible in the top-right corner

#### Scenario: Switcher has an accessible name
- **WHEN** the switcher is inspected by an assistive technology
- **THEN** its accessible name is the text of the key `login.signIn.languageSwitcher`

#### Scenario: Switcher does nothing
- **WHEN** the user activates the switcher
- **THEN** the page does not change

### Requirement: Divider between sign-in and social buttons

The sign-in page SHALL show, between the sign-in button and the social sign-in buttons, a horizontal grey line (the `border` colour of `docs/design.md`) with the word of the key `login.signIn.or` centred on it. The word is decorative, so it is hidden from assistive technologies, and it is written in lower case as the line's label: `or` in English and `o` in Spanish.

#### Scenario: Divider is shown between the two groups

- **WHEN** the sign-in page is shown
- **THEN** a grey horizontal line with the text of `login.signIn.or` at its centre appears between the sign-in button and the social buttons, and the text is hidden from assistive technologies

### Requirement: Google button

The sign-in page SHALL show, below the sign-in button, three social sign-in buttons (Google, Facebook and Apple) with their brand icons. Each is marked `aria-disabled="true"` and stays focusable with the keyboard, so screen reader users hear that it is unavailable, and it has no behaviour in this change. Its title is the text of the key `login.signIn.googleComingSoon`.

#### Scenario: Google button is disabled
- **WHEN** the sign-in page is shown
- **THEN** the three social buttons are visible below the sign-in button, reachable with the keyboard, marked as unavailable, and show the text of `login.signIn.googleComingSoon` as their title

### Requirement: Sign-in fields and actions

The sign-in page SHALL show an email field (label `login.signIn.emailLabel`) with a user icon (`tablerUser`) inside it, a password field (label `login.signIn.passwordLabel`) with a lock icon (`tablerLock`) inside it, and an eye button on the right of the password field. The eye button shows the eye icon (`tablerEye`) while the password is visible and the eye-off icon (`tablerEyeOff`) while it is hidden; it toggles between hidden and visible text, and its accessible name is `login.signIn.showPassword` or `login.signIn.hidePassword` accordingly. One primary sign-in button (text `login.signIn.submit`) and a link to the registration page (text `login.signIn.goToRegister`) are also shown.

#### Scenario: Fields and actions are shown
- **WHEN** the sign-in page is shown
- **THEN** the email field, the password field, the sign-in button and the registration link are visible with their translated labels

#### Scenario: Registration link
- **WHEN** the user activates the registration link
- **THEN** the registration page is shown

### Requirement: Sign-in input validation

The sign-in form SHALL validate only these rules, before sending anything, and show the error on the field:

- Email: not empty, standard email format, at most 254 characters.
- Password: not empty, at least 6 and at most 20 characters.

The sign-in form SHALL NOT apply any other rule, such as the complexity rules of registration. The client SHALL trim the email and lower-case it before validating and sending it.

The API enforces the same limits on `POST /api/auth/login`, as GitHub issue `matchMap-api#7` requires, and `contracts/openapi/auth.yaml` declares them in `LoginRequest`.

The error messages are:

| Key | en | es |
|---|---|---|
| `login.signIn.errorEmailRequired` | Enter your email. | Introduce tu email. |
| `login.signIn.errorEmailFormat` | Enter a valid email address. | Introduce un email válido. |
| `login.signIn.errorEmailTooLong` | Email must be at most 254 characters. | El email debe tener como máximo 254 caracteres. |
| `login.signIn.errorPasswordRequired` | Enter your password. | Introduce tu contraseña. |
| `login.signIn.errorPasswordLength` | Password must be 6 to 20 characters. | La contraseña debe tener entre 6 y 20 caracteres. |

#### Scenario: Empty email
- **WHEN** the user submits an empty email, or one with only spaces
- **THEN** the email field shows `login.signIn.errorEmailRequired` and no request is sent

#### Scenario: Invalid email format
- **WHEN** the user submits an email that is not in standard email format
- **THEN** the email field shows `login.signIn.errorEmailFormat` and no request is sent

#### Scenario: Email longer than 254 characters
- **WHEN** the user submits an email longer than 254 characters
- **THEN** the email field shows `login.signIn.errorEmailTooLong` and no request is sent

#### Scenario: Empty password
- **WHEN** the user submits an empty password
- **THEN** the password field shows `login.signIn.errorPasswordRequired` and no request is sent

#### Scenario: Password length out of range
- **WHEN** the user submits a password shorter than 6 or longer than 20 characters
- **THEN** the password field shows `login.signIn.errorPasswordLength` and no request is sent

#### Scenario: Password without complexity is sent
- **WHEN** the user submits a password of 6 to 20 characters that has no uppercase letter or no special character
- **THEN** the request is sent

#### Scenario: Email is normalised before sending
- **WHEN** the user submits " User@Example.com " with spaces and capitals
- **THEN** the request sends "user@example.com"

### Requirement: Field errors

An invalid field SHALL show its border in `danger`, and its error message below the field in `caption` with the `danger` colour. The space for the error message under each field, and for the sign-in failure message, is always reserved, so showing or hiding a message SHALL NOT move any other element on the page.

#### Scenario: Error state on a field
- **WHEN** a field is invalid
- **THEN** its border is `danger` and its error message is shown below it in `caption` with the `danger` colour

### Requirement: Sign-in request

Sign-in SHALL call `POST /api/auth/login` through `data/*.api.ts`, and no other part of the app calls the API for sign-in.

#### Scenario: Request is sent once per submit
- **WHEN** the user submits valid credentials
- **THEN** exactly one request is sent to `POST /api/auth/login`

#### Scenario: Request identifies the web client
- **WHEN** the sign-in request is sent from the web app
- **THEN** it carries the header `X-Client: web`, and the browser sends and stores the cookies of the API response

#### Scenario: Request without a known client is rejected by the API
- **WHEN** the API answers `400 invalid_client`
- **THEN** the page shows the text of `login.common.errorUnknown`

#### Scenario: Submit is blocked while the request runs
- **WHEN** a sign-in request is in progress
- **THEN** the sign-in button is disabled so the request cannot be sent twice

#### Scenario: Skeleton screen while the request runs
- **WHEN** a sign-in request is in progress
- **THEN** the form is shown as a skeleton screen, as defined in `docs/design.md` §7.9, with blocks in the shape of the email field, the password field and the button

#### Scenario: Reduced motion
- **WHEN** the system «Reduce motion» setting is on and a sign-in request is in progress
- **THEN** the skeleton blocks are static

### Requirement: Token handling after sign-in

After a successful sign-in, the access token SHALL be kept in memory. On web, the refresh token is stored by the API in an `httpOnly` cookie. On mobile, the refresh token SHALL be stored in `expo-secure-store`.

#### Scenario: Access token is kept in memory
- **WHEN** sign-in succeeds
- **THEN** the access token is kept in memory and is not written to any storage

#### Scenario: Mobile refresh token is stored securely
- **WHEN** sign-in succeeds on mobile
- **THEN** the refresh token is stored in `expo-secure-store`

#### Scenario: Web refresh token is not readable by scripts
- **WHEN** sign-in succeeds on web
- **THEN** the refresh token is set by the API as an `httpOnly` cookie and is not stored by the app

### Requirement: Session restore

When the app starts, it SHALL try to restore the session with the refresh token, and a request rejected for an expired access token SHALL be retried once after a refresh.

#### Scenario: Refresh when the app starts
- **WHEN** the app starts
- **THEN** exactly one request is sent to `POST /api/auth/refresh`

#### Scenario: Successful refresh signs the user in
- **WHEN** the refresh request succeeds
- **THEN** the user is signed in with the new access token, which is kept in memory

#### Scenario: Rejected refresh shows the sign-in page
- **WHEN** the refresh request is rejected
- **THEN** the sign-in page is shown and the user is not signed in

#### Scenario: Expired access token is retried once
- **WHEN** a request is rejected because the access token has expired
- **THEN** the refresh request is sent once and the rejected request is repeated once with the new access token

#### Scenario: Retry fails again
- **WHEN** the repeated request is rejected again
- **THEN** the user is signed out and the sign-in page is shown

#### Scenario: Route guard without a session
- **WHEN** the user opens `/` without a session
- **THEN** the user is redirected to `/login`

### Requirement: Redirect after sign-in

After a successful sign-in, the user SHALL be taken to the main route at `/`.

#### Scenario: Redirect to the main route
- **WHEN** sign-in succeeds
- **THEN** the user is taken to `/`, which is lazy-loaded and uses the main layout

### Requirement: Sign-in errors

The sign-in page SHALL show the translated message for each error case, and keep the values the user typed.

#### Scenario: Wrong credentials
- **WHEN** the API returns the stable error code for invalid credentials
- **THEN** the page shows the text of `login.signIn.errorInvalidCredentials`

#### Scenario: Network failure
- **WHEN** the request fails because there is no network connection
- **THEN** the page shows the text of `login.common.errorNetwork`

#### Scenario: Too many attempts
- **WHEN** the API returns the stable error code for too many attempts
- **THEN** the page shows the text of `login.signIn.errorTooManyAttempts`

#### Scenario: Unknown failure
- **WHEN** the request fails for any other reason
- **THEN** the page shows the text of `login.common.errorUnknown`

The messages are:

| Key | en | es |
|---|---|---|
| `login.signIn.errorInvalidCredentials` | Email or password is incorrect. | El email o la contraseña no son correctos. |
| `login.signIn.errorTooManyAttempts` | Too many attempts. Wait a few minutes and try again. | Demasiados intentos. Espera unos minutos e inténtalo de nuevo. |
| `login.common.errorNetwork` | No connection. Check your network and try again. | Sin conexión. Revisa tu red e inténtalo de nuevo. |
| `login.common.errorUnknown` | Something went wrong. Try again. | Algo ha salido mal. Inténtalo de nuevo. |

#### Scenario: Values are kept after an error
- **WHEN** sign-in fails
- **THEN** the email and password fields keep the values the user typed

### Requirement: Language selection

The web app SHALL start in the browser language when it is `en` or `es`, and in `en` otherwise. The mobile app SHALL work in `en` and `es`.

#### Scenario: Browser language is Spanish
- **WHEN** the browser language is `es`
- **THEN** the sign-in page shows the `es` texts

#### Scenario: Browser language is not supported
- **WHEN** the browser language is `fr`
- **THEN** the sign-in page shows the `en` texts

### Requirement: Session restore

When the app starts, the client SHALL ask the API for a new access token through `POST /api/auth/refresh`. On web the browser sends the refresh token from its `httpOnly` cookie. On mobile the client reads the refresh token from `expo-secure-store` and sends it in the request body. If the API accepts the request, the user is signed in with the new access token, which is kept in memory. If the API rejects it, the user is signed out and the sign-in page is shown.

#### Scenario: Session restored on start
- **WHEN** the app starts and the refresh request succeeds
- **THEN** the user is signed in, the new access token is kept in memory and the main route `/` is shown

#### Scenario: No session on start
- **WHEN** the app starts and the refresh request is rejected
- **THEN** the sign-in page is shown

#### Scenario: Main route without a session
- **WHEN** the user opens `/` and there is no session
- **THEN** the user is redirected to `/login`

#### Scenario: Retry once after an expired access token
- **WHEN** an API request is rejected because the access token has expired
- **THEN** the client refreshes the access token once and repeats the request

#### Scenario: Signed out when the retry fails
- **WHEN** the repeated request is rejected again, or the refresh is rejected
- **THEN** the user is signed out and the sign-in page is shown

### Requirement: Accessibility

Every interactive element on the sign-in page SHALL have a role and an accessible name, and the tests SHALL query elements by role.

#### Scenario: Interactive elements have roles
- **WHEN** the sign-in page is inspected
- **THEN** the email field, the password field, the sign-in button, the registration link, the switcher and the Google button each have a role and an accessible name
