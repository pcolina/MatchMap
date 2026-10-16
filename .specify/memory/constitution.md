# MatchMap Constitution

These principles are non-negotiable. Specs, plans, tasks and code MUST comply with them.
`/speckit-analyze` checks against them.

## Core Principles

### I. Spec Before Code

No production code is written without an approved `spec.md`, `plan.md` and `tasks.md` for its
feature. Each SDD phase ends with a human approval gate.

### II. No Assumptions

Ambiguity is resolved by asking the owner and never by guessing. Open questions are marked
`[NEEDS CLARIFICATION]` and block progress until they are answered.

### III. Test-First (Strict TDD)

Every behaviour is driven by a failing test. Every acceptance criterion maps to at least one
automated test. Coverage floors:

- API domain + application ≥ 80 %, API overall ≥ 70 %
- `packages/*` ≥ 80 %
- Web and mobile `state/` + pure logic ≥ 80 %

Tests are never skipped or deleted to make a build pass.

### IV. Contract-First API

`contracts/graphql/*.graphqls` is the single source of truth. API changes start there. Business
errors are typed unions. Growing lists use Relay cursor pagination. Breaking changes require
explicit approval.

### V. Clean Boundaries

The API is a modular monolith with hexagonal modules. The domain layer is framework-free, and
modules interact only through ports or events. Web and mobile features separate data (Apollo),
state (SignalStore) and UI. Shared packages under `packages/` are platform-agnostic: they never
depend on the DOM, on `@ng-native/*`, or on any app. The boundaries are enforced by automated
architecture tests.

### VI. Privacy by Default

Users' maps default to `FRIENDS` visibility. The server enforces every access rule on another
user's data. Personal data is minimised, exportable and deletable (GDPR). Secrets are never
committed.

### VII. Internationalised from Day One

There are no hard-coded user-facing strings. The MVP ships in Spanish (default) and English.
Adding a language must require no code changes. AI-generated translations are reviewed by a human
before merge.

### VIII. Accessible by Default

Web and mobile meet WCAG 2.2 level AA (EN 301 549). In addition, these AAA criteria are mandatory:
enhanced contrast 7:1 for text (1.4.6), touch/pointer targets of at least 44×44 (2.5.5) and no
timing limits (2.2.3). Every interactive element has an accessible role and name (ARIA on web,
accessibility props on mobile), and tests query by role. Web pages pass automated axe checks;
screens are checked with VoiceOver and TalkBack before each release.

Layouts are responsive: the web app works from 320 px to wide desktop screens, and the mobile app
works on phones and tablets in both orientations. Mobile text follows the system font scale.
Breakpoints and layout variants are defined in each feature's spec.

### IX. Independent Deployability

The repo is a pnpm monorepo, but each app builds, tests and deploys on its own. The API ships as
its own container image. The web app ships as a static build. The mobile app ships through the
app stores. Apps share only `contracts/` and `packages/*`; an app never imports from another app.

### X. Simplicity and MVP Discipline

Only build what the current spec requires. Dependencies are added only when approved in
`plan.md`. Prefer boring, well-supported technology. ng-native, being alpha, is pinned to exact
versions. Problems with it are reported upstream; a workaround is allowed only if it is documented
in an ADR and removed once the upstream fix ships.

### XI. English for Engineering

Code, comments, commits, PRs and specs are written in English.

### XII. Secure by Design

The API and apps meet OWASP ASVS level 2. The web app is served with strict security headers
(Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy). Every PR runs a
dependency vulnerability scan and secret scanning; known high or critical vulnerabilities block
the merge unless an ADR accepts the risk with an expiry date.

### XIII. Performance Budgets

The web app meets "good" Core Web Vitals at the 75th percentile: LCP < 2.5 s, INP < 200 ms and
CLS < 0.1. Bundle size budgets are kept in `angular.json` and the build fails when they are
exceeded; a budget is only raised with a justification in the feature's `plan.md`. The mobile app has a cold-start budget,
set in a `plan.md` once a baseline has been measured and only raised with a justification there,
and scrolling lists hold 60 fps.

### XIV. Observable in Production

The API emits structured logs with a correlation ID per request. Web and mobile report unhandled
errors and crashes to an error-tracking service. Logs, traces and error reports never contain
personal data, tokens or secrets.

## Governance

This constitution supersedes all other practices. Changing it requires the owner's explicit
approval and an ADR in `docs/adr/`.

Versioning follows semver:

- **MAJOR**: removing or redefining a principle.
- **MINOR**: adding a principle or materially expanding one.
- **PATCH**: wording clarifications.

Every `plan.md` includes a Constitution Check against these principles, and `/speckit-analyze`
reports any violation before implementation starts. Complexity Tracking in `plan.md` may justify
added complexity, but never a violation of a principle; a violation requires amending this
constitution first.

Every PR runs, in CI, lint, typecheck, tests, coverage floors, architecture tests, accessibility
checks, performance budgets and security scans for the apps and packages it touches. Nothing
merges while any of them fails, and no check is disabled to make a PR pass.

**Version**: 1.0.0 | **Ratified**: 2026-10-16 | **Last Amended**: 2026-10-16
