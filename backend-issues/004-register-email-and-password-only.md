# Issue 004: Register with email and password only, and drop displayName

## Context

The `add-registration-page` change (`openspec/changes/add-registration-page/`) asks the user only for an email and a password. The client does not send `username` or `displayName`. The backend creates the username by default, from rules that the backend owns, so the client does not need to know them.

The current contract (`matchmap-api/contracts/graphql/account.graphqls`) does not match this:

- `RegisterInput` requires `email`, `username`, `displayName` and `password`.
- `User` has a `displayName` field.

This issue changes the contract and the backend to match the client. It supersedes `007-generate-username-from-email.md` and the `displayName` parts of `006-username-and-display-name-uniqueness.md`.

## What the backend must do

- `RegisterInput` contains only `email` and `password`, both required.
- `displayName` is removed from `RegisterInput` and from the `User` type, in `contracts/graphql/account.graphqls`, and from the backend.
- The backend generates `username` when the account is created, from the part of the email before the `@`. The exact rules (allowed characters, normalisation, length limit of 30) are the backend's to define and must be documented in the contract.
- If the generated `username` is taken, the backend adds a number until it finds a free value. Two accounts never share a `username`.
- The email is unique. A taken email returns `EMAIL_TAKEN`.
- The contract documents the error codes that `register` can return: `EMAIL_TAKEN` and `VALIDATION_FAILED` (with the field name for the password). Document the codes in the contract, not only in the code.
- The password rule (6 to 20 characters, one lowercase, one uppercase, one special character) is enforced by the backend, as `005-password-complexity.md` describes.

## Open questions for the backend

- The rules for generating `username` from the email prefix, and the format of the number added when it is taken.
- Whether `VALIDATION_FAILED` for the password should carry a more specific code, for example `PASSWORD_INVALID`. The client needs a stable code to show its own message.

## Acceptance

- `RegisterInput` has exactly `email` and `password`. A request that sends `displayName` is rejected or ignored, as the contract states.
- The `User` type has no `displayName` field.
- Registering with `email` = `marta.lopez@example.com` creates an account with a generated `username` that is unique.
- Registering with an email that is already used returns `EMAIL_TAKEN`.
- Registering with a password that breaks the rule returns the documented code.
