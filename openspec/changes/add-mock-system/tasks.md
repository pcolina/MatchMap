# Tasks: add-mock-system

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body. Every scenario of `specs/api-mocks/spec.md` has at least one test, named in the task that covers it.

Sign-in, refresh, logout, registration, `me` and `apiVersion` answer from the shared mock logic in `packages/shared/src/mocks/`. The web and mobile apps only adapt it to their transport.

## 1. Launcher and flag

- [x] **1.1 Argument handling.** Test first: `apps/web/scripts/start-args.spec.ts` checks that no argument gives no flag, `mock` gives the flag, and any other argument gives an error that names the usage (requirement "Mock switch at start-up", scenarios "Flag on answers from the mock", "Flag off keeps the real API", "Flag is off by default"). Code: `apps/web/scripts/start-args.mjs`.
- [ ] **1.2 Define syntax spike.** No production code. Check the `ng serve` syntax for the dev-server `define` option (design decision 2) with a throwaway constant, and record the result in `design.md` before task 1.3.
- [ ] **1.3 Launcher.** Test first: `apps/web/scripts/start-command.spec.ts` checks that the command built for `mock` contains the `define` for `MATCHMAP_MOCKS` set to `true`, and the command for no argument does not (scenario "Flag on answers from the mock"). Code: `apps/web/scripts/start.mjs`, and the `start` script of `apps/web/package.json` becomes `node scripts/start.mjs`.
- [ ] **1.4 Mock flag module.** Test first: `apps/web/src/app/core/mocks/mock-flag.spec.ts` checks that `mockEnabled` is `false` when the define is absent (scenario "Flag is off by default") and `true` when it is set. Code: `apps/web/src/app/core/mocks/mock-flag.ts`.

## 2. Shared mock logic (`packages/shared/src/mocks`)

- [ ] **2.1 Mock users data.** Test first: `packages/shared/test/mocks-users.spec.ts` checks that the users file has `mock@matchmap.test` with password `Mock-pass1` and `second@matchmap.test` with password `Second-pass2`, and that both passwords pass the password validator (requirement "Mock users", scenario "Both mock users can sign in"). Code: `packages/shared/src/mocks/data/users.json`.
- [ ] **2.2 Responses from data files.** Test first: changing a value in the data file changes the response of the sign-in function, with the file read at call time (requirement "Responses come from mock data files", scenarios "Changing a data file changes the response", "Users come from the users file"). Code: the data loader in `packages/shared/src/mocks/`.
- [ ] **2.3 Sign-in success.** Test first: the web request returns 200, `tokenType` `Bearer`, `accessToken`, `expiresIn` and no `refreshToken`; the mobile request also returns `refreshToken` (scenarios "Correct credentials for the web client", "Correct credentials for the mobile client"). Code: the sign-in function.
- [ ] **2.4 Sign-in normalisation.** Test first: `  Mock@MatchMap.test ` with the correct password signs in (scenario "Email is normalised before the comparison"). Code: email trim and lower-case before the lookup.
- [ ] **2.5 Credential error.** Test first: a wrong password and an unknown email both return 401 with `invalid_credentials`, with the same body (scenarios "Wrong password", "Unknown email"). Code: the credential check.
- [ ] **2.6 Sign-in client and email errors.** Test first: `invalid_email` for `not-an-email`, `email_too_long` for a 255-character email, `invalid_client` for a missing or unknown `X-Client` (scenarios "Invalid email format", "Email too long", "Missing or unknown client header"). Code: the checks with the validators of `packages/shared/src/auth/`.
- [ ] **2.7 Sign-in password error.** Test first: a 5-character password returns 400 with `invalid_password` (scenario "Password outside its limits"). Code: the password length check.
- [ ] **2.8 Login throttling.** Test first: the sixth attempt within 15 minutes returns 429 with `too_many_attempts` and a `Retry-After`; the sign-in succeeds after the window; a success resets the count (scenarios "Sixth attempt is throttled", "Window expires", "Success resets the count"). Code: the throttle with the values of the API (5 failures, 15 minutes).
- [ ] **2.9 Refresh.** Test first: a valid refresh returns 200 with a new access token and invalidates the old token; a reused token returns 401 with `invalid_refresh_token` (scenarios "Refresh rotates the token", "Reused refresh token"). Code: the refresh function.
- [ ] **2.10 Logout.** Test first: logout revokes the session and returns 204; an unknown or missing token also returns 204 (scenarios "Logout revokes the session", "Logout with an unknown token"). Code: the logout function.
- [ ] **2.11 Registration.** Test first: a valid registration returns the `User` with `id`, `email`, `username` and `createdAt`; the email is stored trimmed and lower-cased (scenarios "Valid registration", "Registration stores the normalised email"). Code: the register function.
- [ ] **2.12 Registration rules.** Test first: an empty email returns `VALIDATION_FAILED` with `extensions.field` `email`; `abcdef` returns `PASSWORD_INVALID` with `extensions.field` `password` (scenarios "Input breaks the email rule", "Password breaks the rule"). Code: the rule checks with the validators.
- [ ] **2.13 Email already in use.** Test first: an existing email returns `EMAIL_TAKEN` (scenario "Email already in use"). Code: the duplicate check.
- [ ] **2.14 Username.** Test first: `jane.doe@matchmap.test` gives `jane_doe`; `ab@matchmap.test` gives `user_` plus 8 characters; a taken `mock_user` gives `mock_user_2` (scenarios "Username from the email", "Short local part", "Taken username gets a suffix"). Code: the username derivation, as `UsernameGenerator` in the API.
- [ ] **2.15 Me and apiVersion.** Test first: `me` with a valid token returns `id`, `email`, `username` and `createdAt`; without a token it returns the authentication error; `apiVersion` returns `0.1.0-SNAPSHOT` (scenarios "Me returns the signed-in user", "Me without a token", "Api version"). Code: the two functions.
- [ ] **2.16 Stored state.** Test first: a registered user is found after the state is read again; an empty state gives only the users of the data file; the stored state contains no access token (scenarios "Registered user survives a reload", "Clearing the storage resets the users", "Access token is not stored"). Code: the state functions, which take a storage adapter so they can be tested with a memory adapter.

