# Proposal: fix-sign-in-failure-position

## Why

On sign-in, the general failure message (`login.common.errorUnknown`, "Something went wrong. Try again.", and the other failures that use the same alert) is shown in a single line that sits directly above the Sign in button. It is far from the fields the user has to fix, and close to the button. On the laptop web layout and on the web layout at phone width, the message is hard to connect with the input that caused it, and it reads as part of the button rather than as a result of the form.

## What Changes

- **Position:** the sign-in failure message is shown directly below the password field, closer to the password input than to the Sign in button. The gap between the password field and the message is smaller than the gap between the message and the Sign in button. The exact spacing tokens are chosen in `design.md` from the scale in `docs/design.md` §4.
- **Both layouts:** the same position on web (laptop and laptop at phone width) and on mobile, as one spec, because the phone-sized web app and the mobile app share one behaviour (`CLAUDE.md` §1 and §6).
- **Reserved space:** the space for the failure message stays reserved, so showing or hiding it does not move other elements (existing rule in `client-sign-in`, "Field errors").
- **Copy and behaviour:** no change. The same keys and the same rules decide which failure is shown: `login.signIn.errorInvalidCredentials`, `login.signIn.errorTooManyAttempts`, `login.common.errorNetwork` and `login.common.errorUnknown`. Field messages for `invalid_email` and `invalid_password` are not affected.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `client-sign-in`: the position of the sign-in failure message on the sign-in page.

## Impact

- **Code:** `apps/web/src/app/features/auth/pages/sign-in/` (template and CSS) and `apps/mobile/src/app/features/auth/pages/sign-in/sign-in.page.ts` (layout). No store or data-access change.
- **APIs:** none.
- **Dependencies:** none new.

## Out of scope

- The copy of any failure message.
- The field error messages (`email-error`, `password-error`) and the client-side validation rules.
- The registration page.
- Contrast of the input borders (issue `matchMap` #5) and dark mode (issue `matchMap` #7).

## Depends on

- **Spec `client-sign-in`** in `openspec/specs/client-sign-in/`.
- **Change `add-login-input-errors`** (archived 2026-11-14), which put the field messages next to their fields and left the general failure message unchanged.

## Open questions

None.
