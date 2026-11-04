# Design: add-login-page

## Scope

This design covers the platform details of the two specs `client-sign-in` and `client-registration`, for `apps/web` (Angular, DOM) and `apps/mobile` (ng-native). The behaviour is in the specs, not here.

## Contract baseline

- Repository: `C:\workspace\pablo\matchmap-api`, commit `0bb29cb` (last commit that touched `contracts/`).
- `contracts/openapi/auth.yaml`: `POST /api/auth/login` takes `{ email, password }` and returns `TokenResponse` (`tokenType`, `accessToken`, `expiresIn`, `refreshToken`). Errors `401 invalid_credentials` and `429 too_many_attempts` with `Retry-After`.
- `contracts/graphql/account.graphqls`: `register(input: RegisterInput!)`. The contract still requires `username` and `displayName`, which `backend-issues/06-register-email-and-password-only.md` removes. This change depends on the result of that issue.
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

### Refresh token

- **Web:** the API sets the refresh token as an `httpOnly` cookie. The sign-in and refresh requests send credentials, so the browser stores and returns the cookie. The app never reads it. This requires the API change in `backend-issues/01-refresh-token-httponly-cookie-web.md`.
- **Mobile:** the refresh token is stored with `expo-secure-store`, as `apps/mobile/AGENTS.md` requires.
- The access token is never written to storage on either platform.

### Validation

- The validation rules (email format and length, password length and character classes) are pure functions in `packages/shared`. Both apps use them, and they copy the rules from the API.
- The forms use Signal Forms (`@angular/forms/signals`) on web and on mobile.

### Internationalisation

- The `en` and `es` catalogues are in `packages/shared`. Keys follow `login.<screen>.<element>`.
- Web uses `@ngx-translate/core`, which is already in `apps/web`. The browser language selects `es` when it is `es`, and `en` otherwise.
- The catalogues are `packages/shared/i18n/en.json` and `packages/shared/i18n/es.json`.

### Skeleton screen

- The skeleton is a component in each app, built from the tokens in `docs/design.md` §7.9: blocks in `border`, pulsing opacity with `base` (250 ms), and static under «Reduce motion».

### Icons and the language switcher

- The switcher is a circle with the Lucide icon `languages`, the `elevation.card` shadow, and the accessible name from `login.signIn.languageSwitcher`.
- `@ng-icons/core` and `@ng-icons/lucide` are added to both apps in this change, as `docs/design.md` §5 requires. They are listed in the proposal.

### Dependencies

- `expo-secure-store` is added to `apps/mobile` in this change, and it is listed in the proposal.

### Focus border

- The active focus border is 2 px in `accent`, as the proposal says. `tokens/tokens.json` has no border width token.
- A border width token `borderWidth.focus` with value 2 is added to `tokens/tokens.json`, and `tokens.ts` and `tokens.css` are regenerated in this change.

## Performance and accessibility

- Both pages follow the accessibility rules in the specs and `docs/design.md` §10.
- No performance budget is changed by this design.
