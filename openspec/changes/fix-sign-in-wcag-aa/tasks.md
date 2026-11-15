# Tasks: fix-sign-in-wcag-aa

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass, then refactors. Each task is one commit, with `Task: <id>` in the body.

No API call changes in this change, so no contract check is needed.

## 1. Tokens (`tokens/`)

- [ ] **1.1 Token consistency.** Test first: a test reads `tokens.json`, `tokens.ts` and `tokens.css` and fails because `borderInput` does not exist yet. It checks that `borderInput` has light value `#6B7485` in all three files and that `borderStrong` is still `#C3CCD9` light. Code: add `borderInput` to `tokens/tokens.json` (light `#6B7485`, dark `#3B4660`), `tokens/tokens.ts` and `tokens/tokens.css`.
- [ ] **1.2 Contrast report.** Test first: a test checks that `tokens/contrast-report.md` has a row for `borderInput` against `surface` and `bg`, day and night, with a ratio of at least 3:1. Code: add the rows to `tokens/contrast-report.md`.

## 2. Web (`apps/web`)

- [ ] **2.1 Input and social button outlines.** Test first: in `sign-in.page.spec.ts`, the email and password inputs and the social buttons use `var(--mm-color-borderInput)` for their border colour (scenarios "Input border against the surface", "Input border against the page background" and "Social button outline"). Code: use the token in `sign-in.page.css`.
- [ ] **2.2 Input modality.** Test first: `input-modality.spec.ts` checks that a `pointerdown` sets `data-input="pointer"` on `<html>`, a Tab `keydown` sets `data-input="keyboard"`, another key leaves it unchanged, and the returned cleanup removes the listeners (scenarios "Pointer mode is set by the pointer" and "Keyboard mode is set by Tab"). Code: `apps/web/src/app/core/input-modality.ts`, registered with `provideAppInitializer` in `app.config.ts`.
- [ ] **2.3 Keyboard and pointer focus.** Test first: the stylesheet contains the rule `:root[data-input='pointer'] :focus-visible` with `box-shadow: none` and an outline of `calc((var(--mm-border-width-focus) + 1px) / 2)` (scenarios "Keyboard focus shows the full ring and halo" and "Pointer focus shows a half-width ring without halo"). Code: `apps/web/src/styles.css`.
- [ ] **2.4 Error icon.** Test first: in `sign-in.page.spec.ts`, each error element contains an `ng-icon` named `tablerAlertCircle` with `aria-hidden="true"` and the same text as before, and an empty error space has no icon (scenarios "Field error with icon", "Sign-in failure with icon" and "Empty error space shows no icon"). Code: the icon in `sign-in.page.html`, coloured `var(--mm-color-danger)` and sized `var(--mm-size-icon-md)` in `sign-in.page.css`, and `tablerAlertCircle` in the `provideIcons` list of the test setup.
- [ ] **2.5 Existing messages.** Test first: the existing message tests in `sign-in.page.spec.ts` still pass after the icon is added, and the failure element keeps `role="alert"`. Code: none expected; fix the template only if a test fails.

## 3. Mobile (`apps/mobile`)

- [ ] **3.1 Error icon row.** Test first: in `sign-in.page.test.ts`, the email error, the password error and the failure text each sit in a row with a `tablerAlertCircle` icon coloured with the palette `danger` colour, and the failure keeps `accessibilityRole="alert"` (scenarios "Field error with icon" and "Sign-in failure with icon"). Code: wrap each error text and its icon in a `view` row in `sign-in.page.ts`.
- [ ] **3.2 Reserved space and offset.** Test first: the rows keep the 5 px offset and the reserved space of the previous change, so the existing offset assertions still pass. Code: move the offset from the text to the row.

## 4. Docs and rules

- [ ] **4.1 Design doc.** Test first: a check that `docs/design.md` has the rule "A message that is shown in red must also show an icon" under accessibility, and the focus section describes the keyboard and pointer split. Code: edit `docs/design.md`.
- [ ] **4.2 Project rules.** Test first: a check that `CLAUDE.md` §9 has the same rule in one line. Code: edit `CLAUDE.md` §9.

## 5. Checks and review

- [ ] **5.1 Full check.** Run `pnpm test` in `apps/web` and `apps/mobile`, the mobile typecheck, and the web `ngc` check, and paste the summary in the PR.
- [ ] **5.2 Visual check.** At phone width in the web app and in the mobile app, confirm that the icon sits in line with the error text, that the focus ring by mouse is half width without halo, and that the keyboard ring is unchanged. Record the result in the PR.
- [ ] **5.3 Translations.** No new keys: the PR description says "Translations to review: none".
- [ ] **5.4 Dark mode.** Not in this change. The PR says that dark mode contrast is tracked by issue `matchMap` #7.
