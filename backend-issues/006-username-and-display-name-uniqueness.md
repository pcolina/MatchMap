# Issue 006: Make username and display name unique, with a number when the default is taken

## Context

The `add-login-page` proposal (`openspec/changes/add-login-page/proposal.md`) sets the rules for the defaults of `username` and `displayName` at registration. The default value is the part of the email before the `@`. Friend search depends on `username`, so two accounts never share a `username`. `displayName` is also unique.

The API has no availability check today. A duplicate `username` currently comes back as `email taken`, which is wrong.

## What the backend must do

- Check that `username` and `displayName` are unique when registering.
- When the default `username` or `displayName` is already taken, add a number to the end of it, until a free value is found.
- Keep the length limits: 30 characters for `username` and 50 for `displayName`.
- Return a stable error code when the user sends a value that is taken and the client did not use the default. The code is not `email taken`.

The client does not check availability. It sends the values as the user typed them.

## Open questions for the backend

- The format of the number, for example `marta2` or `marta-2`. The proposal does not say.
- Whether the number is added to `displayName` and `username` in the same way.
- The error code when the user types a taken `username` or `displayName` by hand.

## Acceptance

- Registering with a default `username` that is taken creates the account with a number added.
- Registering with a `username` typed by the user that is taken is rejected with the stable error code.
- Two accounts never share a `username`.
