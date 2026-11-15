# Design: fix-web-api-proxy

## Context

The web app calls `/api/auth/login` and `/graphql` as relative paths. In development they are served by `ng serve` on port 4300, which has no route for them and answers 404. The API listens on `http://localhost:8080`. Angular's dev server can forward paths to another origin with a proxy configuration, so the app code does not change.

## Decisions

- **File:** `apps/web/proxy.conf.json`, committed, with no secrets and no environment-specific values beyond the local API port.
- **Routes:** `/api` and `/graphql` go to `http://localhost:8080`. The `/api` entry sets `secure: false` and `changeOrigin: true`. The `/graphql` entry uses the same target.
- **Wiring:** `apps/web/angular.json`, under `projects.web.architect.serve.options`, gets `"proxyConfig": "proxy.conf.json"`. The `serve` target already has `configurations.development` and `defaultConfiguration: development`, so `pnpm web` uses the proxy without an extra flag. The proxy is not added to the `production` configuration, because the MVP is not deployed.
- **Cookies:** the browser sees the API's cookies on the page origin (4300), since the proxy makes the calls same-origin. The refresh token cookie set by `POST /api/auth/login` is therefore stored and sent as the sign-in spec requires (`Web refresh token is not readable by scripts`).
- **Port:** 8080 is fixed by `infra/docker/docker-compose.yml`. A different API port is changed in `proxy.conf.json` only.

## Tests and checks

Written first, each failing before the file exists:

- A test reads `apps/web/proxy.conf.json` and checks that `/api` and `/graphql` map to `http://localhost:8080`, and that no other route is present.
- A test reads `apps/web/angular.json` and checks that the `serve` target's options contain `proxyConfig` set to `proxy.conf.json`, and that the `production` serve configuration does not.
- Manual check, recorded in the PR: with the API running (`docker compose up`), `POST http://localhost:4300/api/auth/login` with an empty body returns the API's 400, not 404; a sign-in attempt from the web app reaches the API.

## Risks

- **Stale process:** a dev server started before the change does not read the new config. Restart `pnpm web`.
- **Mobile:** not affected; it has its own base URL work (issue `matchMap` #3).

## Open questions

None.
