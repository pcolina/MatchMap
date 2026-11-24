# Tasks: add-web-header

Each task names its failing test first, then the code that makes it pass. One task is one commit, with `Task: x.x` in the body.

## 1. Header component

- [x] **1.1 Header tests.** In `apps/web/src/app/shared/layout-header/layout-header.spec.ts`, add: the notifications button is before the profile button in the DOM; the logo image has `alt` "matchMap" and the light variant `/brand/horizontal-on-light.svg` when `darkMode` is false, and the dark variant `/brand/horizontal-on-dark.svg` when it is true; the red dot is in the notifications button, has `aria-hidden="true"`, and is present whatever the count; activating the profile button emits `accountPressed` once; activating the notifications button emits nothing; the buttons are named from `account.sheet.notifications` and `map.controls.account`. Run them and show the failure.
- [x] **1.2 Header.** In `layout-header.ts`, add the `darkMode` input and the `accountPressed` output, and the template: logo image, notifications button with the dot, profile button. Copy `logo/lockup/svg-sora/horizontal-on-light.svg` and `horizontal-on-dark.svg` to `apps/web/public/brand/`. Make 1.1 pass.

## 2. Styles

- [x] **2.1 Style tests.** Add to the same spec (CSS read from disk, as the other CSS specs do): the header is 50 px high, its background is `var(--mm-color-surface)`, it has `overflow: hidden`, and the buttons have a `:focus-visible` outline of 2 px in `var(--mm-color-accent)` with an offset of 2 px. Run them and show the failure.
- [x] **2.2 Styles.** Write `layout-header.css` with the tokens from `design.md` §3 and §4, and the `.notification-dot` with `var(--mm-color-danger)` and `var(--mm-space-3)`. Make 2.1 pass.

## 3. Wiring in the main layout

- [x] **3.1 Layout tests.** In `main-layout.spec.ts`, add: with the dark scheme saved the header logo is the dark variant; with the light scheme it is the light variant; activating the header profile button opens the account sheet. Run them and show the failure.
- [x] **3.2 Wiring.** In `main-layout.ts`, pass `[darkMode]="theme.isDark()"` to `app-layout-header` and `(accountPressed)="accountOpen.set(true)"`. Make 3.1 pass.

## 4. Accessibility and visual checks

- [x] **4.1 Axe test.** In `apps/web/src/app/features/auth/pages/accessibility.spec.ts`, add: the main screen at laptop width has no axe violations, in light and in dark mode.
- [x] **4.2 Contrast check.** Measured: icons 17.74:1 in day and 15.47:1 at night; dot 6.47:1 in day and 6.28:1 at night. Measure the contrast of the button icons (`--mm-color-text`) against the surface, and of the red dot (`--mm-color-danger`) against the surface, in both modes. The icons must be at least 4.5:1 and the dot at least 3:1 (WCAG 1.4.11). Record the values in the PR. If one is below its minimum, stop and ask.
- [ ] **4.3 Browser check.** In Chrome, at 601, 1024 and 1440 px, in light and dark mode: the logo variant matches the mode, the header is 50 px high, the bell is left of the profile, Tab moves bell then profile with a visible focus, and the profile button opens the account sheet. Done by the owner, with the steps in the PR.

## 5. Full check

- [x] **5.1 Full check.** Run `pnpm check` and `pnpm build:web` from the repo root and paste the summary in the PR.

## Translations to review (for the PR)

None. The brand name `matchMap` is not translated, and the labels use keys that already exist.

## 6. Changes approved on review: pending count in the bell, shared account button

- [x] **6.1 Account button tests.** New `apps/web/src/app/shared/account-button/account-button.spec.ts`: the button is named "Account" with no pending notification and "Account, 2 unread notifications" with 2 pending; with pending notifications a `notification-dot` marked `aria-hidden="true"` is shown; with none no dot; while loading a skeleton replaces the icon; `aria-expanded` follows `accountOpen`; a click emits `accountPressed` once. Run them and show the failure.
- [x] **6.2 Account button.** Create `app-account-button` (`account-button.ts` and `account-button.css`) from the account button of `map-top-controls`, with the inputs `avatarLoading`, `accountOpen`, `pendingCount` and the output `accountPressed`. `MapTopControls` uses it. Make 6.1 pass, and keep the `map-top-controls` tests green.
- [x] **6.3 Header tests.** In `layout-header.spec.ts`, replace the dot tests with: the bell shows the pending count inside the red dot when `pendingCount` is 2 (text "2", `aria-hidden="true"`); no dot when it is 0; the profile button is the `app-account-button` and shows its dot while notifications are pending. Run them and show the failure.
- [x] **6.4 Header.** Add the `pendingCount` input to `LayoutHeader`; the bell shows the count in its dot; the profile is `<app-account-button>`. `MainLayout` passes `[pendingCount]="notifications.count()"` to the header. Make 6.3 pass, with the main layout tests green.
- [x] **6.5 Full check.** `pnpm check` and `pnpm build:web`, with the summary in the PR.
- Note from review: the notifications button is removed from the desktop header, then brought back with its count (task 7). The desktop profile button shows no dot.

## 7. Desktop notifications button back, notifications row only on phone

- [x] **7.1 Header tests.** In `layout-header.spec.ts`: the notifications button is before the profile button; it is named with `account.sheet.notifications`; with 2 pending its red dot holds the text "2" and is `aria-hidden="true"`; with none there is no dot; activating it emits nothing. Run them and show the failure.
- [x] **7.2 Header.** Add the notifications button with its count dot back to `layout-header.ts`, and its `pendingCount` use. Make 7.1 pass.
- [x] **7.3 Sheet tests.** In `account-sheet.spec.ts` (CSS read from disk): the notifications row has the class `notifications-row`, and a media query for `min-width: 601px` sets it to `display: none`. Run them and show the failure.
- [x] **7.4 Sheet.** Add the class `notifications-row` and the media rule in `account-sheet.css`. Make 7.3 pass.

## 8. Dark header in the accent colour

- [ ] **8.1 Header tests.** In `layout-header.spec.ts`: the logo is the light-background variant in both schemes; the header has the class `dark` when `darkMode` is true; the CSS gives `.layout-header.dark` the `accent` background and sets `--mm-color-text` to `var(--mm-color-onAccent)`. Run them and show the failure.
- [ ] **8.2 Header.** In `layout-header.ts`, the logo is always the light-background variant and the host has the `dark` class from `darkMode`; in `layout-header.css`, `.layout-header.dark` sets the accent background and the `onAccent` text token. Make 8.1 pass.
- [ ] **8.3 Contrast check.** Measure `onAccent` (`#04201C`) against `accent` (`#2DD4BF`) in the dark scheme, and the logo against the accent. Record the values in the PR. Stop and ask if one is below 4.5:1.
- [ ] **8.4 Full check.** `pnpm check` and `pnpm build:web`, with the summary in the PR.
- [ ] **8.5 Plain profile button.** Tests first: in `layout-header.spec.ts`, the header's `app-account-button` has the class `plain`; `account-button.css` gives `:host(.plain) .control` no border, no shadow and a transparent background. Run them and show the failure. Then add the `plain` input to `AccountButton` with the host class, and use it in the header. Make the tests pass.
