# Tasks: add-login-input-errors

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass, then refactors. Each task is one commit, with `Task: <id>` in the body.

Precondition: `matchmap-api` issue #27 is merged, so the contract has `email_too_long`. Until then, the client tests use mocked responses.

## 0. Contracts

- [x] **0.1 Contract baseline.** Test first: a check fails if `design.md` does not record the baseline commit. Code: record `matchmap-api` commit `78027e0` under "Contract baseline" in `design.md`.
- [x] **0.2 Contract check before each API-using task.** Before starting any task in sections 2.1 or 3.1, run `git -C C:\workspace\pablo\matchmap-api log --oneline 78027e0..HEAD -- contracts/`. If the output is empty, go on. If not, compare the changed files with the spec and design, and when they affect a requirement or a response shape, stop and propose the change before writing code.

## 1. Shared code (`packages/shared`)

- [x] **1.1 Limit error mapping.** Test first: `limit-errors.spec.ts` checks that `loginLimitErrorKey` returns `login.signIn.errorInvalidEmail` for `invalid_email`, `login.signIn.errorEmailTooLong` for `email_too_long`, `login.signIn.errorInvalidPassword` for `invalid_password`, and `null` for any other code. Code: `packages/shared/src/auth/limit-errors.ts`, exported from the package index.
- [ ] **1.2 Catalogues.** Test first: `i18n.spec.ts` checks that every `login.signIn.*` key used in `client-sign-in/spec.md` for this change exists in `en.json` and `es.json` with a non-empty value. Code: add `errorInvalidEmail` and `errorInvalidPassword` to `packages/shared/i18n/en.json` and `es.json`, with the texts in the spec.

## 2. Web (`apps/web`)

- [ ] **2.1 Data access.** Test first: `auth.api.spec.ts` checks that a login response with `invalid_email`, `email_too_long` or `invalid_password` fails with `invalidEmail`, `emailTooLong` or `invalidPassword`, and that other codes still fail with their current failure. Code: the new cases in `toFailure` in `data/auth.api.ts`.
- [ ] **2.2 Store.** Test first: `auth.store.spec.ts` checks that each new failure is set as the store failure, with `status` `error`, no access token, and the typed values unchanged. Code: the three values in `SignInFailure`.
- [ ] **2.3 Sign-in page.** Test first: `sign-in.page.spec.ts` checks that `invalidEmail` and `emailTooLong` show their text in the email field, that `invalidPassword` shows its text in the password field, and that the credentials, network and unknown messages are unchanged. Code: the field messages in `sign-in.page.ts` and `.html`.

## 3. Mobile (`apps/mobile`)

- [ ] **3.1 Data access.** Test first: `auth.api.test.ts` checks the same codes as 2.1 for `POST /api/auth/login`. Code: the new cases in `toFailure` in `data/auth.api.ts`, and in `sign-in.flow.ts`.
- [ ] **3.2 Store.** Test first: `auth.store.test.ts` checks the same as 2.2. Code: the three values in `SignInFailure` in `state/auth.model.ts`.
- [ ] **3.3 Sign-in page.** Test first: `sign-in.page.test.ts` checks the same as 2.3, with the field messages on ng-native. Code: the field messages in `sign-in.page.ts`.

## 4. Checks and review

- [ ] **4.1 Full check.** Run `pnpm check` for every app and package this change touched, and paste the summary in the PR.
- [ ] **4.2 Translations.** List the two new `es` and `en` values in the PR description under "Translations to review". The `email_too_long` text is an existing key, so it is not listed as new.
