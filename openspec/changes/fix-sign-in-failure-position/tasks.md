# Tasks: fix-sign-in-failure-position

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass, then refactors. Each task is one commit, with `Task: <id>` in the body.

No API call changes in this change, so no contract check is needed before the tasks.

## 1. Web (`apps/web`)

- [x] **1.1 Failure position.** Test first: in `sign-in.page.spec.ts`, check that the element with `role="alert"` is inside the password `.field` div, comes after `#password-error`, and comes before the submit button (scenarios "Failure message below the password field" and "Failure message closer to the password field than to the button"). Code: move the `<p class="error" data-error role="alert">` in `sign-in.page.html` into the password `.field` div, after `#password-error`.
- [x] **1.2 Reserved space.** Test first: in `sign-in.page.spec.ts`, check that the failure element is always rendered, even with no failure, so showing or hiding it does not move the button or the social buttons (scenario "Reserved space keeps the layout still"). Code: keep the `min-height` of the failure element in `sign-in.page.css` after the move.
- [x] **1.3 Messages unchanged.** Test first: in `sign-in.page.spec.ts`, check that the credentials, too-many-attempts, network and unknown messages show the same text in the new position (scenario "Position does not change the message"). The existing tests in this file must still pass. Code: none expected; if a test fails, fix the template only.

- [x] **1.4 Form spacing.** Test first: in `sign-in.page.spec.ts`, check that the form `gap` is `var(--mm-space-5)` and that the header rule uses `var(--mm-space-12)` as bottom padding (requested after review, see `design.md` "Spacing update"). Code: `sign-in.page.css`.

- [x] **1.5 Label and button spacing.** Test first: in `sign-in.page.spec.ts`, check that the email label's computed bottom margin is `calc(-1 * var(--mm-space-1))` and that the submit button's computed top margin is `calc(-1 * var(--mm-space-1))` (see `design.md` "Label and button spacing update"). Code: `sign-in.page.css`.

- [x] **1.6 Second label and button spacing.** Test first: in `sign-in.page.spec.ts`, the email label's computed bottom margin is `calc(-1 * var(--mm-space-2))` and the submit button's computed top margin is `0px` (see `design.md` "Second label and button spacing update"). Code: `sign-in.page.css`.

- [x] **1.7 Focus ring clearance and button spacing.** Test first: in `sign-in.page.spec.ts`, the email and password error lines have a computed top margin of `var(--mm-space-6)`, and the submit button's computed top margin is `var(--mm-space-2)` (see `design.md` "Focus ring and error spacing update"). Code: `sign-in.page.css`.

- [x] **1.8 Error closeness.** Test first: in `sign-in.page.spec.ts`, the email and password error lines have a computed top margin of `var(--mm-space-4)` (see `design.md` "Error closeness update"). Code: `sign-in.page.css`.

- [x] **1.9 Error position.** Test first: in `sign-in.page.spec.ts`, the email and password error lines have a computed top margin of `0px` and a bottom margin of `var(--mm-space-4)` (see `design.md` "Error position update"). Code: `sign-in.page.css`.

- [x] **1.10 Error offset.** Test first: in `sign-in.page.spec.ts`, the email and password error lines have a computed top margin of `5px` and a bottom margin of `calc(var(--mm-space-4) - 5px)` (see `design.md` "Error offset update"). Code: `sign-in.page.css`.

## 2. Mobile (`apps/mobile`)

- [x] **2.1 Failure position.** Test first: in `sign-in.page.test.ts`, check that the `failure` testID is rendered after `password-error` and before the submit button (scenarios "Failure message below the password field" and "Same position on mobile"). Code: move the `<text testID="failure">` in `sign-in.page.ts` into the password field group, after `testID="password-error"`.
- [x] **2.2 Reserved space and messages.** Test first: in `sign-in.page.test.ts`, check that the `failure` testID is always rendered and that the four failure messages show the same text (scenarios "Reserved space keeps the layout still" and "Position does not change the message"). Code: keep the reserved height of the element after the move.

- [x] **2.3 Form spacing.** Test first: in `sign-in.page.test.ts`, check that the form `gap` is `space[5]` and that the content container has no top padding (the same change as 1.4 on mobile). Code: `sign-in.page.ts`, `[style.gap]` on the form and `[style.paddingTop]` on the content container.

- [x] **2.4 Label and button spacing.** Test first: in `sign-in.page.test.ts`, check that the email and password labels have a bottom margin of `-space[1]` and that the Sign in button has a top margin of `space[8]` (see `design.md` "Label and button spacing update"). Code: `sign-in.page.ts`.

- [x] **2.5 Second label and button spacing.** Test first: in `sign-in.page.test.ts`, the email and password labels have a bottom margin of `-space[2]` and the Sign in button a top margin of `space[10]` (see `design.md` "Second label and button spacing update"). Code: `sign-in.page.ts`.

- [x] **2.6 Error offset.** Test first: in `sign-in.page.test.ts`, the email and password error texts have a `marginTop` of 5 and a `marginBottom` of -5 (see `design.md` "Error offset update (mobile)"). Code: `sign-in.page.ts`, with `errorOffset`.

## 3. Checks and review

- [ ] **3.1 Full check.** Run `pnpm check` for `apps/web` and `apps/mobile`, and paste the summary in the PR.
- [ ] **3.2 Visual check.** At phone width in the web app (Chrome and Edge) and in the mobile app, confirm that the failure message is closer to the password field than to the Sign in button, and that it is aligned with the field and not with the icon (design risk). Record the result in the PR.
- [ ] **3.3 Translations.** No new keys: the PR description says "Translations to review: none".
