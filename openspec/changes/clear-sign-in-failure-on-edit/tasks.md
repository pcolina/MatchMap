# Tasks: clear-sign-in-failure-on-edit

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass, then refactors. Each task is one commit, with `Task: <id>` in the body.

No API call changes in this change, so no contract check is needed.

## 1. Web (`apps/web`)

- [x] **1.1 Hide the failure on edit (email).** Test first: in `sign-in.page.spec.ts`, after a failed sign-in, changing the email hides the failure text, keeps the typed email and password, and keeps the reserved row (scenario "Editing the email hides the failure"). Code: clear the store failure when the email changes, in `auth.store.ts` and the sign-in page.
- [x] **1.2 Hide the failure on edit (password).** Test first: the same check when the password changes (scenario "Editing the password hides the failure"). Code: the same clear for the password field.
- [x] **1.3 Field error alone after an edit.** Test first: after a failure, a password shorter than 6 characters shows only `login.signIn.errorPasswordLength` (scenario "Field error is shown alone after an edit"). Code: none expected; fix the page only if the test fails.
- [x] **1.4 Failure again after a new failed submit.** Test first: a second failed submit shows the failure again (scenario "Failure shown again after a new failed submit"). Code: none expected.
- [x] **1.5 Clear before an empty submit.** Test first: after a failure, submitting with an empty email hides the failure before the field errors, and sends no request (scenario "Failure cleared before a submit with empty fields"). Code: clear the failure in the submit path before the validation message.
- [ ] **1.6 Failure below the Sign in button.** Test first: in `sign-in.page.spec.ts`, the alert element is a direct child of the `<form>` after the submit button, its `margin-top` is `calc(var(--mm-space-3) - var(--mm-space-5))`, and the submit button's `margin-top` is `var(--mm-space-2)` (scenarios "Failure message below the Sign in button" and "Social buttons do not move"). Code: move the alert in `sign-in.page.html`, and update `sign-in.page.css` as in `design.md` §Web.
- [x] **1.7 Reserved space stays.** Test first: the failure element is still rendered and keeps its reserved height when hidden (scenario "Reserved space stays"). Code: none expected.

## 2. Mobile (`apps/mobile`)

- [x] **2.1 Hide the failure on edit.** Test first: in `sign-in.page.test.ts`, after a failed sign-in, changing the email or the password hides the failure text and keeps the typed values (scenarios "Editing the email hides the failure" and "Editing the password hides the failure"). Code: clear the store failure on field change in the mobile store and page.
- [x] **2.2 Clear before an empty submit.** Test first: a submit with empty fields hides the failure before the field errors, and sends no request (scenario "Failure cleared before a submit with empty fields"). Code: clear the failure in the submit path.
- [ ] **2.3 Failure below the Sign in button.** Test first: in `sign-in.page.test.ts`, the failure text's row comes after the Sign in button in the render order, has `marginTop` `-space[2]` and `marginBottom` `0`, and the Sign in button keeps `marginTop` `space[10]` (scenarios "Failure message below the Sign in button" and "Same position on mobile"). Code: move the row in `sign-in.page.ts`, as in `design.md` §Mobile.

## 3. Checks and review

- [x] **3.1 Full check.** Run `pnpm test` in `apps/web` and `apps/mobile`, the mobile typecheck, and the web `ngc` check. Paste the summary in the PR.
- [ ] **3.2 Visual check.** At phone width in the web app and in the mobile app, confirm that the failure message sits in the middle between the password input and the button, and that no field moves when it is shown or hidden. Record the result in the PR. The values in `design.md` are from hand calculation, so this check is required.
- [x] **3.3 Translations.** No new keys: the PR description says "Translations to review: none".
