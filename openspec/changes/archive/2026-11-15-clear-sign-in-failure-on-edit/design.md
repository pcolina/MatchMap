# Design: clear-sign-in-failure-on-edit

## Context

Three behaviours are in the approved specs (`specs/client-sign-in/spec.md`):

1. The sign-in failure message is hidden when the user edits the email or the password, and when the user submits.
2. The sign-in failure message is shown directly below the Sign in button, with its space reserved, so that showing or hiding it does not move the button, the divider or the social buttons.
3. The same position on web and mobile.

This design replaces the earlier centring between the password input and the button (commit `65c19a7` on web, `386b33b` on mobile). Those values are reverted below.

The measurements are worked out by hand from the CSS and the component code. They are not from a visual check.

## Decisions

### Web

- The alert `<p role="alert">` moves out of the password `.field` group and becomes a child of the `<form>`, directly after the submit `<button>`. The form stacks its children with `gap: space-5` (20 px), so the message would sit 20 px below the button.
- The message gets a top margin of `calc(var(--mm-space-3) - var(--mm-space-5))` (-8 px). The gap between the button and the message is then `space-3` (12 px).
- The `[role='alert']` rule with `margin-top: calc(-1 * var(--mm-space-1))` is removed.
- The submit button's top margin goes back to `var(--mm-space-2)` (8 px). This is the value before the centring change. The password input to button distance is then the form gap plus 8 px, 28 px in total.
- The message keeps its reserved height: `.error` already has `min-height: max(caption line height, icon-md)`, which is 20 px.
- Because the message is a form child with reserved height, the divider and the social buttons below the form keep their position.

### Mobile

- The failure text leaves the password group wrapper and goes directly after the Sign in `pressable` in the form. The form's gap of `space-5` (20 px) applies between them.
- The failure row's top margin becomes `-space[2]` (-8 px), so the gap between the button and the row is `space-3` (12 px), the same as on web.
- The failure row's bottom margin becomes 0, so the reserved row keeps the divider in place.
- The row keeps `minHeight` `size.iconMd` (20 px), so showing or hiding the message does not move the button or the divider.
- The Sign in button keeps its top margin of `space[10]` (40 px).

### Clear on edit and on submit

Unchanged from the earlier design. The store method `clearFailure` is called when a field changes, after the first run of the effect, and at the start of `onSubmit` on web and mobile.

## Tests (TDD, written first)

- Web: the alert element is a direct child of the `<form>` and comes after the submit button in document order.
- Web: the alert element has `margin-top` `calc(var(--mm-space-3) - var(--mm-space-5))`, and the submit button has `margin-top` `var(--mm-space-2)`.
- Web: the alert element keeps its reserved height when empty (existing test).
- Mobile: the failure text's row comes after the Sign in button in the render order, and has `marginTop` `-space[2]` and `marginBottom` `0`.
- Mobile: the Sign in button keeps `marginTop` `space[10]`.
- Clear on edit and on submit: the tests already written for these cases stay unchanged.
- Social buttons and divider positions: the reserved row keeps the same height when the message is hidden or shown (existing reserved-space tests).

## Risks

- **Visual:** the message is now below the button, and it may read as part of the button group. Checked in the visual check (task 3.2).
- **Reverts:** the centring values in `sign-in.page.css` and `sign-in.page.ts` are changed back in the same commit as the new tests, so the history stays clear.

## Open questions

None.
