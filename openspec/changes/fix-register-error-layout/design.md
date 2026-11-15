# Design: fix-register-error-layout

## Context

The approved spec (`specs/client-registration/spec.md`) asks for three things: each field error reserves two lines and shows a red alert icon, the general failure message sits below the `Create account` button with its space reserved, and the form scrolls so that the message is visible. The sign-in page already has the icon and the reserved space; the same values are reused here.

The measurements below come from the current CSS and template. They are not from a visual check.

## Current state (web)

- `register.page.html`: the field errors are `<p class="error">` inside each `.field`. The general failure `<p role="alert">` sits before the submit button, not after it. There is a stray duplicate `</p>` after the email error, which is removed.
- `register.page.css`: `.error` has `min-height: var(--mm-type-caption-line-height)`, one line only, and no icon.

## Decisions

### Web

- **Two-line reserved space.** `.error` gets `min-height: calc(2 * var(--mm-type-caption-line-height))` (32 px). A message that wraps to two lines fills the reserved space, and an empty one keeps it, so nothing below moves.
- **Alert icon.** Each `.error` message starts with `<ng-icon name="tablerAlertCircle" class="error-icon" aria-hidden="true" />`, the same as on sign-in. The `.error-icon` rule is copied from the sign-in stylesheet: `width` and `height` `var(--mm-size-icon-md)`, `vertical-align: text-bottom`, `color: var(--mm-color-danger)`, `position: relative`, `top: 2px`. The `top` value is the 2 px asked for in the request. The sign-in icon is `top: 3px`; if the two should match exactly, the value is changed in one place.
- **General failure below the button.** The `<p role="alert">` moves after `<button type="submit">` as a form child, with `margin-top: calc(var(--mm-space-3) - var(--mm-space-5))`, the same 12 px gap as on sign-in. Its reserved two-line height means that showing it does not move the button or the login link.
- **Form scroll.** The page already scrolls when the content is taller than the screen. When a registration request fails, the alert element is brought into view with `scrollIntoView({ block: 'nearest' })`, so the form scrolls up only as far as needed.

### Mobile

- **Icon row.** Each error text is in a `view` row with the same `tablerAlertCircle` icon, coloured `palette().danger` and sized `size.iconMd`, as on the sign-in page.
- **Two-line reserved space.** The row gets `minHeight` `2 * caption line height` (32 px).
- **General failure below the button.** The failure row moves after the Create account `pressable`, with the same gap as on sign-in (`-space[2]` top margin, `0` bottom).
- **Form scroll.** The register form is wrapped in a `<scroll-view>`, because its content can be taller than the screen. On failure the failure row is scrolled into view. **Risk:** the scroll-to-view call in ng-native must be checked against its documentation before implementation (`apps/mobile/AGENTS.md`: if the API behaves differently from the docs, stop and report).

## Tests (written first)

Web, `register.page.spec.ts`:
- the failure element is a direct child of the form, after the submit button;
- each error element has an `ng-icon` named `tablerAlertCircle` with `aria-hidden="true"`, and an empty error has no icon;
- `.error` has `min-height` `calc(2 * var(--mm-type-caption-line-height))`;
- on a failed request the failure element calls `scrollIntoView` (stubbed, since jsdom has none).

Mobile, `register.page.test.ts`:
- the failure row comes after the Create account button in the render order, and has `minHeight` of 32 and the same margins as the sign-in failure row;
- each error row has the icon with the danger colour and `size.iconMd`;
- the register form is inside a `scroll-view`.

## Risks

- **ng-native scroll API:** see the mobile decision above.
- **Visual:** the 2 px value and the two-line height are checked on the device in the visual check.

## Open questions

None.
