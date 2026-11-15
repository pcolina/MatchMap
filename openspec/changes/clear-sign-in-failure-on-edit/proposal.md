# Proposal: clear-sign-in-failure-on-edit

## Why

After a failed sign-in, the sign-in failure message stays on the page while the user edits the email or the password. If the user then types a value that breaks the client rules (for example a password shorter than 6 characters), two messages show at the same time: the old failure ("Email or password is incorrect.") and the new field error ("Password must be 6 to 20 characters."). The page looks broken, and the old failure no longer describes what the user is doing.

The store clears the failure only when the form is submitted or the session is closed, not when a field changes.

## What Changes

- When the user changes the email or the password after a sign-in failure, the sign-in failure message is hidden. Its reserved space stays, so the layout does not move.
- The typed email and password are kept, as the spec already requires.
- Field error messages (client validation) are not changed: they still show when a field is invalid and touched.
- The failure message is shown again only after a new submit that fails.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `client-sign-in`: the sign-in failure message is cleared when the user edits the email or the password.

## Impact

- **Web:** `apps/web/src/app/features/auth/state/auth.store.ts` (clear the failure on field change) and the sign-in page.
- **Mobile:** the same behaviour in `apps/mobile` (phone-sized behaviour is shared with the web app, as `CLAUDE.md` §1 requires).
- **APIs:** none.
- **Dependencies:** none new.

## Out of scope

- The wording of any message.
- Field validation rules.
- The registration page, which has its own failure handling.

## Depends on

- **Spec `client-sign-in`** in `openspec/specs/client-sign-in/`, requirement "Sign-in errors".

## Open questions

- Should the failure message also clear when the user submits again with empty fields? Proposed: yes, because the submit path already clears it before the request.
