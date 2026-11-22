# Tasks: add-account-actions

Each task starts with its failing test, run and shown failing before the code. Each task is one commit with its id in the body (`Task: 1.1`). Web only.

## 1. Sign out

- [ ] **1.1 Test first.** `apps/web/src/app/features/auth/data/auth.api.logout.spec.ts`: `AuthApi.logout()` sends one `POST /api/auth/logout` with the web client header and no body. Run it and show it failing.
- [ ] **1.2 Code.** `logout()` on `SignInGateway` and `AuthApi`. Run the test and show it passing.
- [ ] **1.3 Test first.** `auth.store.spec.ts`: `signOutRemote()` clears the access token and navigates to `/login` after a successful logout, and does the same after a failed one. Run it and show it failing.
- [ ] **1.4 Code.** `signOutRemote()` in `AuthStore`: calls the gateway, and in `finalize` runs `signOut` and navigates. Run the test and show it passing.

## 2. Day or night mode

- [ ] **2.1 Test first.** `apps/web/src/app/core/theme/theme.store.spec.ts`: with no saved choice the mode follows `prefers-color-scheme`; a saved choice is kept in `localStorage` and survives a new store; `toggle()` flips the mode shown; `data-theme` on the root element follows the choice, and is removed for `system`; a failing storage keeps the choice in memory. Run it and show it failing.
- [ ] **2.2 Code.** `theme.store.ts` with `try/catch` around storage. Run the test and show it passing.
- [ ] **2.3 Test first.** The store applies the mode when the app starts: a spec that creates the store through the app initializer shows `data-theme` set before the first render. Run it and show it failing.
- [ ] **2.4 Code.** `provideAppInitializer` in `app.config.ts` that injects `ThemeStore`. Run the test and show it passing.

## 3. Translations

- [ ] **3.1 Test first.** `packages/shared/test/account-about-i18n.spec.ts`: `account.about.close` and `account.about.version` exist in `en.json` and `es.json`, non-empty. Run it and show it failing.
- [ ] **3.2 Code.** Add the two keys to both files. Spanish is listed under "Translations to review" in the PR. Run the test and show it passing.

## 4. About dialog

- [ ] **4.1 Test first.** `apps/web/src/app/shared/about-dialog/about-dialog.spec.ts`: the dialog is modal and named `matchMap`; it shows the version `1.0.0` in the accent colour (style check); Escape, the close control and a backdrop tap each emit `closed`. Run it and show it failing.
- [ ] **4.2 Code.** `about-dialog.ts` and `.css` (native dialog, same pattern as the account sheet), and `apps/web/src/app/core/app-version.ts` with `appVersion = '1.0.0'`. Run the test and show it passing.

## 5. Sheet outputs

- [ ] **5.1 Test first.** `account-sheet.spec.ts`: pressing sign out emits `signOutPressed`; pressing the day or night row emits `themeToggled`; pressing about emits `aboutPressed`; the switch row keeps `aria-checked` from `darkMode`. Run it and show it failing.
- [ ] **5.2 Code.** Three outputs in `account-sheet.ts` and the `click` bindings. Run the test and show it passing.

## 6. Main layout wiring

- [ ] **6.1 Test first.** `main-layout.spec.ts`: pressing about opens the about dialog and `closed` closes it, with focus back on the about row; pressing the switch sets `data-theme` to the other mode; pressing sign out clears the access token and shows `/login`. Run it and show it failing.
- [ ] **6.2 Code.** `MainLayout` holds `aboutOpen`, calls `ThemeStore.toggle()` and `AuthStore.signOutRemote()`, and places `app-about-dialog`. Run the test and show it passing.

## 7. Accessibility

- [ ] **7.1 Test first.** `accessibility.spec.ts`: the sheet with the about dialog open has no axe violations. Run it and show it failing if there is a violation, or show it passing with the entry added first.
- [ ] **7.2 Code.** Fix any violation axe reports. Run the test and show it passing.

## 8. Checks

- [ ] **8.1 Full check.** `pnpm check` and `pnpm build:web` from the repo root, with the summary in the PR.
- [ ] **8.2 Owner visual check.** Light and dark mode, the switch, the about dialog and sign out at 320, 360 and 600 px. Done by the owner.

## Out of scope in these tasks

- The language row and the profile row.
- Saving the day or night choice on the account.
- The map attribution.
