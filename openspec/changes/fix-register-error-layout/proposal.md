# Proposal: fix-register-error-layout

## Why

The registration page shows its error messages in the same way the sign-in page did before the fixes of `clear-sign-in-failure-on-edit` and `fix-sign-in-wcag-aa`. Those fixes are not on the register page:

- The error messages do not reserve their space, so an error that appears moves the layout.
- Some messages can take two lines, and the reserved space does not account for that.
- The messages have no alert icon, so an error is shown in red text only (WCAG 1.4.1).
- The general message (`role="alert"`) sits above the submit button, not below it.

## What Changes

- **Reserved space:** each error message on the registration page reserves the height of two lines, so a message that wraps does not move the layout. The space stays the same whether or not a message is shown.
- **Alert icon:** every error message gets the same red `tablerAlertCircle` icon as the sign-in page, at `size-icon-md`, aligned with the text 2 px lower than the default alignment, as the sign-in page does.
- **General message position:** the general registration failure message (`role="alert"`) is shown directly below the `Create account` button, with its space reserved, so that showing it does not move the button.
- **Form space:** if the message does not fit in the visible area below the button, the form scrolls so that the message is visible. [NEEDS CLARIFICATION: "desplazar el formulario para arriba" can mean (a) the whole form scrolls up so that the message is visible, or (b) only the message moves up within the screen. Which one?]
- **Web and mobile:** the same behaviour on both apps, as `CLAUDE.md` §1 requires. The mobile register page is checked in the same change, but its position is decided with the question above.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `client-registration`: the error messages reserve two lines, show the alert icon, and the general failure message sits below the submit button.

## Impact

- **Web:** `apps/web/src/app/features/auth/pages/register/register.page.html` and `.css`.
- **Mobile:** `apps/mobile` register page, same changes.
- **APIs:** none.
- **Dependencies:** none new.

## Out of scope

- The sign-in page (already done).
- The wording of any message.
- Field validation rules.

## Depends on

- **Spec `client-registration`** in `openspec/specs/client-registration/`.
- **Spec `client-sign-in`** for the icon and the reserved space it defines.

## Open questions

- [NEEDS CLARIFICATION: the meaning of "desplaza el formulario para arriba" (see What Changes).]
