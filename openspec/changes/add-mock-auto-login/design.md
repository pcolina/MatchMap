# Design: add-mock-auto-login

## Contract baseline

This change calls no API operation and adds no endpoint. It only changes start-up in the mock. The baseline for the contract check in `matchmap-api` is `ca97e41`. Any task that touches an API call must first run `git -C C:\workspace\pablo\matchmap-api log --oneline ca97e41..HEAD -- contracts/`.

## Approach

The flag is a second switch that exists only when the mock is on. It is passed from the start command to the app at build time (web) or at Metro start (mobile). At start-up, after the existing session restore, the app signs in as `one@matchmap.test` through the mocked sign-in, if no session was restored. Nothing changes in the mock logic, the contracts or the stores' public methods.

## Decisions

### 1. Argument parsing

`parseStartArgs` accepts exactly three argument lists: `[]`, `['mock']` and `['mock', '-l']`. Any other list, including `['-l']` and `['-l', 'mock']`, throws the usage error. The usage text becomes `Usage: pnpm web [mock [-l]]` and `Usage: pnpm mobile [mock [-l]]`.

The result object gains `autoLogin: boolean`. It is `true` only for `['mock', '-l']`.

### 2. Passing the flag to the apps

- **Web:** `buildServeArgs` adds `--define=MATCHMAP_AUTO_LOGIN=true` only when `autoLogin` is true, next to the existing `--define=MATCHMAP_MOCKS=true`. `apps/web/angular.json` gets a `MATCHMAP_AUTO_LOGIN` define set to `"false"` in the same configuration that sets `MATCHMAP_MOCKS`, so the build without the flag does not fail.
- **Mobile:** `buildExpoEnv` returns `EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN: 'true'` only when `autoLogin` is true, next to `EXPO_PUBLIC_MATCHMAP_MOCKS`.

Each app reads the flag in its own `mock-auto-login.ts`, next to `mock-flag.ts`:

- Web: `declare const MATCHMAP_AUTO_LOGIN: boolean | undefined;` and `autoLoginEnabled = mockEnabled && MATCHMAP_AUTO_LOGIN === true`.
- Mobile: `autoLoginEnabled = mockEnabled && process.env['EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN'] === 'true'`.

The `mockEnabled &&` part keeps the rule that the flag has no effect without the mock.

### 3. Credentials come from the mock data

The credentials are not written in the app. `packages/shared/src/mocks/auto-login.ts` exports a pure function `autoLoginCredentials(users)`, which takes the users array of `packages/shared/src/mocks/data/users.json` and returns `{ email, password }` for `one@matchmap.test`. It throws if that user is missing. Both apps call it with the users file, so changing the data file changes the auto sign-in, as the existing spec requires.

`packages/shared` stays free of DOM and app code, and the function is pure, so it is unit-tested there.

### 4. Sign-in at start-up

The web and mobile initialisers already call `store.restore()` and wait for `sessionChecked`. With `autoLoginEnabled`, they add one step after that wait:

1. If `accessToken` is set (a session was restored), do nothing.
2. Otherwise call `store.signIn(autoLoginCredentials(users))`.
3. Resolve the initializer when `status` leaves `'loading'`, so the router does not show the sign-in page while the sign-in runs.

The step is a function `autoSignIn(store, credentials, enabled, injector)` in each app's `core/mocks/`. It returns a promise and is unit-tested with a fake store. The `injector` argument is needed by `toObservable`, which waits for the status to leave `loading`; the signature was extended with it during task 4. The initialisers call it only when `autoLoginEnabled` is true. Without the flag, the initialiser code is the same as today.

This keeps the approved behaviour:

- A reload after a successful session restores it, and the app stays signed in.
- After sign-out, the refresh token is gone, so the next start runs the sign-in again.
- The mocked sign-in gives the same token response as a typed sign-in, including the refresh token for mobile and the refresh cookie for web, so `restore` works on the next start.

If the sign-in fails, the store sets `failure`, the sign-in page is shown, and nothing retries. No new error copy is added.

### 5. Files

Shared:

- `packages/shared/src/mocks/auto-login.ts`, with `autoLoginCredentials`.

Scripts:

- `apps/web/scripts/start-args.mjs` and `apps/web/scripts/start-command.mjs`.
- `apps/web/angular.json` (the `MATCHMAP_AUTO_LOGIN` define).
- `apps/mobile/scripts/start.mjs`.

Web:

- `apps/web/src/app/core/mocks/mock-auto-login.ts`.
- `apps/web/src/app/core/mocks/auto-sign-in.ts`.
- `apps/web/src/app/app.config.ts` (the restore initializer).

Mobile:

- `apps/mobile/src/app/core/mocks/mock-auto-login.ts`.
- `apps/mobile/src/app/core/mocks/auto-sign-in.ts`.
- `apps/mobile/src/main.ts` (the restore initializer).

Documentation:

- `README.md`, the two "With mocks" sections.

No change to `Mock-system.md`: no operation is added or removed.

### 6. Tests (TDD)

Each row is written and run failing before its code.

