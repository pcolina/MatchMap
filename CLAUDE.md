# CLAUDE.md

This file is the operating manual for any AI coding agent working in this repository. Claude Code
loads it directly. Every rule lives here.

Each app has its own manual, loaded when working inside it: `apps/web/AGENTS.md` and
`apps/mobile/AGENTS.md` (which includes the ng-native rules).

## 1. Product in one paragraph

MatchMap is a travel app for web and mobile. Users pin countries and cities (`VISITED`,
`WANT_TO_GO`, `LIVED`), see them on a world map, find friends, and compare maps with them: in
common, only me, only them, shared wishlist, trip ideas and a Jaccard compatibility score. Anything
not in an approved change is out of scope. The app and the web app on phone-sized screens share one
design and one behaviour, so each feature is specified once for both. Only the web layouts for
iPad and for laptop get their own spec each (see §6).

## 2. Golden rules (read every session)

- **No code without an approved change.** Every change belongs to a folder in
  `openspec/changes/` (see §6). The only exceptions are typo fixes and dependency bumps, and those
  still need the user's OK.
- **One change at a time.** Only one change is open in the whole repository. Never start another
  one until the current one is archived.
- **Stop at every gate.** After `proposal.md`, after the specs, after `design.md` and after
  `tasks.md`, stop and wait for the user to explicitly approve. Never chain phases.
- **Never guess.** If a requirement, behaviour, name, value or decision is missing or ambiguous,
  add `[NEEDS CLARIFICATION: <question>]` to the artifact, ask the user, and stop. This applies even
  during implementation. Do not pick a "reasonable default".
- **TDD always.** For every task, write the failing test, run it and show it failing, write the
  minimum code to make it pass, then refactor. Never write production code before its test.
- **Schema-first API.** Any API change starts in `contracts/` (`graphql/` for domain operations,
  `openapi/` for HTTP endpoints). Backend, web and mobile are updated after that.
- **One task = one commit.** Write the commit message in English, as §10 describes.
- **Never** commit secrets, disable or skip tests, lower coverage thresholds, raise a performance
  budget without a justification in the change's `design.md`, edit applied Flyway migrations, or add
  a dependency that the approved change does not list.
- **Everything technical is in English:** code, identifiers, comments, commits, PRs, specs, designs
  and tasks. User-facing text is only ever an i18n key (see §8).

## 3. Repository layout (pnpm monorepo, independent deployables)

```
matchmap/
├── CLAUDE.md                  # Operating manual for AI agents and Claude Code
├── openspec/
│   ├── config.yaml            # Project context and rules for every artifact
│   ├── changes/               # One folder per change in progress; archive/ when done
│   └── specs/                 # Approved behaviour, one folder per capability
├── docs/
│   ├── brand.md               # Brand, voice and the reason for the product
│   ├── design.md              # Visual rules: colour, type, spacing, components
│   ├── design-kit.md          # Logo, icon and font guide from the design kit
│   └── stores/                # App Store and Google Play icons
├── tokens/                    # tokens.json (source), tokens.ts and tokens.css (generated)
├── logo/                      # Logo symbol and lockups
├── contracts/
│   ├── graphql/               # *.graphqls: domain operations (default)
│   └── openapi/               # *.yaml (OpenAPI 3.1): HTTP endpoints where GraphQL does not fit
├── packages/
│   └── shared/                # @matchmap/shared: platform-agnostic code for web and mobile
├── apps/
│   ├── api/                   # Java · Spring Boot · Spring for GraphQL (own Dockerfile)
│   ├── web/                   # Angular (Angular CLI), static build
│   └── mobile/                # ng-native: Angular + Expo + React Native
├── infra/
│   └── docker/                # docker-compose.yml for local dev (PostGIS, api, contract viewer)
└── .github/workflows/         # api.yml, web.yml, mobile.yml, contracts.yml (path-filtered), secrets.yml, dependencies.yml
```

- Each app builds, tests and deploys independently. `apps/api` produces its own Docker image.
  `apps/web` produces a static build. `apps/mobile` is distributed through the stores and is never
  containerised.
- Apps share code only through `contracts/` and `packages/*`. An app never imports from another
  app. `apps/api` never depends on `packages/*`.
- `packages/shared` holds what web and mobile both need and that does not draw anything: GraphQL
  operations and their generated types, the i18n catalogues, and pure functions. It never imports
  the DOM, `@ng-native/*`, Apollo, or any app.
- State management in `apps/web` and `apps/mobile` uses `@ngrx/signals` (SignalStore) for state
  and derived state. RxJS is used only for asynchronous streams (Apollo observables, debounced input,
  timers), and it enters a store through `rxMethod` from `@ngrx/signals/rxjs-interop`. The classic
  `@ngrx/store` is not used. Pages read store signals; components never subscribe to RxJS streams.

## 4. Development environment (Windows, no WSL)

