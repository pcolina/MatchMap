# Tasks: add-notifications

Each task names its failing test first, then the code that makes it pass. One task is one commit, with `Task: x.x` in the body.

## 1. Pending count on the device

- [x] **1.1 Store tests.** Write `apps/web/src/app/core/notifications/notifications.store.spec.ts`. Cover: no stored value reads as 0 and `pending` is false; a stored whole number reads as that count and `pending` is true when it is above 0; a stored value that is not a whole number or is negative reads as 0; storage that throws reads as 0. Run them and show the failure.
- [x] **1.2 Store.** Add `NotificationsStore` (`signalStore`, `providedIn: 'root'`) with the count read from `matchmap.notifications.pending` in try/catch, and a `pending` computed signal. Make 1.1 pass with no write method.

## 2. Notifications row in the account sheet

- [x] **2.1 Row tests.** In `account-sheet.spec.ts`, add: the rows appear in the order profile, notifications, language, day or night, about, sign out; the notifications row is a button with the name from `account.sheet.notifications`; activating it sends no request and emits no output. Run them and show the failure.
- [x] **2.2 Row and keys.** Add the notifications row in `account-sheet.ts` after the profile row, and add the key `account.sheet.notifications` to `packages/shared/i18n/en.json` and `es.json`. Make 2.1 pass. Run the `packages/shared` i18n test for matching keys.
- [x] **2.3 Badge.** Tests first: in `account-sheet.spec.ts`, the notifications row shows a badge with the pending count at its end, its accessible name states the count from `account.sheet.notificationsWithPending`, and no badge or count shows at 0. Then add the `pendingCount` input, the badge (danger token, `--mm-radius-pill`), the key in `en.json` and `es.json`, and pass the count from `main-layout.ts`. Spec: `specs/web-account-sheet/spec.md` delta, approved by the user.
- [x] **2.4 Mock unread notification.** Tests first: in `apps/web/src/app/core/mocks/mock-http.interceptor.spec.ts`, a successful web sign-in as `one@matchmap.test` sets `matchmap.notifications.pending` to 1, as `two@matchmap.test` sets it to 0, and a failed sign-in keeps the value. Then add `unreadNotifications` to `packages/shared/src/mocks/data/users.json` (1 for user one, 0 for user two), the optional field to `MockUser`, and the write in `mock-http.interceptor.ts`. Spec: `specs/api-mocks/spec.md` delta, approved by the user.

## 3. Red dot and the accessible name with the count

- [x] **3.1 Avatar tests.** In `map-top-controls.spec.ts`, add: with a pending count above 0 the avatar shows a dot marked `aria-hidden="true"`, and its accessible name comes from `account.avatar.labelWithPending` with the count as parameter; with 0 there is no dot and the name is `map.controls.account`. Run them and show the failure.
- [x] **3.2 Avatar.** Add a `pendingCount` input to `map-top-controls.ts`, the dot with the `danger` token in `map-top-controls.css` at the top-right of the avatar, and the two names. Add the key `account.avatar.labelWithPending` to `en.json` and `es.json` with the `{{count}}` parameter used by ngx-translate. Make 3.1 pass.
- [x] **3.3 Layout wiring tests.** In `main-layout.spec.ts`, add: with a stored count of 2 the avatar shows the dot and the name with 2; the Notifications row is in the sheet. Run them and show the failure.
- [x] **3.4 Layout wiring.** In `main-layout.ts`, inject `NotificationsStore` and pass its count to `app-map-top-controls`. Make 3.3 pass.

## 4. Visual and accessibility checks

- [x] **4.1 Axe test.** In `apps/web/src/app/features/auth/pages/accessibility.spec.ts`, add: the main screen with a pending count has no axe violations, in day and in night mode (localStorage set for the mode). Run it and show the result.
- [x] **4.2 Contrast check.** Measure the contrast of the `danger` dot (`#B91C1C` day, `#F87171` night) against the avatar surface in both modes. It must be at least 3:1 (WCAG 1.4.11). Record the values in the PR. If it is below 3:1, stop and ask for a different colour; do not pick one.
- [ ] **4.3 Browser check.** In Chrome, at 320, 360 and 600 px, in day and night mode: the dot is at the top-right of the avatar, it is not clipped, it does not cover the avatar, and it is not shown when the stored count is 0. Done by the owner, with the steps in the PR.

## 5. Full check

- [x] **5.1 Full check.** Run `pnpm check` and `pnpm build:web` from the repo root and paste the summary in the PR. Confirm that `es` and `en` have the new keys: `account.sheet.notifications` and `account.avatar.labelWithPending`.

## Translations to review (for the PR)

- `account.sheet.notifications`: en "Notifications", es "Notificaciones".
- `account.sheet.notificationsWithPending`: en "Notifications, {{count}} unread", es "Notificaciones, {{count}} sin leer".
- `account.avatar.labelWithPending`: en "Account, {{count}} unread notifications", es "Cuenta, {{count}} notificaciones sin leer".
