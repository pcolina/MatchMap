# Issue 003: Return stable error codes for sign-in and registration

## Context

The `add-login-page` proposal (`openspec/changes/add-login-page/proposal.md`) shows three error messages to the user, in `en` and `es`:

- Wrong credentials, key `login.signIn.errorInvalidCredentials`.
- Email already registered, key `login.register.errorEmailTaken`.
- Network failure, key `login.common.errorNetwork`. This one is on the client, not the API.

The client maps an error code from the API to a translation key. The API does not return stable codes for these cases today. Duplicate `username` also comes back as `email taken`.

## What the backend must do

- Sign-in with a wrong email or password returns a stable error code for invalid credentials.
- Registration with an email that already exists returns a stable error code for a taken email.
- Registration with a `username` or `displayName` that is taken returns its own stable code (see Issue 006).
- Registration with a password that breaks the complexity rule returns its own stable code (see Issue 005).
- The codes are documented in `contracts/openapi/auth.yaml` and `contracts/graphql/account.graphqls`.

## Open questions for the backend

- The format of the error codes. The contracts may already define one.
- Whether sign-in returns the same code for an unknown email and for a wrong password. This is a security choice, and the proposal does not decide it.

## Acceptance

- Each case above returns its own code, and the codes are in the contract.
- A wrong password and an unknown email return the same code, if the backend decides that.
