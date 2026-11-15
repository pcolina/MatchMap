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

The same change applies to the mobile form. Its gap was 0 and becomes `space[5]` (20 px). The top padding of its content container goes from `space[4]` (16 px) to `space[0]` (0), which removes the 16 px above the form. The mobile header keeps its own 16 px padding, because it has no 64 px bottom padding to reduce.

## Label and button spacing update

Requested after review, on both platforms:

- Each label sits 4 px closer to its input: the label bottom margin is `-space-1` on web and mobile.
- The space between the password field and the Sign in button grows by about half. The scale has no exact 50% step, so the change uses the nearest tokens. Web: the button top margin goes from about −9 px to `-space-1` (−4 px), so the effective space goes from 11 px to 16 px (about +45%). Mobile: the button top margin goes from `space-4` (16 px) to `space-8` (32 px), so the effective space with the 20 px form gap goes from 36 px to 52 px (about +44%).

## Tests

Each test is written first and must fail before the change (`CLAUDE.md` §2, TDD).

- Web, `sign-in.page.spec.ts`: the element with `role="alert"` is inside the password `.field` div and comes after `#password-error`; the Sign in button comes after it.
- Web, `sign-in.page.spec.ts`: keep the existing "reserves the error space" test passing, and add an assertion that the failure element keeps its min-height in the computed style where the test environment supports it; otherwise assert the element is always rendered.
- Mobile, `sign-in.page.test.ts`: the `failure` testID is rendered after `password-error` and before the submit button in the render order.
- Existing message tests (`Something went wrong. Try again.`, `Email or password is incorrect.`, network and too-many-attempts) keep passing unchanged.

## Risks

- On mobile the password field group is a flex stack with its own styling. The move must keep the message full width and aligned with the field, not with the icon. Checked visually at phone width in the mobile app.
- On web, the `top: -10px` offsets on `form` and on the submit button are untouched; the message moves with the password group, so the existing offsets keep applying to the button only.

## Second label and button spacing update

Requested again after review, on both platforms:

- Labels move 8 px closer to their input: the label bottom margin is `-space-2` (was `-space-1`).
- The space between the password field and the Sign in button grows again. Web: the button top margin goes from `-space-1` to `0`, so the effective space is the form gap, 20 px (was 16 px). Mobile: the button top margin goes from `space-8` to `space-10` (40 px), so the effective space is 60 px (was 52 px).

## Focus ring and error spacing update (web)

The focus style from `docs/design.md` §Focus is a 3 px accent ring with a 2 px offset, plus a halo that fades out up to 16 px beyond the input. A field error placed right under a focused input would sit inside that ring and halo.

- The email and password error lines get a top margin of `space-6` (24 px), which clears the ring (5 px) and the halo (16 px spread). The margin is set by id, so the failure message below the password error does not get it.
- The space between the password field and the Sign in button grows from the form gap plus 0 to the form gap plus `space-2` (8 px) on web.
- The gap between the email field and the password field grows with the email error margin, so it does not need its own change.

The mobile app has no halo, so this change is web-only for now.

## Error closeness update (web)

Requested after review: the error messages should sit closer to their input than the 24 px above, but not touch it as before. The email and password error lines now have a top margin of `space-4` (16 px). That is outside the focus ring (5 px) and most of the halo's visible part, and it is still closer than the previous 24 px.
