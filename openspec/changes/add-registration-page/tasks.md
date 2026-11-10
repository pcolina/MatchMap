# Tasks: add-registration-page

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass, then refactors. Each task is one commit, with `Task: <id>` in the body.

Precondition: the change `add-login-page` is archived, and the registration parts of the API change `add-user-accounts` are merged, with the contract change in GitHub issue `matchMap-api#13` (`RegisterInput` with `email` and `password` only). Until then, the client tests use mocks of the `register` mutation and of `POST /api/auth/login`, and the integration tests wait for the API.

## 0. Contracts

The contracts live in `C:\workspace\pablo\matchmap-api\contracts\` (OpenAPI in `openapi\`, GraphQL in `graphql\`). Their baseline is the `matchmap-api` commit `57943e3`, the last commit that touched `contracts/` before this change. Commit `78027e0` (declare the email rules) came after it and was checked against the specs in task 0.2.

- [x] **0.1 Contract baseline.** Test first: a check fails if `design.md` of `add-login-page` does not record the baseline commit. Code: record the commit in `add-login-page/design.md` under "Contract baseline", and repeat the check here for `account.graphqls`.
- [ ] **0.2 Contract check before each API-using task.** Before starting any task in sections 1.2, 2.1, 2.2, 3.1 or 3.2, run `git -C C:\workspace\pablo\matchmap-api log --oneline <baseline>..HEAD -- contracts/`. If the output is empty, go on. If it is not empty, compare the changed files with the specs and design, and when they affect a requirement or a request or response shape, stop and propose the change to the spec or design, as `CLAUDE.md` §6 requires, before writing code.

## 1. Shared code (`packages/shared`)

- [x] **1.1 Registration catalogues.** Test first: `i18n.spec.ts` checks that every `login.register.*` key used in `client-registration/spec.md` exists in `en.json` and `es.json`, with a non-empty value in each. Code: add the approved registration copy from the proposal to `packages/shared/i18n/en.json` and `packages/shared/i18n/es.json`.
- [x] **1.2 Register operation.** Test first: the codegen check fails because the `register` operation and its generated types do not exist. Code: the GraphQL operation `register` in `packages/shared`, typed by `pnpm codegen` from `contracts/graphql/account.graphqls`, with `email` and `password` only.

## 2. Web (`apps/web`)

- [x] **2.1 Register data access.** Test first: `auth.api.spec.ts` checks that `register` is sent once with `email` and `password` only, and that the API error codes map to the registration errors. Code: the Apollo `register` call in `data/auth.api.ts`.
- [x] **2.2 Sign-in after registration.** Test first: `auth.store.spec.ts` checks that after a successful `register` the store signs in with the same email and password, that a failed sign-in redirects to the sign-in page with `login.register.errorSignInAfterRegister`, and that a network failure does the same. Code: the `register` method in the `auth` store, with `rxMethod`.
- [ ] **2.3 Registration page.** Test first: one test per scenario in `client-registration/spec.md`, including the layout, the switcher, the fields, the validation, the request, the skeleton, the reduced motion, the errors, the link back to sign-in, and the language selection. Code: the registration page and its form with Signal Forms.
- [ ] **2.4 Route.** Test first: a routing test checks that `/register` renders the registration page and that the link on the sign-in page leads there. Code: the `/register` route.

## 3. Mobile (`apps/mobile`)

- [ ] **3.1 Register data access.** Test first: the same checks as 2.1. Code: the `register` call in `apps/mobile` `data/auth.api.ts`.
- [ ] **3.2 Sign-in after registration.** Test first: the same checks as 2.2. Code: the `register` method in the `apps/mobile` `auth` store.
- [ ] **3.3 Registration page.** Test first: the same scenarios as 2.3, on ng-native. Code: the page and its form on mobile.
- [ ] **3.4 Route.** Test first: the same checks as 2.4 for mobile. Code: the route on mobile.

## 4. Checks and review

- [ ] **4.1 Accessibility.** Test first: the accessibility checks fail for any interactive element without a role or accessible name. Code: fix the elements that fail.
- [ ] **4.2 Full check.** Run `pnpm check` for every app and package this change touched. Paste the summary in the PR.
- [ ] **4.3 Translations.** List every new `es` and `en` value in the PR description under "Translations to review".
