# Design: fix-sign-in-failure-position

## Context

The sign-in failure message (`role="alert"`) is a sibling of the password field group in both apps. The form stacks its children with a uniform gap (web: `form { gap: var(--mm-space-4) }`, 16 px). So the message sits 16 px below the password field group and 16 px above the Sign in button, which reads as belonging to the button. Spec `client-sign-in` › "Sign-in failure position" requires the message to sit closer to the password field than to the button.

## Decisions

- **Move the failure element into the password field group.** On web, the `<p class="error" data-error role="alert">` moves from the form's direct children into the password `.field` div, placed after `#password-error`. On mobile, the `testID="failure"` text moves from the form stack into the password field group, placed after `testID="password-error"`. The group has no internal gap, so the message sits directly under the password error line, which is the closest point to the input, and the 16 px form gap stays between the message and the Sign in button.
- **Keep the reserved space.** The failure element keeps its `min-height` (caption line height), so showing or hiding it does not move the button or the social buttons (spec "Field errors").
- **No new tokens.** Spacing comes from the existing form gap (`--mm-space-4` on web, the matching space token on mobile). No new size, colour or copy is introduced.
- **Keep the element and its semantics.** It keeps `role="alert"` (web) and `accessibilityRole="alert"` (mobile). Its i18n keys and the mapping in `failureMessage()` are unchanged.
- **Same layout on both apps.** The DOM order is the same on web and mobile, as the spec requires.

## Spacing update (web)

After the failure message moved under the password field, the form felt cramped. The user asked for wider spacing between the form components, paid for with space above the form:

- The form `gap` goes from `--mm-space-4` (16 px) to `--mm-space-5` (20 px).
- The bottom padding of the header (`.hero`) goes from `--mm-space-16` (64 px) to `--mm-space-12` (48 px), so the form gains room below and loses 16 px above it.

The mobile form has no gap today; its spacing is not changed here and needs its own decision.

## Tests

Each test is written first and must fail before the change (`CLAUDE.md` §2, TDD).

- Web, `sign-in.page.spec.ts`: the element with `role="alert"` is inside the password `.field` div and comes after `#password-error`; the Sign in button comes after it.
- Web, `sign-in.page.spec.ts`: keep the existing "reserves the error space" test passing, and add an assertion that the failure element keeps its min-height in the computed style where the test environment supports it; otherwise assert the element is always rendered.
- Mobile, `sign-in.page.test.ts`: the `failure` testID is rendered after `password-error` and before the submit button in the render order.
- Existing message tests (`Something went wrong. Try again.`, `Email or password is incorrect.`, network and too-many-attempts) keep passing unchanged.

## Risks

- On mobile the password field group is a flex stack with its own styling. The move must keep the message full width and aligned with the field, not with the icon. Checked visually at phone width in the mobile app.
- On web, the `top: -10px` offsets on `form` and on the submit button are untouched; the message moves with the password group, so the existing offsets keep applying to the button only.
