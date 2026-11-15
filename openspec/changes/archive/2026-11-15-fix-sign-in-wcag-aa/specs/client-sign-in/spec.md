# Spec Delta: client-sign-in

## ADDED Requirements

### Requirement: Input border contrast

The email and password inputs and the social buttons SHALL have an outline that contrasts at least 3:1 with the adjacent colour, in day mode, so that the boundary of each control can be seen (WCAG 2.2 criterion 1.4.11). The outline colour is the `borderInput` token.

#### Scenario: Input border against the surface
- **WHEN** the sign-in page is shown in day mode
- **THEN** the border of the email and password inputs has a contrast of at least 3:1 against the `surface` colour

#### Scenario: Input border against the page background
- **WHEN** the sign-in page is shown in day mode
- **THEN** the border of the email and password inputs has a contrast of at least 3:1 against the `bg` colour

#### Scenario: Social button outline
- **WHEN** the sign-in page shows the Google, Facebook and Apple buttons
- **THEN** their outline uses the `borderInput` token and has a contrast of at least 3:1 against the `surface` colour, although the buttons are disabled

#### Scenario: Other tokens are unchanged
- **WHEN** the `borderInput` token is added
- **THEN** the value of `borderStrong` and every component that uses it stay the same

### Requirement: Focus indicator for keyboard and pointer

The web app SHALL show a focus indicator that depends on how the user moves focus. Keyboard focus (Tab) SHALL show the focus ring of `docs/design.md` §Focus: a ring of `borderWidth.focus` plus 1 px, offset by `borderWidth.focus`, with the outer halo. Pointer focus (a mouse click) SHALL show a ring half as wide as the keyboard ring, and SHALL NOT show the halo.

#### Scenario: Keyboard focus shows the full ring and halo
- **WHEN** the user moves focus to a control with the Tab key
- **THEN** the control shows the 3 px `accent` ring and the outer halo

#### Scenario: Pointer focus shows a half-width ring without halo
- **WHEN** the user clicks an input or a button with the mouse
- **THEN** the control shows a 1.5 px `accent` ring and no outer halo

#### Scenario: Pointer mode is set by the pointer
- **WHEN** the user presses a pointer button on the page
- **THEN** the page is marked as pointer mode until the user presses Tab again

#### Scenario: Keyboard mode is set by Tab
- **WHEN** the user presses Tab on the page
- **THEN** the page is marked as keyboard mode until the user presses a pointer button again

#### Scenario: Mobile app has no focus halo
- **WHEN** the mobile app shows a focused control
- **THEN** the change of this requirement does not apply to the mobile app

### Requirement: Error messages use an icon as well as colour

Every error message on the sign-in page SHALL show a red alert icon before its text, so that an error is not conveyed by colour alone (WCAG 2.2 criterion 1.4.1). This applies to the email field error, the password field error and the sign-in failure message, on web and on mobile.

#### Scenario: Field error with icon
- **WHEN** the email or password field shows an error message
- **THEN** a red alert icon is shown before the message text

#### Scenario: Sign-in failure with icon
- **WHEN** the page shows a sign-in failure message
- **THEN** a red alert icon is shown before the message text

#### Scenario: Empty error space shows no icon
- **WHEN** a field has no error message
- **THEN** no alert icon is shown in its error space

#### Scenario: Icon is decorative
- **WHEN** the icon is shown with its message
- **THEN** the icon does not add its own accessible name, and the message text is what a screen reader announces
