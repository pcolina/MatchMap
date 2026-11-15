# Tasks: fix-web-api-proxy

Each task writes its failing test first, runs it and shows it failing, then writes the minimum code to make it pass. Each task is one commit, with `Task: <id>` in the body.

No change to the app code. The checks are on the configuration files.

## 1. Web (`apps/web`)

- [ ] **1.1 Proxy routes.** Test first: a spec reads `apps/web/proxy.conf.json` and fails because the file does not exist. It checks that `/api` and `/graphql` map to `http://localhost:8080` with `changeOrigin: true`, and that no other route is present. Code: create `apps/web/proxy.conf.json`.
- [ ] **1.2 Serve wiring.** Test first: a spec reads `apps/web/angular.json` and fails because `proxyConfig` is missing. It checks that `projects.web.architect.serve.options.proxyConfig` is `proxy.conf.json`, and that the `production` serve configuration has no `proxyConfig`. Code: add `proxyConfig` to the `serve` target in `apps/web/angular.json`.

## 2. Checks and review

- [ ] **2.1 Full check.** Run `pnpm test` in `apps/web`, and paste the summary in the PR.
- [ ] **2.2 Manual check.** With the API running on port 8080 (`docker compose -f infra/docker/docker-compose.yml up -d`), start `pnpm web`, then run `POST http://localhost:4300/api/auth/login` with an empty body: the answer must be the API's 400, not 404. Sign in from the web app and record the result in the PR.
- [ ] **2.3 Translations.** No new keys: the PR description says "Translations to review: none".