- The host OS is Windows. Write every shell command for PowerShell: use `.\gradlew.bat`, `\`
  paths and `$env:VAR`. Do not use bash-only syntax (`&&` chains in old PowerShell, `export`,
  `rm -rf`).
- Prerequisites, which the agent checks before the first change and reports on:
  - Node ≥ 22.18 (`node -v`) and pnpm ≥ 11 (`pnpm -v`; install with `corepack enable`).
  - JDK 25 (`java -version`).
  - Docker Desktop running (`docker info`). Local PostGIS and Testcontainers need it. If it is
    missing, stop and ask the user to install it.
  - Android Studio with an x86_64 emulator (API 35+), or an Android phone on the same Wi-Fi.
  - Chrome and Edge, the only browsers the web app supports in the MVP.
  - The map uses a native module that Expo Go does not include, so mobile runs as a development
    build, not in Expo Go. There is no iOS simulator on Windows: iOS needs EAS Build and an Apple
    Developer account.
- The MVP runs locally only: nothing is deployed to a server or published to a store.
- Dependencies are always installed from the repo root (`pnpm install`), never inside an app.
- Secrets go in `.env` files, which are git-ignored. Every `.env` has a committed `.env.example`
  with dummy values.

## 5. Commands

Run from the repo root unless noted.

| Purpose | Command |
|---|---|
| Install JS dependencies | `pnpm install` |
| Start DB, API and contract viewer | `docker compose -f infra/docker/docker-compose.yml up -d --build` |
| Stop | `docker compose -f infra/docker/docker-compose.yml down` |
| API: run | `cd apps/api; .\gradlew.bat bootRun` |
| API: test | `cd apps/api; .\gradlew.bat test` |
| API: full check (format, lint, tests, coverage) | `cd apps/api; .\gradlew.bat check` |
| API: format | `cd apps/api; .\gradlew.bat spotlessApply` |
| API: performance budget (local) | `cd apps/api; .\gradlew.bat performanceTest` |
| Web: start | `pnpm web` |
| Web: build | `pnpm build:web` |
| Mobile: start | `pnpm mobile` |
| Mobile: Android | `pnpm android` |
| JS: test (all workspaces) | `pnpm test` |
| JS: typecheck | `pnpm typecheck` |
| JS: lint / format | `pnpm lint`; `pnpm format` |
| API client types (GraphQL and OpenAPI) | `pnpm codegen` |
| Full check (all JS workspaces) | `pnpm check` |

If a command in this table is missing or fails, report it. Do not improvise an alternative.

Before marking any task done: run the full check of every app and package the task touched, and
paste a summary of the result.

## 6. Spec-driven workflow (OpenSpec)

Each change lives in `openspec/changes/<kebab-name>/` and goes through these artifacts in order.
`openspec/config.yaml` holds the project context and the rules every artifact must follow.

| Step | Artifact | Content | Gate |
|---|---|---|---|
| 1. Proposal | `proposal.md` | Why, What Changes, Capabilities (new or modified), **Out of scope**, **Depends on** (existing specs or changes, or `None`) | Stop for approval |
| 2. Specs | `specs/<capability>/spec.md` | Requirements with scenarios (WHEN / THEN / AND). Every scenario concrete enough to map to a test | Stop for approval; zero `[NEEDS CLARIFICATION]` left |
| 3. Design | `design.md` | Technical decisions and approach, only when the change needs them | Stop for approval |
| 4. Tasks | `tasks.md` | Ordered tasks. Each task names the failing test first, then the code that makes it pass | Stop for approval |
| 5. Implement | code and tests | One task at a time, TDD, one commit per task | Stop when `tasks.md` is done, then open a PR |
| 6. Archive | `openspec/specs/` and `openspec/changes/archive/` | The change's specs are merged into `openspec/specs/` and the change folder moves to `archive/` | After the PR is merged |

### Rules

- Only one change is open at a time across the whole repository (§2).
- Every scenario maps to at least one automated test, and `tasks.md` names that test.
- The app and the web app on phone-sized screens have the same design and behaviour, so a feature
  is one change with one spec. Its platform-specific implementation details (ng-native or DOM,
  token storage) are written in its `design.md`, not as a second spec.
- The web layout for iPad and the web layout for laptop each get their own spec, in their own change.
  The app on tablets follows the phone spec.
- If implementation reveals that a spec or design is wrong, stop, propose the change to it, and
  wait for approval before continuing.
- Architectural decisions go in the change's `design.md`.

## 7. API contracts (`contracts/`)

The API contracts are described in `apps/api/AGENTS.md` §2: GraphQL in `contracts/graphql/` for
domain operations, OpenAPI in `contracts/openapi/` for the HTTP endpoints where GraphQL does not
fit. Web and mobile never call the API except through operations and endpoints in
`packages/shared` typed by `pnpm codegen`.

Data validation (required fields, length, format and the other data rules) is done on both sides:
in the API and in the clients (web and mobile). The API is the authority and validates every
request. The clients validate the same rules for immediate feedback, and copy them from the API
(`matchmap-api`: its contracts and its validation code). A client never invents a rule the API does
not enforce. If a rule is wanted and the API lacks it, the change records it as a
`[NEEDS CLARIFICATION]` and the API change is updated.

## 8. i18n (web and mobile)

- MVP languages: `en` (default) and `es`. The catalogues live in `packages/shared` and are used by
  both apps.
- The web app starts in the browser language when it is `en` or `es`, and in `en` otherwise.
- No hard-coded user-facing strings. Every string is a key `feature.screen.element` (for example
  `compare.differences.onlyMeTitle`).
- When a task adds keys, the agent writes `es` and `en` translations and lists them in the PR
  description under "Translations to review". Translations are AI-generated and need the user's
  review before merge.
- Format dates and numbers with the locale. Get country names from the backend in the requested
  language (`Accept-Language`).
- Adding a language means adding one JSON file. No code changes.

## 9. Accessibility, responsiveness, performance and observability

- WCAG 2.2 AA on web and mobile. Every interactive element has a role and an accessible name, and
  tests query by role.
- Map states are distinguishable without colour (pattern, outline or opacity). Text on the map meets
  4.5:1 contrast and graphical boundaries meet 3:1 (see `docs/design.md` §2.2).
- Web supports Chrome and Edge and works from 320 px to wide desktop. Mobile works on phones and
  tablets in both orientations and follows the system font scale.
- Performance budgets are enforced in CI. A budget is only raised with a justification in the
  change's `design.md`.
- The API logs with a correlation ID per request. Web and mobile report errors to the
  error-tracking service chosen in the change that adds error reporting. No personal data, tokens or
  secrets in logs.

## 10. Git, commits and PRs

- Trunk-based: `main` is always green. Use one branch per change, named like its folder
  (`add-user-accounts`), and squash-merge via PR.
- Commit subjects are short imperative sentences in English, with no prefix
  (`Add upsertPin mutation`). The branch and the change it belongs to give the context. PR titles
  follow the same rule.
- One commit per task in `tasks.md`. Include the task id as written in `tasks.md` in the body
  (`Task: 2.1`).
- The agent may commit on the feature branch and open the PR. The agent never merges, force-pushes,
  rewrites `main` or deletes branches.
- The PR description includes a link to the change, a list of completed tasks, the test summary, any
  schema changes, "Translations to review", and open questions.
- CI (GitHub Actions, path-filtered) runs, per app and package: format check, lint, typecheck,
  tests, coverage, build, architecture tests, accessibility checks, performance budgets,
  dependency and secret scanning; plus schema validation and breaking-change detection for
  `contracts/`. Secret scanning (`secrets.yml`) and the dependency scan (`dependencies.yml`) run on
  every PR, whatever it touches. A PR is only ready when CI is green. Until deployment is in scope,
  breaking-change detection and the dependency scan only report, and the API performance budget runs
  locally.

## 11. Definition of Done (per change)

- [ ] Every scenario has a passing test.
- [ ] Every task in `tasks.md` is checked.
- [ ] Full check is green for every touched app and package. Coverage thresholds are met.
- [ ] GraphQL schema, backend and generated types in `packages/shared` are in sync.
- [ ] No hard-coded user-facing strings. `es` and `en` are complete.
- [ ] Accessibility checks pass, and new screens work at every supported size and orientation.
- [ ] Performance budgets are met.
- [ ] The change is archived into `openspec/specs/`.
- [ ] The PR is open with the template filled in, and no `[NEEDS CLARIFICATION]` or TODO is left
      in the code.

## 12. When to stop and ask (non-exhaustive)

Stop and ask if:

- Any requirement, copy text, validation rule, limit, colour, or error behaviour is not written
  down.
- You need a new dependency, a new module, a new package, or a change to the architecture or to
  the rules in this file.
- A spec, design or task turns out to be wrong or contradictory.
- A command fails in a way that isn't fixed by the task at hand, or a prerequisite is missing.
- ng-native or Expo behaves differently from its documentation.
- Something would touch data privacy, security, or another user's data.

## 13. Design (brand and visual rules)

- Brand and voice live in `docs/brand.md`. Visual rules live in `docs/design.md`. Read both before creating or changing any UI.
- Design tokens: `apps/mobile/src/app/core/theme/tokens.ts`, generated from `tokens/tokens.json`. Never hard-code a colour, font, size, radius or spacing. Always import a token.
- One accent colour only (`accent`). Max one primary button per screen. Every screen must work in light and dark mode.
- WCAG AA minimum. Map states must be distinguishable without colour (outline or pattern, see `docs/design.md` §2.2).
- If a visual decision is not covered by `docs/design.md`, stop and ask. Do not invent colours, sizes or components.
