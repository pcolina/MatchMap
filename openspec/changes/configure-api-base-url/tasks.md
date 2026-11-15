# Tasks: configure-api-base-url

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body.

No change to the API contract. The API routes are the ones already in `matchmap-api`.

## 1. Web (`apps/web`)

- [x] **1.1 Development environment.** Test first: a spec checks that `src/environments/environment.ts` exports `environment.apiBaseUrl` equal to `''`, and fails because the file does not exist. Code: create `apps/web/src/environments/environment.ts`.
- [x] **1.2 Auth calls from the base.** Test first: `auth.api.spec.ts` checks that the login and refresh requests are sent to `${apiBaseUrl}/api/auth/login` and `${apiBaseUrl}/api/auth/refresh`, and that with the development value they are relative. Code: build the two URLs in `features/auth/data/auth.api.ts` from `environment.apiBaseUrl`.
- [x] **1.3 GraphQL link from the base.** Test first: a spec checks that the Apollo link URI is `${apiBaseUrl}/graphql`. Code: `apps/web/src/app/app.config.ts`.
- [x] **1.4 Interceptor by path.** Test first: `auth.interceptor.spec.ts` checks that an absolute request to `http://localhost:8080/api/auth/login` gets the `X-Client: web` header, and that a request to `/graphql` does not. Code: parse the URL with `new URL(request.url, 'http://local')` and test the pathname in `core/auth/auth.interceptor.ts`.

## 2. Mobile (`apps/mobile`)

- [x] **2.1 Development environment.** Test first: a test checks that `src/app/core/config/environment.ts` (or the path chosen in the code) exports `apiBaseUrl` equal to `http://10.0.2.2:8080`, and fails because the file does not exist. Code: create it.
- [x] **2.2 Auth calls from the base.** Test first: `auth.api.test.ts` checks that the login and refresh requests use the mobile base URL. Code: `features/auth/data/auth.api.ts`.
- [x] **2.3 Apollo from the base.** Test first: a test checks that the Apollo link URI is the mobile base plus `/graphql`. Code: the mobile Apollo setup in `core/`.
- [x] **2.4 Interceptor by path.** Test first: `core/auth/auth.interceptor.test.ts` checks the same as 1.4 for the mobile base URL. Code: `core/auth/auth.interceptor.ts`.

## 3. Checks and review

- [ ] **3.1 Full check.** Run `pnpm test` in `apps/web` and `apps/mobile`, the mobile typecheck, and the web `ngc` check. Paste the summary in the PR.
- [ ] **3.2 Manual check, web.** After restarting `pnpm web`, sign in from the web app on port 4300 and record the result in the PR (the login must reach the API, not return 404).
- [ ] **3.3 Manual check, mobile.** On the Android emulator, sign in from the app and record the result in the PR. This check is done by the user.
- [ ] **3.4 Translations.** No new keys: the PR description says "Translations to review: none".
- [ ] **3.5 Production.** Not in this change. The production origin is still `[NEEDS CLARIFICATION]` in the proposal.
