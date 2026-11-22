# Tasks: add-mock-auto-login

Each task starts with its failing test, which is run and shown failing before the code is written. Each task is one commit, with the task id in the body (`Task: 1.1`).

## 1. Shared credentials

- [x] **1.1 Test first.** `packages/shared/test/mocks-auto-login.spec.ts`: `autoLoginCredentials` returns the email and password of `one@matchmap.test` from the users array, and throws when that user is missing. Run it and show it failing.
- [x] **1.2 Code.** `packages/shared/src/mocks/auto-login.ts` with `autoLoginCredentials(users)`. Export it from the shared package index.

## 2. Web start command

- [x] **2.1 Test first.** `apps/web/scripts/start-args.test.mjs`: `['mock', '-l']` gives `autoLogin: true`; `['mock']` and `[]` give `false`; `['-l']` and `['-l', 'mock']` throw the usage error `Usage: pnpm web [mock [-l]]`. Run and show failing.
- [x] **2.2 Code.** `apps/web/scripts/start-args.mjs`.
- [x] **2.3 Test first.** `apps/web/scripts/start-command.test.mjs`: `buildServeArgs` adds `--define=MATCHMAP_AUTO_LOGIN=true` only when `autoLogin` is true. Run and show failing.
- [x] **2.4 Code.** `apps/web/scripts/start-command.mjs`, and the `MATCHMAP_AUTO_LOGIN` define set to `"false"` in `apps/web/angular.json`, next to `MATCHMAP_MOCKS`.

## 3. Mobile start command

- [x] **3.1 Test first.** `apps/mobile/scripts/start.test.mjs`: the same parsing cases as 2.1, with the usage error `Usage: pnpm mobile [mock [-l]]`. `buildExpoEnv` adds `EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN: 'true'` only with `autoLogin`. Run and show failing.
- [x] **3.2 Code.** `apps/mobile/scripts/start.mjs`.

## 4. Web flag and auto sign-in

- [x] **4.1 Test first.** `apps/web/src/app/core/mocks/mock-auto-login.spec.ts`: `autoLoginEnabled` is false without the mock flag, and true only when both `MATCHMAP_MOCKS` and `MATCHMAP_AUTO_LOGIN` are true. Run and show failing.
- [x] **4.2 Code.** `apps/web/src/app/core/mocks/mock-auto-login.ts`.
- [x] **4.3 Test first.** `apps/web/src/app/core/mocks/auto-sign-in.spec.ts`: `autoSignIn(store, credentials, enabled, injector)` does nothing when `enabled` is false. When enabled and `accessToken` is set, it does not call `signIn`. When enabled and no token, it calls `signIn` with the credentials and resolves when `status` leaves `loading`, with or without a failure. Use a fake store. Run and show failing.
- [x] **4.4 Code.** `apps/web/src/app/core/mocks/auto-sign-in.ts`.

## 5. Web wiring

- [x] **5.1 Code.** In `apps/web/src/app/app.config.ts`, the restore initializer runs `autoSignIn(store, autoLoginCredentials(usersData), autoLoginEnabled, injector)` after `sessionChecked`. `usersData` is the users file imported from `packages/shared`. Covered by 4.3 (branching) and 1.1 (credentials). Run `pnpm check` for `apps/web` and show the summary.

## 6. Mobile flag and auto sign-in

- [x] **6.1 Test first.** `apps/mobile/src/app/core/mocks/mock-auto-login.test.ts`: same cases as 4.1, reading `EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN`. Run and show failing.
- [x] **6.2 Code.** `apps/mobile/src/app/core/mocks/mock-auto-login.ts`.
- [x] **6.3 Test first.** `apps/mobile/src/app/core/mocks/auto-sign-in.test.ts`: same cases as 4.3 with a fake store. Run and show failing.
- [x] **6.4 Code.** `apps/mobile/src/app/core/mocks/auto-sign-in.ts`.
- [x] **6.5 Code.** In `apps/mobile/src/main.ts`, the restore initializer calls `autoSignIn` as in 5.1. Run `pnpm check` for `apps/mobile` and show the summary.

## 7. Documentation

- [x] **7.1 Test first.** Extend `apps/web/src/app/core/mocks/readme.spec.ts` and `apps/mobile/src/app/core/mocks/readme.test.ts` so that the root `README.md` has `pnpm web mock -l` and `pnpm mobile mock -l`, and states `one@matchmap.test` and that the flag needs `mock`. Run and show failing.
- [x] **7.2 Code.** Update the two "With mocks" sections of the root `README.md`.

## 8. Full check and manual check

- [ ] **8.1 Full check.** `pnpm check` for all touched packages and apps (`packages/shared`, `apps/web`, `apps/mobile`). Paste the summary in the PR.
- [ ] **8.2 Manual check, web.** `pnpm web mock -l` opens signed in as `one@matchmap.test`. Reload keeps the session. Sign out, reload, and the session is back. Record the result in the PR. Done by the user.
- [ ] **8.3 Manual check, mobile.** `pnpm mobile mock -l` on the Android emulator opens signed in. Record the result in the PR. Done by the user.
