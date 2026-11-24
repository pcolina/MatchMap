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
