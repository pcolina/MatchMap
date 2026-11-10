# Proposal: add-registration-page

## Why

A user who cannot create an account cannot sign in, so the registration page is needed before any feature can be used. This change adds the registration page to the web app and to the app on phone-sized screens. It reuses the shared code of `add-login-page`: the validation rules, the skeleton screen, the language switcher, the auth store, the token handling and the main route.

## What Changes

- **Registration page:** an email field, a password field, one primary button to create the account, and a link back to the sign-in page (`/login`).
- **Layout:** the same as the sign-in page. The content is centred on the screen, both horizontally and vertically, in portrait and landscape. The language switcher is in the top-right corner, as defined in `add-login-page`.
- **Registration call:** the GraphQL mutation `register(input: RegisterInput!): User!` (`contracts/graphql/account.graphqls` in `matchmap-api`), through an operation in `packages/shared`. The `RegisterInput` contains only `email` and `password`.
- **Sign-in after registration:** after a successful `register`, the client signs the user in with the same email and password through `POST /api/auth/login`, and then takes the user to `/`. Email confirmation is not part of this change.
- **Validation:** the email and password rules from `add-login-page`, in `packages/shared`. The client validates the same rules as the API.
- **Error messages:** `login.register.errorEmailTaken`, `login.register.errorPasswordInvalid` and `login.register.errorSignInAfterRegister`, and the network message `login.common.errorNetwork` from `add-login-page`. The approved copy is listed below.
- **Copy:** every user-facing string is a translation key with `es` and `en` values, in `packages/shared/i18n/`. The approved copy is listed below.
  - Registration title, `login.register.title`: `en` "Create account", `es` "Crear cuenta".
  - Email field, `login.register.emailLabel`: `en` "Email", `es` "Email".
  - Password field, `login.register.passwordLabel`: `en` "Password", `es` "Contraseña".
  - Registration button, `login.register.submit`: `en` "Create account", `es` "Crear cuenta".
  - Link back to sign-in, `login.register.goToSignIn`: `en` "Already have an account? Sign in", `es` "¿Ya tienes cuenta? Iniciar sesión".
  - Email already registered, `login.register.errorEmailTaken`: `en` "An account with this email already exists.", `es` "Ya existe una cuenta con este email."
  - Invalid password, `login.register.errorPasswordInvalid`: `en` "Use 6 to 20 characters, with a lowercase letter, an uppercase letter and a special character.", `es` "Usa de 6 a 20 caracteres, con una letra minúscula, una mayúscula y un carácter especial."
  - Sign-in after registration failed, `login.register.errorSignInAfterRegister`: `en` "Your account was created, but we could not sign you in. Sign in again.", `es` "Tu cuenta se ha creado, pero no hemos podido iniciar sesión. Inicia sesión de nuevo."
- **Form:** Signal Forms (`@angular/forms/signals`) on web and on mobile.

## Capabilities

### New Capabilities

- `client-registration`: the registration page, its fields and validation, its error states, the skeleton while the request runs, and the sign-in after a successful registration.

### Modified Capabilities

None.

The account rules (password complexity, error codes) belong to the API change `add-user-accounts` and are not specified here.

## Impact

- **Code:** `apps/web` and `apps/mobile` (registration page and its form, registration data access, the registration step of the auth store), `packages/shared` (the `register` operation, its generated types and the registration keys in the catalogues).
- **APIs:** the `register` mutation of the `matchmap-api` contract, consumed and not changed here.
- **Dependencies:** none new. The dependencies are listed in `add-login-page`.
- **Systems:** none beyond the API.

## Out of scope

- The sign-in page, the language switcher, the main route and the token handling. They are in `add-login-page`.
- Email confirmation after registration. In a future change, the user is asked to confirm the email, and a page tells them that a confirmation email has been sent.
- Backend account logic (password complexity on the server, stable error codes). These are specified in the API change `add-user-accounts` and in GitHub issue `matchMap-api#10`, GitHub issue `matchMap-api#9` and GitHub issue `matchMap-api#13`.
- The tablet and laptop web layouts. The iPad and laptop specs are separate changes, written later.

## Depends on

- **Change `add-login-page`**, which must be archived before this change starts. This change reuses its validators, its skeleton, its language switcher, its auth store and its routes.
- **API change `add-user-accounts`** in the `matchmap-api` repository (status: in review). This change needs its `register` mutation to accept `email` and `password` only, to enforce the password rules, and to return the stable error codes listed in GitHub issue `matchMap-api#10` and GitHub issue `matchMap-api#9`. The contract change in GitHub issue `matchMap-api#13` is required before this change starts.

## Open questions

None. The copy and rules in the spec are approved.

Decided: the email rules (required, not blank, standard format, at most 254 characters, trimmed and lower-cased before storing) are declared in `contracts/graphql/account.graphqls`. The password is not checked against the email.