| Unit | Test file | Scenarios covered |
|---|---|---|
| `autoLoginCredentials` | `packages/shared/test/mocks-auto-login.spec.ts` | Returns the email and password of `one@matchmap.test`. Throws when the user is missing. |
| Web `parseStartArgs` | `apps/web/scripts/start-args.test.mjs` | `mock -l` gives `autoLogin` true. `-l` alone and `-l mock` throw. `mock` alone gives false. |
| Web `buildServeArgs` | `apps/web/scripts/start-command.test.mjs` | `--define=MATCHMAP_AUTO_LOGIN=true` only with `autoLogin`. |
| Mobile `parseStartArgs` and `buildExpoEnv` | `apps/mobile/scripts/start.test.mjs` | Same parsing cases. `EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN` only with `autoLogin`. |
| Web `autoLoginEnabled` | `apps/web/src/app/core/mocks/mock-auto-login.spec.ts` | False without the mock flag. True with both flags. |
| Web `autoSignIn` | `apps/web/src/app/core/mocks/auto-sign-in.spec.ts` | Skips when a session exists. Signs in with the credentials when none exists. Resolves after the sign-in ends, with or without failure. |
| Mobile `autoLoginEnabled` and `autoSignIn` | `apps/mobile/src/app/core/mocks/mock-auto-login.test.ts` and `auto-sign-in.test.ts` | Same cases as web. |

Scenario "Flag applies at every start" (reload after sign-out) is covered by the `autoSignIn` test "signs in when no session exists", since the restore step has already failed at that point.

The `readme.test` files in web and mobile check the README text for `-l`, if the existing README tests cover the mock sections.

## Risks

- Angular's `--define` only replaces identifiers in code. The `declare const` in the web flag file must stay a plain identifier, as it is for `MATCHMAP_MOCKS` today.
- Expo reads `EXPO_PUBLIC_*` variables when Metro starts. Changing `-l` needs a restart of `pnpm mobile`, as with the existing flag.

## Performance

No budget is affected. The sign-in runs once at start-up, against the in-memory mock.

## Scope addition: mobile start-up error

### Status

The root cause is confirmed (see below). The fix is proposed, and needs approval before implementation.

### Root cause (confirmed by the diagnostic)

- The mobile bundle is compiled to Hermes bytecode with `transform.bytecode=1` and `excludeSource=true`.
- In that bytecode, `Function.prototype.toString` of a class returns `function TranslateLoader() { [bytecode] }`, not `class TranslateLoader ...`. Logcat showed this for `TranslateLoader`, `TranslateService` and `MissingTranslationHandler`.
- `@ngx-translate/core` 18.0.0 decides whether a default provider is a class with `isClass`, which checks `/^class\s/` on that text. The check is false, so the class is registered as `useFactory`.
- Angular calls that factory as a plain function, and Hermes throws `Class constructor invoked without new`. The first token is `TranslateLoader`, inside the `TranslateService` field initializers, so the error is raised at `inject(TranslateService)` in `main.ts`.
- The Node reproduction could not show this, because in Node `toString` returns the real source. That is why the earlier attempt did not reproduce it.

### Fix options

1. **Pass factory functions for the four plugin slots in `main.ts`** (recommended). The slots `loader`, `compiler`, `parser` and `missingTranslationHandler` receive `() => new ...()`. A function that is not a class is registered with `useFactory`, which is called correctly. No dependency changes, and the change is limited to `apps/mobile/src/main.ts`.
2. Upgrade `@ngx-translate/core` to a version whose `isClass` does not depend on `toString`. This changes a dependency, so it needs your approval as `CLAUDE.md` §2 and §12 require. Its effect on Hermes bytecode is not checked yet.
3. Disable bytecode in the Metro configuration. This changes the build pipeline for every app, so it is not proposed.

Option 1 is approved. The providers move to `apps/mobile/src/app/core/i18n/translate-providers.ts`, so that a test can import them. `main.ts` keeps the same behaviour and only lists the module. The approach is confirmed by the test below before the code is written.

### What has been checked

- **Symptom.** The app shows the red screen `Uncaught Error: Class constructor invoked without new`. The error is thrown at `inject(TranslateService)` in the translation initializer of `apps/mobile/src/main.ts`. Logcat shows `ReactNativeJS: [TypeError: Class constructor invoked without new]` without a stack.
- **Not caused by this change.** The same message is in logcat from 2026-11-09, before this change. It also appears when `main.ts` is the `main` branch version, with none of the changes of this change.
- **Ruled out: `isClass` in `@ngx-translate/core` 18.0.0.** `provideTranslateService` chooses `useClass` or `useFactory` with `isClass`, which reads `Function.prototype.toString`. In the Metro bundle served on port 8081, `TranslateDefaultParser`, `TranslateNoOpLoader`, `TranslateNoOpCompiler`, `DefaultMissingTranslationHandler` and `TranslateStore` are all native `class` declarations, so `isClass` returns true for them.
- **Not usable: a Node reproduction with Vitest.** Injecting `TranslateService` in a plain environment injector fails earlier with NG0203 (`inject()` outside an injection context). That is a fault of the probe, not the reported error, so it proves nothing about the reported error.

### Next step: diagnostic, no commit

1. In `apps/mobile/src/main.ts`, wrap `inject(TranslateService)` in a temporary `try/catch` that logs `error.stack` with `console.error`. Rebuild and read the stack with `adb logcat -s ReactNativeJS:E`.
2. Revert the temporary change. It is never committed.
3. Record the root cause in this section, with the file and line that call the class without `new`.

No fix is chosen before step 3. The options will be written here once the cause is known.

### Test strategy (depends on the cause)

- The regression test is a Vitest test in `apps/mobile`. It runs the translation providers and the translation initializer in an injection context, with the component injector from `@ng-native/testing` `render`, as in the `autoSignIn` tests.
- Node returns the real source for classes, so the test must simulate the Hermes behaviour: while it runs, `Function.prototype.toString` returns `function <name>() { [bytecode] }` for classes. Without that simulation the test cannot fail.
- Before the fix, the test must fail with `Class constructor invoked without new`. This must be confirmed before writing the fix.
- The scenarios of the `mobile-startup` spec are mapped to tests in `tasks.md` after this section is complete.
