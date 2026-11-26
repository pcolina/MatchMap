# Tasks

This change has no `design.md`: it changes one message and needs no technical decision. The API does not change (`matchmap-api`, change `clarify-unknown-email-sign-in`).

## 1. Shared copy (packages/shared)

- [x] 1.1 Update the approved copy for `login.register.errorEmailTaken` in `packages/shared/test/registration-i18n.spec.ts` to "You already have an account with this email." (en) and "Ya tienes una cuenta con este email." (es). Run the test and show it failing against the current catalogues in `packages/shared/i18n/`.
- [x] 1.2 Change `login.register.errorEmailTaken` in `packages/shared/i18n/en.json` and `packages/shared/i18n/es.json` to the same texts. Verify `packages/shared/test/registration-i18n.spec.ts` passes.

## 2. Web (apps/web)

- [x] 2.1 Add the test "Email already registered" to `apps/web/src/app/features/auth/pages/register/register.page.spec.ts`. With the API mock returning `EMAIL_TAKEN`, the page shows the text of `login.register.errorEmailTaken`, and the link `login.register.goToSignIn` is visible and leads to the sign-in page. Show it failing before task 1.2, then verify it passes after task 1.2.

## 3. Mobile (apps/mobile)

- [x] 3.1 Add the same scenario to `apps/mobile/src/app/features/auth/pages/register/register.page.test.ts`. Show it failing before task 1.2, then verify it passes after task 1.2.

## 4. Verification

- [x] 4.1 Run the full check of every touched package and app (`packages/shared`, `apps/web`, `apps/mobile`) and paste the summary.
- [x] 4.2 List "You already have an account with this email." (en) under "Translations to review" in the pull request.
