# Tasks: add-account-actions

Each task starts with its failing test, run and shown failing before the code. Each task is one commit with its id in the body (`Task: 1.1`). Web only.

## 1. Sign out

- [x] **1.1 Test first.** `apps/web/src/app/features/auth/data/auth.api.logout.spec.ts`: `AuthApi.logout()` sends one `POST /api/auth/logout` with the web client header and no body. Run it and show it failing.
- [x] **1.2 Code.** `logout()` on `SignInGateway` and `AuthApi`. Run the test and show it passing.
- [x] **1.3 Test first.** `auth.store.spec.ts`: `signOutRemote()` clears the access token and navigates to `/login` after a successful logout, and does the same after a failed one. Run it and show it failing.
- [x] **1.4 Code.** `signOutRemote()` in `AuthStore`: calls the gateway, and in `finalize` runs `signOut` and navigates. Run the test and show it passing.

## 2. Day or night mode

- [x] **2.1 Test first.** `apps/web/src/app/core/theme/theme.store.spec.ts`: with no saved choice the mode follows `prefers-color-scheme`; a saved choice is kept in `localStorage` and survives a new store; `toggle()` flips the mode shown; `data-theme` on the root element follows the choice, and is removed for `system`; a failing storage keeps the choice in memory. Run it and show it failing.
- [x] **2.2 Code.** `theme.store.ts` with `try/catch` around storage. Run the test and show it passing.
- [x] **2.3 Test first.** The store applies the mode when the app starts: a spec that creates the store through the app initializer shows `data-theme` set before the first render. Run it and show it failing.
- [x] **2.4 Code.** `provideAppInitializer` in `app.config.ts` that injects `ThemeStore`. Run the test and show it passing.

## 3. Translations

- [x] **3.1 Test first.** `packages/shared/test/account-about-i18n.spec.ts`: `account.about.close` and `account.about.version` exist in `en.json` and `es.json`, non-empty. Run it and show it failing.
- [x] **3.2 Code.** Add the two keys to both files. Spanish is listed under "Translations to review" in the PR. Run the test and show it passing.

## 4. About dialog

- [x] **4.1 Test first.** `apps/web/src/app/shared/about-dialog/about-dialog.spec.ts`: the dialog is modal and named `matchMap`; it shows the version `1.0.0` in the accent colour (style check); Escape, the close control and a backdrop tap each emit `closed`. Run it and show it failing.
- [x] **4.2 Code.** `about-dialog.ts` and `.css` (native dialog, same pattern as the account sheet), and `apps/web/src/app/core/app-version.ts` with `appVersion = '1.0.0'`. Run the test and show it passing.

## 5. Sheet outputs

- [x] **5.1 Test first.** `account-sheet.spec.ts`: pressing sign out emits `signOutPressed`; pressing the day or night row emits `themeToggled`; pressing about emits `aboutPressed`; the switch row keeps `aria-checked` from `darkMode`. Run it and show it failing.
- [x] **5.2 Code.** Three outputs in `account-sheet.ts` and the `click` bindings. Run the test and show it passing.

## 6. Main layout wiring

- [x] **6.1 Test first.** `main-layout.spec.ts`: pressing about opens the about dialog and `closed` closes it, with focus back on the about row; pressing the switch sets `data-theme` to the other mode; pressing sign out clears the access token and shows `/login`. Run it and show it failing.
- [x] **6.2 Code.** `MainLayout` holds `aboutOpen`, calls `ThemeStore.toggle()` and `AuthStore.signOutRemote()`, and places `app-about-dialog`. Run the test and show it passing.

## 7. Accessibility

- [x] **7.1 Test first.** `accessibility.spec.ts`: the sheet with the about dialog open has no axe violations. Run it and show it failing if there is a violation, or show it passing with the entry added first.
- [x] **7.2 Code.** Fix any violation axe reports. Run the test and show it passing.

## 8. Checks

- [x] **8.1 Full check.** `pnpm check` and `pnpm build:web` from the repo root, with the summary in the PR.
- [x] **8.2 Owner visual check.** Light and dark mode, the switch, the about dialog and sign out at 320, 360 and 600 px. Done by the owner.

## 10. The map follows the app mode (added after the owner asked)

The owner asked that the day or night switch also changes the map and the whole app. The approved spec already says the whole app changes. The map followed only the system setting, so this section fixes it.

- [x] **10.1 Test first.** `apps/web/src/app/shared/map-view/map-view.theme.spec.ts`: the map is drawn in night colours after the app switches to dark, and in day colours in light mode even when the system is dark. Run and shown failing.
- [x] **10.2 Code.** `map-view.ts` reads `ThemeStore.isDark()` instead of its own system query.
- [x] **10.3 System mode.** `theme.store.ts` listens to the system change and keeps `systemDark` as state, so the system choice still follows the system.
- [x] **10.4 Checks.** `pnpm check` and `pnpm build:web` from the repo root, and the summary in the PR.

## Out of scope in these tasks

- The language row and the profile row.
- Saving the day or night choice on the account.
- The map attribution.
