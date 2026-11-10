# Design: add-login-page

## Scope

This design covers the platform details of the two specs `client-sign-in` and `client-registration`, for `apps/web` (Angular, DOM) and `apps/mobile` (ng-native). The behaviour is in the specs, not here.

## Contract baseline

- Repository: `C:\workspace\pablo\matchmap-api`, commit `57943e3` (last commit that touched `contracts/`). The previous baseline `0bb29cb` was superseded when the API declared `X-Client` and the web refresh cookie (`a1f9400`).
- `contracts/openapi/auth.yaml`: `POST /api/auth/login`, `/api/auth/refresh`, `/api/auth/logout` and `/api/auth/google` require the header `X-Client: web | mobile`. A missing or unknown value returns `400 invalid_client`.
- For `X-Client: web`, the refresh token is only in the `refresh_token` cookie (`HttpOnly; Path=/api/auth; Secure; SameSite`). `TokenResponse` (`tokenType`, `accessToken`, `expiresIn`) omits `refreshToken`. `POST /api/auth/refresh` takes no body. `POST /api/auth/logout` takes no body and expires the cookie.
- For `X-Client: mobile`, the refresh token travels in the body: `TokenResponse.refreshToken`, and `refreshToken` in the body of refresh and logout.
- `LoginRequest` declares the limits (email up to 254 characters, password 6 to 20 characters). Errors `401 invalid_credentials`, `429 too_many_attempts` with `Retry-After`, `400 invalid_email` and `400 invalid_password`.
- Check for changes since the baseline before each API-using task (task 0.2 in `tasks.md`).

## Decisions

### Routing

- The main route is at `/`. It is lazy-loaded and uses the main layout, which later changes fill with components.
- The sign-in page is at `/login` and the registration page is at `/register`, on web. The main route is `/`.

### State

- Each app has an `@ngrx/signals` SignalStore named `auth`. It holds the access token in memory and the request status (`idle`, `loading`, `error`).
- Pages read the store signals. Components do not subscribe to RxJS streams.
- Apollo and HTTP calls return observables. They enter the store through `rxMethod` from `@ngrx/signals/rxjs-interop`.

### Data access

- Sign-in calls `POST /api/auth/login` through `data/*.api.ts` in each app. The client types come from `pnpm codegen`, from `contracts/openapi/auth.yaml`.
- Registration calls the GraphQL mutation `register` through an operation in `packages/shared`. Apollo is used only in `data/*.api.ts`.
- After a successful registration, the store calls the same sign-in request with the same email and password (see the spec `client-registration`).

### Client identification

- Every call to `/api/auth/*` sends the header `X-Client`: `web` in `apps/web`, `mobile` in `apps/mobile`. The header is set in `data/auth.api.ts`, not in the store.
- The value selects where the refresh token travels (cookie on web, body on mobile), so it is not optional.

### Refresh token

- **Web:** the API sets the refresh token as an `httpOnly` cookie. The sign-in, refresh and logout requests send credentials (`withCredentials: true`), so the browser stores and returns the cookie. The app never reads it, and the refresh request sends no body. This is declared in `contracts/openapi/auth.yaml` (`matchmap-api` `a1f9400`).
- **Mobile:** the refresh token is stored with `expo-secure-store`, as `apps/mobile/AGENTS.md` requires.
- The access token is never written to storage on either platform.

### Validation

- The sign-in validation (email required, email format and length up to 254, password required and 6 to 20 characters) and the email normalisation (trim and lower-case) are pure functions in `packages/shared`. Both apps use them. The limits are declared in `LoginRequest` in `contracts/openapi/auth.yaml` (`matchmap-api`), and the backend enforces them as GitHub issue `matchMap-api#7` describes. The sign-in form applies no other rule.
- The forms use Signal Forms (`@angular/forms/signals`) on web and on mobile.

### Internationalisation

- The `en` and `es` catalogues are in `packages/shared`. Keys follow `login.<screen>.<element>`.
- Web uses `@ngx-translate/core`, which is already in `apps/web`. The browser language selects `es` when it is `es`, and `en` otherwise.
- The catalogues are `packages/shared/i18n/en.json` and `packages/shared/i18n/es.json`.

### Skeleton screen

- The skeleton is a component in each app, built from the tokens in `docs/design.md` §7.9: blocks in `border`, pulsing opacity with `base` (250 ms), and static under «Reduce motion».

### Icons and the language switcher

- The switcher is a circle with the Tabler icon `language`, the `elevation.card` shadow, and the accessible name from `login.signIn.languageSwitcher`.
- `@ng-icons/core` and `@ng-icons/tabler-icons` are added to both apps in this change, as `docs/design.md` §5 requires. They are listed in the proposal.

### Dependencies

- `expo-secure-store` is added to `apps/mobile` in this change, and it is listed in the proposal.
- `@ng-native/router` and `@angular/router` are added to `apps/mobile` in this change, as listed in the proposal.

### Mobile session restore

- On mobile, the refresh token is read from `expo-secure-store` when the app starts. If none is stored, no refresh request is sent (see the spec `client-sign-in`).
- The mobile language comes from `Intl.DateTimeFormat().resolvedOptions().locale`, because `@ng-native/device` has no locale API. `es` is selected when the language starts with `es`, and `en` otherwise.
- Mobile tests that depend on a signal store run the store's logic through pure functions (for example `sign-in.flow.ts`), because `rxMethod` needs an injection context that the `@ng-native/testing` harness does not provide to stores.

### Focus border

- The active focus border is 2 px in `accent`, as the proposal says. `tokens/tokens.json` has no border width token.
- A border width token `borderWidth.focus` with value 2 is added to `tokens/tokens.json`, and `tokens.ts` and `tokens.css` are regenerated in this change.

## Performance and accessibility

- Both pages follow the accessibility rules in the specs and `docs/design.md` §10.
- No performance budget is changed by this design.
- The accessibility checks of task 6.1 are role and accessible-name assertions in the component tests of each screen. This change adds no accessibility tool and no dependency.

## Android development build

- The Android package name in `apps/mobile/app.json` is `com.anonymous.matchmap`. It is temporary: the MVP runs locally and is not published, so the name is replaced before any store release.