## 3. Web adapters (`apps/web/src/app/core/mocks`)

- [ ] **3.1 HTTP interceptor.** Test first: `mock-http.interceptor.spec.ts` checks that with the flag on, `/api/auth/login`, `/api/auth/refresh` and `/api/auth/logout` are answered by the shared logic and no request reaches `HttpBackend`, and that with the flag off the request passes through (scenarios "Flag on answers from the mock", "Flag off keeps the real API"). Code: `mock-http.interceptor.ts`.
- [ ] **3.2 Apollo link.** Test first: `mock-apollo.link.spec.ts` checks that `register`, `me` and `apiVersion` are answered by the shared logic, and that the GraphQL errors carry `extensions.code` and `extensions.field` (scenarios "Me returns the signed-in user", "Api version", "Email already in use"). Code: `mock-apollo.link.ts`.
- [ ] **3.3 Google not mocked.** Test first: a sign-in with Google reports that Google sign-in is not mocked and sends no request the mock answers (scenario "Google sign-in is not mocked"). Code: the `signInWithGoogle` branch in the interceptor, and the i18n key `auth.mock.googleNotMocked` in `packages/shared` (en and es).
- [ ] **3.4 Refresh cookie emulation.** Test first: the web adapter sends the stored refresh token to the shared refresh function and returns the new token in the cookie emulation, not in the body (scenario "Correct credentials for the web client", scenario "Refresh rotates the token" for the web client). Code: the web branch of the adapter.
- [ ] **3.5 Storage fallback.** Test first: when `localStorage` throws, the state is kept in memory for the page session, and the app still signs in (design decision 5). Code: the storage adapter in `apps/web/src/app/core/mocks/`.
- [ ] **3.6 App config registration.** Test first: `app.config.spec.ts` checks that the interceptor and the link are registered only when `mockEnabled` is `true`. Code: `apps/web/src/app/app.config.ts`.

## 4. Documentation and checks (web)

- [ ] **4.1 Mock table.** Test first: `apps/web/src/app/core/mocks/mock-table.spec.ts` reads `Mock-system.md` and checks that each mocked operation has a row with its data file and contract, and that `signInWithGoogle` has the status "not mocked" (scenarios "Every mocked operation has a row", "Google sign-in has a row"). Code: `Mock-system.md` at the repository root.
- [ ] **4.2 README.** Test first: the README test checks that the web section names both users and their passwords, and explains the reset (scenarios "README lists the mock users", "README explains the reset"). Code: the README section, already written with `pnpm web mock`.
- [ ] **4.3 Production bundle.** Check that `pnpm build:web` produces a bundle without the mock user passwords (design decision 2). Record the check in the PR. No test file; the check command is in the PR.
- [ ] **4.4 Full check (web).** Run `pnpm test` for `packages/shared` and `apps/web`, the web `ngc` check, and `pnpm build:web`. Paste the summary in the PR.
- [ ] **4.5 Visual check (web).** Done by the user: `pnpm web mock`, sign in with each mock user, register a user, reload, and check the error messages.

## 5. Mobile (after 4.5 and the mobile storage decision)

- [ ] **5.1 Mobile start command.** Decide the mobile command with the user, following `pnpm web mock`, before the task starts. Test first: the same launcher tests as 1.1 and 1.3 for the mobile start. Code: the mobile launcher.
- [ ] **5.2 Mobile flag.** Test first: the same `mockEnabled` test as 1.4 for `apps/mobile`. Code: `apps/mobile/src/app/core/mocks/mock-flag.ts`.
- [ ] **5.3 Mobile interceptor and link.** Test first: the same tests as 3.1, 3.2 and 3.3, for the mobile transport. Code: the mobile adapters in `apps/mobile/src/app/core/mocks/`.
- [ ] **5.4 Mobile storage.** Test first: the stored state of 2.16 works with the storage mechanism the mobile app already uses. The mechanism is named in the PR and decided before this task. Code: the storage adapter for mobile.
- [ ] **5.5 Mobile README.** Test first: the mobile section names the users, explains the reset and the start command (scenarios "README lists the mock users", "README explains the reset"). Code: the README section for mobile.
- [ ] **5.6 Full check (mobile).** Run the mobile tests and typecheck, and the shared tests. Paste the summary in the PR.
- [ ] **5.7 Visual check (mobile).** Done by the user on the Android emulator, with the same steps as 4.5.
