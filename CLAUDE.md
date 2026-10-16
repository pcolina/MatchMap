# CLAUDE.md

This file is the operating manual for Claude in this repository. The non-negotiable principles live
in `.specify/memory/constitution.md`. Read both before doing anything. If they ever conflict, the
constitution wins: stop and report the conflict.

Each app has its own manual, loaded when working inside it: `apps/api/CLAUDE.md`,
`apps/web/CLAUDE.md` and `apps/mobile/CLAUDE.md` (which includes the ng-native rules).

## 1. Product in one paragraph

MatchMap is a travel app for web and mobile. Users pin countries and cities (`VISITED`,
`WANT_TO_GO`, `LIVED`), see them on a world map, find friends, and compare maps with them: in
common, only me, only them, shared wishlist, trip ideas and a Jaccard compatibility score. The full
MVP scope is in `docs/mvp.md`. Anything not in that scope is out of scope unless a spec says
otherwise. Web and mobile implement each feature in separate specs (see §6).

## 2. Golden rules (read every session)

- **No code without an approved spec.** Every change belongs to a spec folder in `specs/` (see
  §6 for naming). The only exceptions are typo fixes and dependency bumps, and those still need
  the user's OK.
- **One spec at a time.** Only one spec is open in the whole repository. Never start another one
  until the current one is merged into `main`.
- **Stop at every SDD gate.** After `spec.md`, after `plan.md` and after `tasks.md`, stop and wait
  for the user to explicitly approve. Never chain phases.
- **Never guess.** If a requirement, behaviour, name, value or decision is missing or ambiguous,
  add `[NEEDS CLARIFICATION: <question>]` to the spec or plan, ask the user, and stop. This applies
  even during `/speckit-implement`. Do not pick a "reasonable default".
- **TDD always.** For every task, write the failing test, run it and show it failing, write the
  minimum code to make it pass, then refactor. Never write production code before its test.
- **Schema-first API.** Any API change starts in `contracts/graphql/`. Backend, web and mobile are
  updated after that.
- **One task = one commit.** Use Conventional Commits, in English.
- **Never** commit secrets, disable or skip tests, lower coverage thresholds, raise a performance
  budget without a justification in `plan.md`, edit applied Flyway migrations, or add a dependency
  the approved `plan.md` does not list.
- **Everything technical is in English:** code, identifiers, comments, commits, PRs, specs, plans
  and tasks. User-facing text is only ever an i18n key (see §8).

## 3. Repository layout (pnpm monorepo, independent deployables)

```
matchmap/
├── CLAUDE.md
├── .specify/                  # Spec Kit: memory/constitution.md, templates, scripts
├── .claude/skills/            # Spec Kit skills (/speckit-*)
├── specs/                     # One folder per feature: NNN-kebab-name/
├── docs/
│   ├── mvp.md
│   └── adr/                   # Architecture Decision Records (NNNN-title.md)
├── contracts/
│   └── graphql/               # *.graphqls: single source of truth for the API
├── packages/
│   └── shared/                # @matchmap/shared: platform-agnostic code for web and mobile
├── apps/
│   ├── api/                   # Java · Spring Boot · Spring for GraphQL (own Dockerfile)
│   ├── web/                   # Angular (Angular CLI), static build
│   └── mobile/                # ng-native: Angular + Expo + React Native
├── infra/
│   └── docker/                # docker-compose.yml for local dev (PostGIS, api)
└── .github/workflows/         # api.yml, web.yml, mobile.yml, contracts.yml (path-filtered)
```

- Each app builds, tests and deploys independently. `apps/api` produces its own Docker image.
  `apps/web` produces a static build. `apps/mobile` is distributed through the stores and is never
  containerised.
- Apps share code only through `contracts/` and `packages/*`. An app never imports from another
  app. `apps/api` never depends on `packages/*`.
- `packages/shared` holds what web and mobile both need and that does not draw anything: GraphQL
  operations and their generated types, the i18n catalogues, and pure functions. It never imports
  the DOM, `@ng-native/*`, Apollo, or any app.

