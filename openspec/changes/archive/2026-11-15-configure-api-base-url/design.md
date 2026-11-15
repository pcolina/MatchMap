# Design: configure-api-base-url

## Context

The apps call the API through three entry points, each with a relative or hard-coded path: the sign-in and refresh requests in `features/auth/data/auth.api.ts` (`/api/auth/login`, `/api/auth/refresh`), the Apollo link in `app.config.ts` (`/graphql`), and the auth interceptors, which decide whether a request is an auth call by testing `request.url.startsWith('/api/auth/')`.

Development keeps the proxy decided in `fix-web-api-proxy`: the browser calls the page origin, and the dev server forwards `/api` and `/graphql` to `http://localhost:8080`. That keeps the refresh token cookie on the page origin and needs no CORS change in `matchmap-api`.

## Decisions

### One environment file per platform

- **Web:** `apps/web/src/environments/environment.ts` exports `environment` with `apiBaseUrl: ''` in development. An empty base keeps the paths relative, so the proxy forwards them.
- **Mobile:** `apps/mobile/src/environments/environment.ts` exports `environment` with `apiBaseUrl: 'http://10.0.2.2:8080'`, the host machine as seen from the Android emulator.
- **Production:** `environment.production.ts` is not created in this change. Its value is `[NEEDS CLARIFICATION: production API origin]` and it is added when the origin is known. The build keeps using the development file until then, and the production build is not deployed in the MVP (`CLAUDE.md` §4).

### Use of the base

- **Web Apollo link:** `uri: \`${environment.apiBaseUrl}/graphql\`` in `app.config.ts`.
- **Web auth data access:** `\`${environment.apiBaseUrl}/api/auth/login\`` and `\`${environment.apiBaseUrl}/api/auth/refresh\`` in `auth.api.ts`.
- **Mobile:** the same three calls, built from the mobile environment.

### Interceptors

The auth interceptor decides by path, not by prefix. It parses the request URL against the page origin (`new URL(request.url, 'http://local')`) and tests the pathname with `startsWith('/api/auth/')`. With an empty base in development the URL is relative, and with an absolute base it is absolute; both give the same pathname.

### Tests (written first)

- Web: `auth.api.spec.ts` checks that the login and refresh requests are built from `environment.apiBaseUrl`, and that with the development value they stay relative.
- Web: `auth.interceptor.spec.ts` checks that an absolute request to `http://localhost:8080/api/auth/login` gets the `X-Client: web` header, and that a request to `/graphql` does not.
- Mobile: the same checks on `auth.api.test.ts` and the interceptor test, with `http://10.0.2.2:8080`.
- A test checks that the development environment files export the values above, so a change to them is visible in a test.

## Risks

- **Mobile emulator address:** `10.0.2.2` is only for the Android emulator. A phone on the same Wi-Fi needs the machine's LAN address. Changing it is a one-line edit in the mobile environment file.
- **Production:** not defined by this change. Nothing points to a production origin until the clarification is answered.

## Open questions

- [NEEDS CLARIFICATION: production API origin for web and mobile.]
