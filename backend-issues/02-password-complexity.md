# Issue 2: Enforce password complexity

## Context

The `add-login-page` proposal (`openspec/changes/add-login-page/proposal.md`) sets the password rule for registration. The API does not enforce it today. `CLAUDE.md` §7 requires the API to enforce every data rule that the clients check.

## Rule

- Length: 6 to 20 characters.
- At least one lowercase letter.
- At least one uppercase letter.
- At least one special character.

## What the backend must do

- The register mutation `register(input: RegisterInput!): User!` (`contracts/graphql/account.graphqls`) rejects a password that does not meet the rule.
- The rejection uses a stable error code. The client maps it to a message (see Issue 4).
- The rule is documented in the contract, so the clients can copy it.

## Open questions for the backend

- The exact set of characters that counts as a special character.
- Whether the login endpoint validates the rule too, or only registration does.

## Acceptance

- A password with 5 or 21 characters is rejected.
- A password without a lowercase letter, without an uppercase letter or without a special character is rejected.
- A password that meets all the rules is accepted.
