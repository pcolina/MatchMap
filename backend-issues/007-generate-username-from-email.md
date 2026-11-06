# Issue 007: Generate username and display name from the email at registration

## Context

The `add-login-page` change (`openspec/changes/add-login-page/`) decided that the registration form asks only for the email and the password. The username and the display name are not shown on the form and the client does not send them. The backend generates both from the part of the email before the `@`.

This replaces the earlier rule, in which the client prefilled and sent both values. The uniqueness and number rules of Issue 006 apply to the generated values.

## What the backend must do

- The register mutation `register(input: RegisterInput!): User!` (`contracts/graphql/account.graphqls`) accepts a request with only `email` and `password`.
- When `username` is missing, the backend generates it from the part of the email before the `@`.
- When `displayName` is missing, the backend generates it from the same part of the email before the `@`.
- Both generated values are unique. If a value is taken, the backend adds a number, as Issue 006 describes.
- The generated values keep the limits: 30 characters for `username` and 50 for `displayName`.
- The contract documents this behaviour, so the client can rely on it.

## Open questions for the backend

- Whether the backend normalises the email prefix, for example by removing characters that are not allowed in a username.
- How a `username` or `displayName` sent by the client is handled, if a client ever sends one. The web and mobile clients for this change do not send them.

## Acceptance

- Registering with `email` = `marta.lopez@example.com` and no `username` or `displayName` creates the account with `username` = `marta.lopez` and `displayName` = `marta.lopez`, or with a number added if either is taken.
- No two accounts share a `username`.
