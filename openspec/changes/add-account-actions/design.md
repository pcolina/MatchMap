# Design: add-account-actions

## Contract baseline

The API contract baseline is `matchmap-api` `ca97e41`. `git -C C:\workspace\pablo\matchmap-api log --oneline ca97e41..HEAD -- contracts/` prints nothing, so the contract is unchanged. This change calls one existing operation: `POST /api/auth/logout` (`operationId: logout`), web client, no body, the refresh token is read from its cookie and the response clears it.

## Scope

Web only, phone-sized viewports as in `web-account-sheet`. The language row and the profile row stay presentational.

## What checks were made

- `AuthStore.signOut` (`apps/web/src/app/features/auth/state/auth.store.ts`) only clears the local state. It does not call the API.
- `SignInGateway` (same file) has `signIn`, `refresh` and `register`, and no `logout`. `AuthApi` (`apps/web/src/app/features/auth/data/auth.api.ts`) makes the `refresh` call over HTTP with the web client header. The `logout` call follows the same pattern.
- `packages/shared/src/mocks/logout.ts` already answers the logout operation in mock mode.
- `tokens/tokens.css` already applies the dark tokens under `:root[data-theme='dark']`, and the light tokens under `:root:not([data-theme='light'])` with the system dark media query. Setting `data-theme` on the root element is enough to force a mode, and removing it follows the system.
- `AccountSheet` (`apps/web/src/app/shared/account-sheet/account-sheet.ts`) is presentational: inputs `open`, `displayName`, `email`, `darkMode`, output `closed`.

## Decisions

### 1. Sign out: call, then always clear and go to sign-in

The API call is made through a new `logout()` method on `SignInGateway`, implemented by `AuthApi` with HTTP `POST /api/auth/logout`. `AuthStore` gets a `signOutRemote()` method that runs the call and then, whatever its result (`catchError` and `finalize`), runs the existing `signOut` and navigates to `/login`. The API call is the server half; the device half always runs, as specified.

The layout does not know the store: `MainLayout` passes an output `signOutPressed` from `AccountSheet` up, as it does for the account press. The store's method is called by a page-level handler, so components keep no business rules.

### 2. Theme state lives in one store, applied to the root element

A new `ThemeStore` (SignalStore, `apps/web/src/app/core/theme/theme.store.ts`, `providedIn: 'root'`) holds `choice: 'system' | 'light' | 'dark'`, read from `localStorage` at creation and written on change. It sets `document.documentElement.dataset['theme']` to `light` or `dark`, or removes it for `system`. It exposes `isDark` as a computed signal: when the choice is `system`, it reads `matchMedia('(prefers-color-scheme: dark)')`.

Every read and write of `localStorage` is wrapped in `try/catch`. When storage fails, the choice is kept in memory for the session, which is the case in `web-theme-mode`. The root element is the only place that changes; no component sets styles itself.

### 3. The switch is a presentational row

`AccountSheet` gets the input `darkMode` (already present) and an output `themeToggled`. `MainLayout` passes `ThemeStore.isDark()` and calls `ThemeStore.toggle()` on the output. The toggle stores the opposite of the mode now shown, so one press always changes the look.

### 4. About is a small native dialog inside the sheet

`AccountSheet` gets an output `aboutPressed`. The dialog is a separate component, `AboutDialog` (`apps/web/src/app/shared/about-dialog/about-dialog.ts`), with the same native `<dialog>` pattern as `AccountSheet`: `showModal()` in an effect, `cancel` for Escape, a backdrop tap closes it, and an output `closed`. It is presentational and takes the version as an input, so the constant lives in one place: `apps/web/src/app/core/app-version.ts`, exporting `appVersion = '1.0.0'`.

`MainLayout` holds `aboutOpen = signal(false)`, set by the sheet's `aboutPressed` output and cleared by `closed`. Focus returns to the about row because the dialog is opened from that button's press, as the sheet's own dialog does (`web-account-sheet` risks section).

### 5. Stacked modals

Two modal dialogs at once (the about dialog over the sheet) is a native behaviour: the top layer keeps the last opened dialog above, and Escape closes the top one only. The about dialog is opened while the sheet stays open, so closing about returns to the sheet with its focus on the about row.

### 6. Look

The about dialog uses the same surface, border and elevation tokens as the sheet. The version is in `--mm-color-accent`, as the owner asked. The name is a `title3` heading as in the sheet header.

## Files

- `apps/web/src/app/features/auth/state/auth.store.ts` (`signOutRemote`, `logout` on the gateway)
- `apps/web/src/app/features/auth/data/auth.api.ts` (`logout`)
- `apps/web/src/app/core/theme/theme.store.ts` (new)
- `apps/web/src/app/core/app-version.ts` (new)
- `apps/web/src/app/shared/about-dialog/about-dialog.ts` (+ `.css`, `.spec.ts`, new)
- `apps/web/src/app/shared/account-sheet/account-sheet.ts` (outputs `signOutPressed`, `themeToggled`, `aboutPressed`)
- `apps/web/src/app/shared/main-layout/main-layout.ts` and `.spec.ts`
- `apps/web/src/app/app.config.ts` (`ThemeStore` starts with the app)
- `packages/shared/src/mocks/logout.ts` (already present; mock test)
- `packages/shared/i18n/en.json`, `es.json` (`account.sheet.signOut` already present; new keys `about.title` and `about.close`)

## Tests (TDD)

- `ThemeStore`: default follows the system; a chosen mode is kept in storage and applied to `data-theme`; `toggle` flips the shown mode; storage errors keep the choice in memory.
- `AuthApi.logout`: one `POST /api/auth/logout` with the web client header (HTTP testing).
- `AuthStore.signOutRemote`: clears the token and navigates to `/login` after success and after failure.
- `AboutDialog`: shows `matchMap` and the version in the accent colour; Escape, close control and backdrop emit `closed`.
- `AccountSheet`: the sign-out, switch and about rows emit their outputs.
- `MainLayout`: about opens the dialog; the switch changes `data-theme`; sign out clears the session.
- Axe: the sheet with the about dialog open, no violations.
- Styles: the about version uses the accent token.

## Risks

- A failed `logout` call keeps the server session alive until the refresh token expires. The device still signs out, as specified, and the server session expires on its own. This is the trade-off of the approved decision.
- Two native dialogs: a cross-browser difference in closing the top dialog with Escape. Chrome and Edge, the MVP browsers, behave as described. The axe and focus tests cover the close path.

## Performance

No budget is affected. The new components are small.
