# Proposal: fix-web-api-proxy

## Why

In development, the web app is served on port 4300 by `ng serve`. The web app calls the API with relative paths: `/api/auth/login` for sign-in and `/graphql` for Apollo. A relative path resolves against the origin of the page, so these calls go to `http://localhost:4300`, and the dev server answers them with 404. The API listens on `http://localhost:8080` (see `matchmap-api`, `CLAUDE.md` and `infra/docker/docker-compose.yml`), so the calls never reach it. Checked: `POST http://localhost:4300/api/auth/login` returns 404; `POST http://localhost:8080/api/auth/login` returns 400 for an empty body, which means the API is running.

## What Changes

- Add a development proxy, `apps/web/proxy.conf.json`, that forwards `/api` and `/graphql` to `http://localhost:8080`.
- Connect the proxy to the `serve` target of `apps/web/angular.json`, so `pnpm web` uses it.
- No change to the app code: the relative paths stay as they are.
- The refresh token cookie is set by the API on the same origin as the page in development, so it is stored and sent as the sign-in spec requires.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The sign-in behaviour does not change; only the route that reaches the API in development.

## Impact

- **Code:** `apps/web/proxy.conf.json` (new), `apps/web/angular.json` (serve options).
- **APIs:** none changed. The web app uses the API's `POST /api/auth/login` and `/graphql` as already specified.
- **Dependencies:** none new.

## Out of scope

- The mobile app. Its API base URL is tracked by issue `matchMap` #3.
- Production deployment. The MVP is not deployed (`CLAUDE.md` §4).
- A different API port. The port is fixed at 8080 by the API's `docker-compose.yml`.

## Depends on

- The API running on `localhost:8080` (`matchmap-api`, `infra/docker/docker-compose.yml`).

## Open questions

None.
