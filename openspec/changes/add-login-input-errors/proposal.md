# Proposal: add-login-input-errors

## Why

The API rejects a login request whose email or password breaks its input limits, and it returns a machine error code, not a text. The sign-in form has no message for those codes, so a rejected request shows nothing useful. GitHub issue `matchMap` #1 asks for one i18n key per code, on web and on mobile.

## What Changes

- **Error codes:** the login response `error` field may be `invalid_email`, `email_too_long` or `invalid_password`, with HTTP status 400. `invalid_email` and `invalid_password` are already in `matchmap-api` `contracts/openapi/auth.yaml` (change `enforce-login-limits`, merged). `email_too_long` is a new code for an email longer than 254 characters; it is added to the API in `matchmap-api` issue #27, a separate change that must merge before this one. This change does not change the contract.
- **New keys:** two keys in `packages/shared/i18n/en.json` and `es.json`, one per code:
  - `login.signIn.errorInvalidEmail`: `en` "Enter a valid email address.", `es` "Introduce un email válido."
  - `login.signIn.errorInvalidPassword`: `en` "Password must be 6 to 20 characters.", `es` "La contraseña debe tener entre 6 y 20 caracteres."
  The texts are the same as the existing `login.signIn.errorEmailFormat` and `login.signIn.errorPasswordLength`, which stay in place for the client-side validation.
- **Length code:** `email_too_long` uses the existing key `login.signIn.errorEmailTooLong` ("Email must be at most 254 characters." / "El email debe tener como máximo 254 caracteres."). No new copy.
- **Mapping:** the sign-in form maps the `error` value `invalid_email` to `login.signIn.errorInvalidEmail`, `email_too_long` to `login.signIn.errorEmailTooLong` and `invalid_password` to `login.signIn.errorInvalidPassword`, and shows the text next to the matching field (`email-error` or `password-error`).
- **Web and mobile:** the same mapping in both apps, in their `data/auth.api.ts` and sign-in store. One change, one spec, as `CLAUDE.md` §6 requires.
- **Client validation:** unchanged. The API check is an extra layer.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `client-sign-in`: the sign-in page shows the message for the `invalid_email` and `invalid_password` codes next to the matching field.

## Impact

- **Code:** `packages/shared` (two keys in each catalogue), `apps/web` and `apps/mobile` (the sign-in data access and store mapping, and the sign-in page message).
- **APIs:** consumes the `invalid_email` and `invalid_password` codes of `POST /api/auth/login`. No change to `matchmap-api`.
- **Dependencies:** none new.

## Out of scope

- The registration form. Its codes (`EMAIL_TAKEN`, `PASSWORD_INVALID`) are specified in `client-registration`.
- Changing the client-side validation rules or the existing copy.
- The mobile runtime wiring of Apollo and the API base URL (issue `matchMap` #3).
- The contrast of the input borders (issue `matchMap` #5) and dark mode (issue `matchMap` #7).

## Depends on

- **Spec `client-sign-in`** in `openspec/specs/client-sign-in/`.
- **API change `enforce-login-limits`** in `matchmap-api`, merged in PR #19, which defines `invalid_email`, `invalid_password` and status 400.
- **API change for `email_too_long`** in `matchmap-api` issue #27. It must be merged before this change is implemented.

## Open questions

None.
