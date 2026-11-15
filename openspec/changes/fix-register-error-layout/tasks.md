# Tasks: fix-register-error-layout

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body.

No API call changes, so no contract check is needed.

## 1. Web (`apps/web`)

- [x] **1.1 Failure below the submit button.** Test first: in `register.page.spec.ts`, the failure element is a direct child of the form and comes after the submit button (scenario "Failure message below the button"). Code: move the `<p role="alert">` after the button in `register.page.html`, with the margin from `design.md`. Also remove the stray `</p>`.
- [x] **1.2 Icon on every error.** Test first: each error element contains an `ng-icon` named `tablerAlertCircle` with `aria-hidden="true"`, and an empty error has no icon (scenarios "Error state on a field" and "Error space stays when there is no error"). Code: the icon in `register.page.html`, and the `.error-icon` rule in `register.page.css` as in `design.md`.
- [x] **1.3 Two-line reserved space.** Test first: `.error` has computed `min-height` `calc(2 * var(--mm-type-caption-line-height))` (scenario "Two-line error keeps the layout"). Code: `register.page.css`.
- [x] **1.4 Button does not move.** Test first: the submit button keeps its position when the failure is shown or hidden (scenario "Button does not move when the message appears"). Code: none expected; fix the template only if the test fails.
- [x] **1.5 Scroll to the failure.** Test first: on a failed request, the failure element's `scrollIntoView` is called with `{ block: 'nearest' }` (scenario "Form scrolls when the message does not fit"). `scrollIntoView` is stubbed in the test, since jsdom has none. Code: call it after the failure is set, in `register.page.ts`.

## 2. Mobile (`apps/mobile`)

- [ ] **2.1 Check the ng-native scroll API.** Before any mobile code, read the `scroll-view` section of https://ng-native.com/llms-full.txt and record in the PR which call scrolls a view into view. If the API differs from this design, stop and report.
- [ ] **2.2 Failure below the button.** Test first: in `register.page.test.ts`, the failure row comes after the Create account button in the render order (scenario "Same behaviour on mobile"). Code: move the row in the register page.
- [ ] **2.3 Icon row and reserved height.** Test first: each error row has the danger-coloured icon at `size.iconMd`, and the rows have `minHeight` 32 (scenarios "Error state on a field" and "Two-line error keeps the layout"). Code: the rows in the register page.
- [ ] **2.4 Scroll view.** Test first: the register form is inside a `scroll-view` (scenario "Form scrolls when the message does not fit"). Code: wrap the form in the register page.
- [ ] **2.5 Scroll to the failure.** Test first: after a failed request the failure row is scrolled into view, using the call confirmed in 2.1. Code: the call in the register page.

## 3. Checks and review

- [ ] **3.1 Full check.** Run `pnpm test` in `apps/web` and `apps/mobile`, the mobile typecheck, and the web `ngc` check. Paste the summary in the PR.
- [ ] **3.2 Visual check, web.** At phone width in Chrome or Edge, with the dev server restarted: check the icon alignment (2 px), the two-line space, and that the message is visible after a failed submit.
- [ ] **3.3 Visual check, mobile.** On the Android emulator: the same checks. Done by the user.
- [ ] **3.4 Translations.** No new keys: the PR description says "Translations to review: none".
