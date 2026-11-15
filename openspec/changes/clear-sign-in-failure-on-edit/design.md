# Design: clear-sign-in-failure-on-edit

## Context

Two behaviours change, and both are in the approved specs (`specs/client-sign-in/spec.md`):

1. The sign-in failure message is hidden when the user edits the email or the password.
2. The failure message sits centred between the password input and the Sign in button, with equal space above and below it, and the total space between the input and the button does not grow.

The measurements below are from the current CSS, worked out by hand. They are not from a visual check.

## Current spacing

**Web** (input bottom → button top, 64 px of spacing around a 20 px message line):

- Above the message: `#password-error` top margin 5 px, its reserved line 20 px (`max(caption line height, icon-md)`), its bottom margin 11 px (`space-4 - 5px`). Total **36 px**.
- Below the message: form gap `space-5` 20 px, button top margin `space-2` 8 px. Total **28 px**.

**Mobile** (input bottom → button top):

- Above the message: email/password error row offset 5 px, line 20 px, offset -5 px, failure row top margin 5 px. Total **25 px**.
- Below the message: failure row bottom margin -5 px, form gap `space-5` 20 px, button top margin `space-10` 40 px. Total **55 px**. (The mobile button margin was 40 px after the last spacing round.)

Totals with the message line: web 36 + 20 + 28 = 84; mobile 25 + 20 + 55 = 100. Both must stay the same, so the centred position is 32 px each side on web and 40 px each side on mobile.

## Decisions

### Web

- The failure message gets a top margin of `calc(-1 * var(--mm-space-1))` (-4 px). Above becomes 36 - 4 = **32 px**.
- The Sign in button top margin goes from `var(--mm-space-2)` (8 px) to `var(--mm-space-3)` (12 px). Below becomes 20 + 12 = **32 px**.
- Total unchanged: 32 + 20 + 32 = 84.

### Mobile

- The failure row's top margin goes from 5 px to `space[5]` (20 px). Above becomes 5 - 5 + 20 + 20 = **40 px**.
- The failure row's bottom margin goes from -5 px to `-space[5]` (-20 px). Below becomes -20 + 20 + 40 = **40 px**, with the button top margin unchanged at `space[10]` (40 px).
- Total unchanged: 40 + 20 + 40 = 100.

## Tests (TDD, to be written first)

- Web: the failure element has computed `margin-top` `calc(-1 * var(--mm-space-1))`, and the submit button has `margin-top` `var(--mm-space-3)`.
- Web: the sum of the computed values above and below the message is unchanged (84 px) when measured from the stylesheet.
- Mobile: the failure row has `marginTop` `space[4]` and `marginBottom` `-space[4]`.
- Clear on edit (web and mobile): after a failure, changing the email or the password hides the failure text, keeps the typed values, and the reserved row stays.
- Clear before empty submit (web and mobile): a submit with empty fields hides the failure before the field errors, and sends no request.

## Open questions

None. Every value above is a token from the existing scale, and the totals are unchanged on both platforms.