## 4. Development environment (Windows, no WSL)

- The host OS is Windows. Write every shell command for PowerShell: use `.\gradlew.bat`, `\`
  paths and `$env:VAR`. Do not use bash-only syntax (`&&` chains in old PowerShell, `export`,
  `rm -rf`).
- Prerequisites, which Claude checks once at the start of A001 and reports on:
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
| Start DB (+ api) | `docker compose -f infra/docker/docker-compose.yml up -d` |
| Stop | `docker compose -f infra/docker/docker-compose.yml down` |
| API: run | `cd apps/api; .\gradlew.bat bootRun` |
| API: test | `cd apps/api; .\gradlew.bat test` |
| API: full check (format, lint, tests, coverage) | `cd apps/api; .\gradlew.bat check` |
| API: format | `cd apps/api; .\gradlew.bat spotlessApply` |
| Web: start | `pnpm web` |
| Web: build | `pnpm build:web` |
| Mobile: start | `pnpm mobile` |
| Mobile: Android | `pnpm android` |
| JS: test (all workspaces) | `pnpm test` |
| JS: typecheck | `pnpm typecheck` |
| JS: lint / format | `pnpm lint`; `pnpm format` |
| GraphQL types | `pnpm codegen` |
| Full check (all JS workspaces) | `pnpm check` |

The walking-skeleton specs (A001, W001, M001) create the commands that do not exist yet (`lint`,
`format`, `codegen`, `check` and everything in `apps/api`). If one is missing or fails, report it. Do not improvise an alternative.

Before marking any task done: run the full check of every app and package the task touched, and
paste a summary of the result.

## 6. Spec-Driven Development workflow (GitHub Spec Kit)

| Step | Command | Output | Gate |
|---|---|---|---|
| 1. Specify | `/speckit-specify` | `specs/NNN-name/spec.md`: user stories, acceptance criteria (Given/When/Then), out-of-scope items. No tech details. | Stop for approval |
| 2. Clarify | `/speckit-clarify` | Resolves every `[NEEDS CLARIFICATION]` with the user | Zero markers left |
| 3. Plan | `/speckit-plan` | `plan.md`, `research.md`, `data-model.md`, `contracts/` (GraphQL diff), `quickstart.md` | Stop for approval |
| 4. Tasks | `/speckit-tasks` | `tasks.md`: ordered, each task names its test first, `[P]` marks parallelisable tasks | Stop for approval |
| 5. Analyze | `/speckit-analyze` | Consistency check across spec, plan, tasks and constitution | Fix findings, then report |
| 6. Implement | `/speckit-implement` | One task at a time, TDD, one commit per task | Stop when `tasks.md` is done, then open a PR |

### Spec naming

| Prefix | Scope |
|---|---|
| `A` | API and GraphQL contract (`apps/api`, `contracts/graphql`) |
| `W` | Web app (`apps/web`, plus what it needs in `packages/shared`) |
| `M` | Mobile app (`apps/mobile`, plus what it needs in `packages/shared`) |
| none | Cross-cutting change to the plan or the architecture |

- The folder is `specs/<prefix><NNN>-<kebab-name>/` (`A003-pin-country-on-map`,
  `W003-pin-country-on-map`, `004-switch-map-provider`). The branch name equals the folder name.
- Each prefix has its own sequence of 3-digit numbers, independent of the others.
- `/speckit-specify` does not know about prefixes: before running it, Claude works out the next
  number for the prefix by scanning `specs/` and passes the folder explicitly as
  `SPECIFY_FEATURE_DIRECTORY=specs/<prefix><NNN>-<kebab-name>`.

### Rules

- Only one spec is open at a time across the whole repository (§2).
- Every spec has a "Depends on" section listing the specs it builds on (`W003` depends on
  `A003`). Web and mobile specs are separate even when their content overlaps, because
  accessibility, navigation and other details differ between platforms.
- Every acceptance criterion in `spec.md` maps to at least one test. `tasks.md` names that test.
- If implementation reveals that the spec or plan is wrong, stop, propose the change to the spec
  or plan, and wait for approval before continuing.
- Every architectural decision not already covered gets an ADR in `docs/adr/`, proposed in
  `plan.md`.

### Backlog

The planned order of specs is in `docs/mvp.md` §11, and the open product decisions in §10, each
assigned to the spec where it is resolved.

## 7. API contract (`contracts/graphql/`)

The API contract is described in `apps/api/CLAUDE.md` §2. Web and mobile never call the API
except through operations in `packages/shared` typed by `pnpm codegen`.

## 8. i18n (web and mobile)

- MVP languages: `es` (default) and `en`. The catalogues live in `packages/shared` and are used by
  both apps.
- No hard-coded user-facing strings. Every string is a key `feature.screen.element` (for example
  `compare.differences.onlyMeTitle`).
- When a task adds keys, Claude writes `es` and `en` translations and lists them in the PR
  description under "Translations to review". Translations are AI-generated and need the user's
  review before merge.
- Format dates and numbers with the locale. Get country names from the backend in the requested
  language (`Accept-Language`).
- Adding a language means adding one JSON file. No code changes.

## 9. Accessibility, responsiveness, performance and observability

- WCAG 2.2 AA plus the AAA criteria in constitution §VIII, on web and mobile. Every interactive
  element has a role and an accessible name, and tests query by role.
- Map colours are distinguishable for colour-blind users (add a pattern or outline) and meet the
  7:1 text contrast.
- Web supports Chrome and Edge and works from 320 px to wide desktop. Mobile works on phones and tablets in both orientations
  and follows the system font scale.
- Performance budgets (constitution §XIII) are enforced in CI. A budget is only raised with a
  justification in `plan.md`.
- The API logs with a correlation ID per request. Web and mobile report errors to the
  error-tracking service chosen in W001 and M001. No personal data, tokens or secrets in logs.

## 10. Git, commits and PRs

- Trunk-based: `main` is always green. Use one branch per spec, named like its folder
  (`W003-pin-country-on-map`), and squash-merge via PR.
- Conventional Commits in English: `feat(pins): add upsertPin mutation`. Types are `feat`, `fix`,
  `test`, `refactor`, `docs`, `chore`, `build`, `ci`. Scope is a module, an app or a package.
- One commit per task in `tasks.md`. Include the task id in the body (`Task: T012`).
- Claude may commit on the feature branch and open the PR. Claude never merges, force-pushes,
  rewrites `main` or deletes branches.
- The PR description includes a link to the spec, a list of completed tasks, the test summary, any
  schema changes, "Translations to review", and open questions.
- CI (GitHub Actions, path-filtered) runs, per app and package: format check, lint, typecheck,
  tests, coverage, build, architecture tests, accessibility checks, performance budgets,
  dependency and secret scanning; plus schema validation for `contracts/`. A PR is only ready
  when CI is green.

## 11. Definition of Done (per feature)

- [ ] Every acceptance criterion has a passing test.
- [ ] Every task in `tasks.md` is checked.
- [ ] Full check is green for every touched app and package. Coverage thresholds are met.
- [ ] GraphQL schema, backend and generated types in `packages/shared` are in sync.
- [ ] No hard-coded user-facing strings. `es` and `en` are complete.
- [ ] Accessibility checks pass, and new screens work at every supported size and orientation.
- [ ] Performance budgets are met.
- [ ] Any new ADRs are written. `quickstart.md` works on Windows/PowerShell.
- [ ] The PR is open with the template filled in, and no `[NEEDS CLARIFICATION]` or TODO is left
      in the code.

## 12. When to stop and ask (non-exhaustive)

Stop and ask if:

- Any requirement, copy text, validation rule, limit, colour, or error behaviour is not written
  down.
- You need a new dependency, a new module, a new package, or a change to the architecture or to
  the constitution.
- A spec, plan or task turns out to be wrong or contradictory.
- A command fails in a way that isn't fixed by the task at hand, or a prerequisite is missing.
- ng-native or Expo behaves differently from its documentation.
- Something would touch data privacy, security, or another user's data.
