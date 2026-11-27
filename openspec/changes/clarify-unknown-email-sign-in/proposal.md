# Proposal: clarify-unknown-email-sign-in

Companion change in the API repository: `matchmap-api`, change `clarify-unknown-email-sign-in`, commit `207ecc4` on branch `clarify-unknown-email-sign-in`. That change decided that the API does not change. The clients explain the registration failure they already receive.

No GitHub issue is linked. The repository owner opened this change directly.

## Why

When someone tries to register with an email that is already in use, the API returns `EMAIL_TAKEN`, and the registration page shows a generic "already exists" message with no path to sign in.

The API keeps its sign-in responses unchanged on purpose, so that sign-in does not reveal which emails exist. The sign-in page keeps its current message for `invalid_credentials`. This change only clarifies the registration failure.

## What Changes

- **Sign-in page: no change.** After `invalid_credentials` the page keeps `login.signIn.errorInvalidCredentials` ("Email or password is incorrect." / "El email o la contraseña no son correctos."). The sign-in page already links to registration through `login.signIn.goToRegister`, so no new hint or button is added.
- **Registration with a taken email.** When `register` returns `EMAIL_TAKEN`, the registration page shows "Ya tienes una cuenta con este email" (`en`: "You already have an account with this email.") in place of `login.register.errorEmailTaken`, and uses the existing link to sign in, `login.register.goToSignIn` ("¿Ya tienes cuenta? Iniciar sesión" / "Already have an account? Sign in").
- **Mobile.** The same registration behaviour and wording in the mobile app, through the same i18n keys in `packages/shared`.
- No API, contract, schema or dependency change.

The English text above is a proposed translation and is part of the review: the PR lists it under "Translations to review".

## Capabilities

### Modified Capabilities

- `client-registration`: the "Email already registered" scenario changes its message and shows a link to sign in.

`client-sign-in` is not modified.

## Out of scope

- Any API, GraphQL or OpenAPI change. The API change `clarify-unknown-email-sign-in` in `matchmap-api` keeps the responses as they are.
- A distinct error for unknown emails. Rejected in the API change because it reveals which emails exist.
- The "already registered" email sent to the owner, and the registration response that hides whether an email exists. They belong to issue #26 (email verification).
- Password recovery. It needs email delivery and is a separate change.
- Changes to the login throttle and to `too_many_attempts`.

## Depends on

- `client-sign-in` (`openspec/specs/client-sign-in`): "Sign-in errors" and its messages table, unchanged.
- `client-registration` (`openspec/specs/client-registration`): "Registration errors" and "Navigation between sign-in and registration".
- `matchmap-api` authentication (`openspec/specs/authentication`): "Sign-in failures do not reveal which accounts exist". Unchanged.
- `matchmap-api` user accounts (`openspec/specs/user-accounts`): `EMAIL_TAKEN`. Unchanged.
