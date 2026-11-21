# Proposal: add-mock-system

## Why

The apps must run without the API, so the front end can be started and used, on web and on mobile, while the backend is not available or not finished. The mocks should behave as the real API does, so a tester gets the same results and the same error messages as in the real world. The responses come from mock data files, and each mock is listed in one table, so removing it when the real endpoint is ready is a row-by-row task.

## What Changes

- **Scope:** the web app (`apps/web`) and the mobile app (`apps/mobile`). The mocks cover:
  - HTTP (`contracts/openapi/auth.yaml`): `login` (email and password), `refresh`, `logout`.
  - GraphQL (`contracts/graphql/`): `register` (mutation), `me` and `apiVersion` (queries).
  - `signInWithGoogle` is not mocked. The mock works with email and password only, so the table lists it as "not mocked".
- **Mock switch:** a flag set when the app starts. When it is on, the app answers the operations above from the mock data and sends no request to the API. When it is off, the app behaves as today. The flag is documented in `README.md` for each app.
- **Responses come from mock files:** the response data of each operation is read from a file in the repository (JSON), and the data of the users is read from a users file. The mock code does not hard-code responses.
- **Behaves as the API:**
  - The error codes of the covered operations are reproduced with the same HTTP status and the same body: `invalid_client`, `invalid_credentials`, `too_many_attempts`, `invalid_refresh_token`, `invalid_email`, `invalid_password`, `email_too_long`, and the GraphQL codes `EMAIL_TAKEN`, `USERNAME_TAKEN`, `VALIDATION_FAILED`, `PASSWORD_INVALID` with `extensions.field`.
  - The mock checks the same input rules as the API. It reuses the validators in `packages/shared/src/auth/`, so it never accepts what the API rejects.
  - Users registered in the mock are kept in the browser (local storage) and survive a page reload, as the accounts do in the API. The users file is the starting data. Clearing the browser storage resets the mock to the users file. The access token lives in memory, and the refresh token behaves as the real one for each client.
- **Mechanism:**
  - HTTP: an Angular `HttpInterceptorFn` in each app, for the calls made through `HttpClient`.
  - GraphQL: an Apollo link in each app, for the operations sent through Apollo.
  - The mock logic is a set of pure functions, with no DOM and no Apollo, so it can be unit-tested. Where it lives (`packages/shared` or each app) is decided in the design.
- **Mock users:** two users in the users file, with passwords chosen for this change. Each one meets the password rule of the contract:
  - `mock@matchmap.test`, password `Mock-pass1`.
  - `second@matchmap.test`, password `Second-pass2`.
- **Mock table:** a file `Mock-system.md` at the repository root lists every mock in one table: ID, app (web, mobile or both), transport, operation or endpoint, data file, contract (file, or "none"), and status. Operations that are not mocked stay in the table with the status "not mocked". To remove a mock, its row and its entry are removed.
- **README:** a section for each app on how to start it with mocks, the mock users and their passwords, how to reset the mock users, and how to switch mocks off.

## Capabilities

- `api-mocks` (new): the mock switch, the interceptors and links for both apps, the mock data files, the mock users, the error responses, and the mock table. It covers web and mobile.

## Out of scope

- Operations that are not in `contracts/`. A new operation starts in `contracts/` (CLAUDE.md §2), and only then can it be mocked.
- `signInWithGoogle`, and any Google sign-in flow.
- Changes to the API, to `contracts/`, or to the existing behaviour of the apps when the mock flag is off.

## Depends on

- `client-sign-in` (existing spec): the mock sign-in must give the same results as the real one.
- `client-registration` (existing spec): the mock register must give the same results as the real one.

## Behaviour taken from the API

The contract does not describe these behaviours, so the mock copies them from the API code in `matchmap-api`.

- **Login throttling** (`too_many_attempts`): 5 failed logins per 15 minutes, counted per email. The window starts at the first failure and resets on a successful login. `Retry-After` is the time left in the window (`matchmap-api`: `application.yml` `max-failed-logins: 5`, `failed-login-window: 15m`; `auth/LoginThrottle.java`). The API also counts per client IP. The mock has no client IP, so it counts per email only.
- **Username on register:** the email local part, lower-cased, with every character outside `a-z0-9_` replaced by `_`. If the result has fewer than 3 characters, it becomes `user_` plus 8 random characters. It is cut to 30 characters, and a taken name gets `_2`, `_3`, and so on (`matchmap-api`: `account/UsernameGenerator.java`, `account/RegistrationService.java`).
- **`me`:** returns the signed-in user's `id`, `email`, `username` and `createdAt`, the fields of `User` in the contract (`matchmap-api`: `account/AccountGraphqlController.java`, `account/UserAccount.java`).
- **`apiVersion`:** returns the project version, `0.1.0-SNAPSHOT` (`matchmap-api`: `build.gradle.kts`, `graphql/ApiVersionController.java`).

## Open questions

None. Decisions that the API does not define are written above and can be changed at this gate.
