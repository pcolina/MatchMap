# Design: add-mock-system

## Context

The web and mobile apps call the API for sign-in, refresh, logout, registration, `me` and `apiVersion`. The mock must answer those calls without the API, with the same results and error codes, from data files, and it must keep registered users across page reloads. The contract covers the operations; the API code defines the behaviour the contract does not describe (throttling, username derivation, `me`, `apiVersion`), as recorded in the proposal.

## Decisions

### 1. Start command

`pnpm web mock` starts the web app with mocks. `apps/web/package.json` changes its `start` script to `node scripts/start.mjs`. The launcher reads its arguments:

- no argument: starts `ng serve --port 4300`, as today;
- `mock`: starts the same command with the mock flag on;
- any other argument: exits with status 1 and prints the usage.

The root script `web` already forwards extra arguments to `start`, so `pnpm web mock` reaches the launcher. Verified: today `pnpm web mock` reaches `ng serve` as a positional argument, which is why the launcher is needed.

The launcher has no dependencies and uses only Node's built-in modules.

### 2. Passing the flag to the browser code

The flag is a build constant, `MATCHMAP_MOCKS`. The launcher passes it to the dev server with the `define` option (`@angular/build` dev-server schema: "Defines global identifiers that will be replaced with a specified constant value"). The application reads it through one module, `apps/web/src/app/core/mocks/mock-flag.ts`, which exports `mockEnabled`.

- Dev server with `mock`: `mockEnabled` is `true`.
- Dev server without `mock`, and `pnpm build:web`: `mockEnabled` is `false`. Angular's minifier then removes the mock code from the bundle.

The exact `ng serve` syntax for `--define` is verified in the first task of `tasks.md`, before the launcher is written. Verified in task 1.2 with `pnpm exec ng serve --help`: `--define` is an array option, and the value is used as written, so the flag is passed as `--define=MATCHMAP_MOCKS=true`. String values need quotes; a boolean does not. The effect in the browser is checked in task 3.6.

### 3. Shared mock logic

The mock logic lives in `packages/shared/src/mocks/`: pure functions and JSON data, with no DOM, no Apollo and no app code. The pure functions:

- take a request description (transport, operation or path, headers, body, and the current stored state) and return the response (status, headers, body) or the error;
- reuse the validators in `packages/shared/src/auth/` for the input rules;
- compute the throttle, the username and the `me` and `apiVersion` results as the API does (`UsernameGenerator`, `LoginThrottle`, `AccountGraphqlController`, `ApiVersionController` in `matchmap-api`).

The data files are `packages/shared/src/mocks/data/users.json` (the two mock users, with password and id) and `packages/shared/src/mocks/data/responses.json` (fixed values such as the error bodies and `apiVersion`).

`packages/shared` already holds the GraphQL types and the i18n catalogues, so it is the place for the mock logic that both apps need.

### 4. App adapters

Each app has two thin adapters, and only they touch the framework:

- Web: `apps/web/src/app/core/mocks/mock-http.interceptor.ts` (an `HttpInterceptorFn`) and `mock-apollo.link.ts` (an Apollo link). Both are registered in `app.config.ts` only when `mockEnabled` is `true`.
- Mobile: the same two adapters in `apps/mobile/src/app/core/mocks/`, in the mobile change, after the web one is verified.

An adapter reads the request, calls the shared function, and returns the response in the transport's shape. It does not contain rules.

### 5. Persistence and sessions

- Registered users and the throttle counters are stored in `localStorage` under the key `matchmap.mock.state` as one JSON document. Reads and writes are wrapped in `try/catch`.
- When `localStorage` is not available, the state is kept in memory for the page session. The app still works, and the users are lost on reload.
- The access tokens are kept in memory only. Each token maps to a user id, and an unknown token gives the API's authentication error.
- Refresh tokens are kept in the stored state, with the user id and whether they are revoked, so they survive a reload as the API's sessions do.
- The web client receives the refresh token in a cookie in the real API. A page cannot set an HttpOnly cookie, so the web mock keeps the refresh token in the stored state and the web adapter sends it back to the shared function as the cookie value. This emulates the cookie inside the browser; the request and response shapes are the contract's.

### 6. Throttling

The throttle counts failed logins per email, with the API's values: 5 failures in a 15-minute window, reset on success, `Retry-After` set to the seconds left (`matchmap-api` `application.yml`). The counters live in the stored state, so they survive a reload, as the API's counters do. The mock has no client IP, so it counts per email only.

### 7. Mock table and documentation

`Mock-system.md` lists every row as in the spec. The README sections for each app document `pnpm web mock` (web) and the mobile equivalent, the two users with their passwords, the reset by clearing the site data, and how to start without mocks. The web README section already uses `pnpm web mock`, as decision 1 defines it.

## Open points

- **Mobile storage:** the mobile app keeps state in the device, not in `localStorage`. The mobile change chooses the storage with the app's existing storage mechanism. It is confirmed in the mobile change, before its tasks start.
- **`define` syntax:** verified in the first task, as said in decision 2.

## Risks

- A page cannot set an HttpOnly cookie. Decision 5 avoids it by keeping the refresh token in the stored state; the web adapter, not the browser, handles the cookie.
- Mock logic that drifts from the API. The mock table names the API file each rule comes from, and the tests in `packages/shared` cover each rule from the spec.
