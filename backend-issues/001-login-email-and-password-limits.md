# Issue 001: Enforce email and password limits on login

## Context

The `add-login-page` change (`openspec/changes/add-login-page/specs/client-sign-in/spec.md`) validates the sign-in form before it sends the request: the email must not be empty, must be in standard email format and must be at most 254 characters, and the password must be 6 to 20 characters. The client shows the error on the field and sends nothing.

`CLAUDE.md` §7 requires the API to enforce every data rule that the clients check. The `LoginRequest` schema in `contracts/openapi/auth.yaml` declared no limits, so this issue adds them to the contract and asks the backend to enforce them.

The complexity rules of the password (uppercase, lowercase, special character) are not part of login. They apply only to registration, as `005-password-complexity.md` describes.

## What the backend must do

- `LoginRequest` in `contracts/openapi/auth.yaml` declares, for `email`: `format: email`, `minLength: 1`, `maxLength: 254`; and for `password`: `minLength: 6`, `maxLength: 20`. The contract change is already made; the backend implements it.
- `POST /api/auth/login` rejects a request whose `email` or `password` breaks these limits, before it looks up the account.
- The rejection uses a documented error response. The client validates the same limits first, so this response is a safety net for other clients.
- The login endpoint does not apply the password complexity rules. A password of 6 to 20 characters without an uppercase letter or a special character is accepted at login and checked by the normal credentials flow.

## Open questions for the backend

- The status code and the error code for a login request that breaks a limit. The contract does not define one yet.
- Whether `email` must be trimmed and lower-cased on the server. The client does both before sending, so the server only needs to match what the client sends.

## Acceptance

- A login with an empty email is rejected.
- A login with an email of 255 characters is rejected.
- A login with an email that is not in standard email format is rejected.
- A login with a password of 5 or 21 characters is rejected.
- A login with a password of 6 to 20 characters that has no uppercase letter is not rejected for that reason.
- `contracts/openapi/auth.yaml` shows the limits above, and the generated types in the client match them.
