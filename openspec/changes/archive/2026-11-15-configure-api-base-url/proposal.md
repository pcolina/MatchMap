# Proposal: configure-api-base-url

## Why

The web and mobile apps call the API with relative paths (`/api/auth/login`, `/api/auth/refresh`, `/graphql`). That only works in web development, where `ng serve` forwards them to `localhost:8080` (change `fix-web-api-proxy`). It does not work in production, where there is no proxy, and it does not work in the mobile app at all, because a native app has no page origin to resolve a relative path against (issue `matchMap` #3). Each environment needs its own API base URL, and the value must live in one file per environment, not in the code.

## What Changes

- **Web:** an environment file with `apiBaseUrl`. Development uses `''`, so the calls stay relative and the existing proxy keeps them on the page origin, which keeps the refresh token cookie working. Production uses `apiBaseUrl` with the production API origin.
- **Mobile:** an environment file with `apiBaseUrl`. Development uses `http://10.0.2.2:8080`, the address of the host machine from the Android emulator. Production uses the production API origin.
- **Calls:** the data access (`auth.api.ts`) and the Apollo link build their URLs from `apiBaseUrl`. The auth interceptor checks the path of the request, not its prefix, so it works with absolute URLs.
- **Production value:** the production origin is not decided. It is written as `[NEEDS CLARIFICATION: production API origin, for example https://api.<domain>. Not known while the MVP is not deployed.]` and is not guessed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The sign-in behaviour does not change; only the URL the calls use.

## Impact

- **Code:** `apps/web/src/environments/`, `apps/mobile/src/environments/` (new), the auth data access and the Apollo setup in both apps, and the auth interceptors in both apps.
- **APIs:** none changed.
- **Dependencies:** none new.

## Out of scope

- The production deployment and its domain.
- The local API port: it stays 8080 in `matchmap-api` `docker-compose.yml`.
- Any change to `fix-web-api-proxy`; the proxy stays as it is for development.

## Depends on

- The API on `localhost:8080` (`matchmap-api`).
- Archived change `fix-web-api-proxy`.

## Open questions

- [NEEDS CLARIFICATION: the production API origin, for web and mobile. Nothing in production is implemented until it is known.]
