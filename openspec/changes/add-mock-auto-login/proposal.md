# Proposal: add-mock-auto-login

## Why

Running the web and mobile apps with the mock means typing an email and password on every start, even when the work is on a screen behind the login. The `-l` flag starts the mock with a session already open, so the developer lands on the signed-in app at once.

## What Changes

- `pnpm web mock -l` starts the web app with the mock flag on and a session already open for `one@matchmap.test`.
- `pnpm mobile mock -l` does the same for the mobile app.
- The session is created by the mock login itself, with the same token response a typed sign-in would get, so the rest of the app sees a normal signed-in state.
- `-l` is accepted only together with `mock`. `-l` alone, or any other argument, is a usage error, as today.
- Without `-l`, start-up behaves exactly as now: the login screen is shown.
- The root `README.md` documents the flag in both "With mocks" sections: "Run the web app" (around `pnpm web mock`) and "Run the mobile app" (around `pnpm mobile mock`). It states that `-l` signs in as `one@matchmap.test` and that it needs `mock`.

## Scope addition: start-up error in the mobile app

Testing `-l` on the Android emulator showed an uncaught error at start-up, before any sign-in. The app shows the red error screen "Class constructor invoked without new" at the translation initializer in `apps/mobile/src/main.ts` (`inject(TranslateService)`, which runs before the sign-in initializer). The same error appears when `main.ts` is replaced with the `main` branch version, so it already existed in `main` and this change does not cause it.

This change adds:

- Find the cause of the error. The cause is not known yet: `TranslateService` is injected the same way in the web app, where the error does not appear.
- Fix it in `apps/mobile` so that the app starts without an uncaught error on the Android emulator. The fix is written in `design.md` once the cause is known, with a test that reproduces it.
- A scenario in the mobile start-up spec: the app starts without an uncaught error and shows the sign-in page or, with `-l`, the signed-in screen.

The approach is not chosen yet. It depends on the cause, and it will be proposed in `design.md` before any code changes.

## Capabilities

- Modified: `api-mocks` (new requirement for auto sign-in at start-up).
- New: `mobile-startup` (the mobile app starts without an uncaught error, for the start-up scenario added in this change). The choice is mine, since the scenario is not about the mock.

## Out of scope

- Choosing the user: `-l` always uses `one@matchmap.test`. A user option (`two@matchmap.test`, or any other) is not part of this change.
- Auto sign-in against the real API. `-l` works only with the mock flag on.
- Skipping the guard without a session. The app always gets a real mock session when `-l` is set.
- Google sign-in and registration.
- Any change to the contracts in `matchmap-api`, to `packages/shared` operations, or to the mock data files.
- Production builds. The flag is a development start option.

## Depends on

- `api-mocks` (main spec, merged from the archived change `2026-11-21-add-mock-system`).
- The start scripts `apps/web/scripts/start-args.mjs` and `apps/mobile/scripts/start.mjs`, which today accept only `mock`.
