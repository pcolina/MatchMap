# Tasks: add-account-sheet

Each task starts with its failing test, run and shown failing before the code. Each task is one commit with its id in the body (`Task: 1.1`). Web only; the sheet is presentational.

## 1. Design entry and translations

- [x] **1.1 Design entry.** Add section 7.10 "Side sheet (account)" to `docs/design.md`: the right-edge anchor, the width by content with a 320 px maximum, the 200 ms fade and the reduced-motion rule, the closing rules, and the rule that the sheet is for account and settings only. Check the section headings with a test first: `packages/shared/test/design-doc.spec.ts` (new) reads `docs/design.md` and expects a heading "7.10" with "Side sheet". Run it and show it failing, then add the section and show it passing.
- [x] **1.2 Translation keys test first.** `packages/shared/test/account-sheet-i18n.spec.ts`: the keys `account.sheet.close`, `blocks.account`, `blocks.settings`, `blocks.about`, `blocks.session`, `profile`, `language`, `theme`, `aboutItem` and `signOut` exist in `en.json` and `es.json`, non-empty. Run it and show it failing.
- [x] **1.3 Translation keys code.** Add the ten keys under `account.sheet` with the texts of `design.md` section 8. Run the test and show it passing.

## 2. Account sheet component

- [x] **2.1 Test first.** `apps/web/src/app/shared/account-sheet/account-sheet.spec.ts`: the dialog has an accessible name equal to the display name; with `open` true it is shown as a modal; Escape emits `closed`; a click on the backdrop emits `closed`; the close control emits `closed`; the four blocks appear in the order account, settings, about, session, each with its heading; the rows are buttons with accessible names; with `displayName` null a skeleton line is shown and no email text is in the DOM. Run it and show it failing.
- [x] **2.2 Code.** `account-sheet.ts`, `.css` and template: a `<dialog>` element, opened with `showModal()` and closed with `close()` from an effect on `open`. Inputs `open` and `displayName`, output `closed`. Icons from `@ng-icons/tabler-icons`, with the rule in `apps/web/AGENTS.md`. Run the test and show it passing.

## 3. Sheet styles

- [x] **3.1 Test first.** The same spec file, style checks read from `account-sheet.css`: the dialog has `max-width: 320px`; the opacity transition is 200 ms; a `prefers-reduced-motion` rule removes the transition. Run it and show it failing.
- [x] **3.2 Code.** Position at the right edge, `max-height: calc(100dvh - 32px)`, `overflow-y: auto`, the fade on the dialog and its `::backdrop`, `@starting-style` for the opening frame, the reduced-motion rule, and the tokens of the design (`--mm-color-surface`, `--mm-color-borderStrong`, `--mm-elevation-card`). Run the test and show it passing.

## 4. Wiring in the main layout

- [x] **4.1 Test first.** `apps/web/src/app/shared/main-layout/main-layout.spec.ts`: pressing the account button opens the sheet, and the sheet's `closed` output closes it. Run it and show it failing.
- [x] **4.2 Code.** `MapTopControls` emits an account press output; `MainLayout` holds `accountOpen = signal(false)`, sets it on the press and clears it on `closed`, and passes `displayName` null. Place `app-account-sheet` in the layout. Run the test and show it passing.

## 5. Accessibility

- [x] **5.1 Test first.** `apps/web/src/app/features/auth/pages/accessibility.spec.ts`: add the account sheet, open, to the axe list. Run it and show it failing if there is a violation, or show it passing with the entry added first.
- [x] **5.2 Code.** Fix any violation axe reports. Run the test and show it passing.

## 6. Checks

- [x] **6.1 Full check.** `pnpm check` for `packages/shared` and `apps/web`, with the summary in the PR. Plus `pnpm build:web`, with the output.
- [ ] **6.2 Visual check.** At 320, 360 and 600 px, in light and dark mode, in the browser: the fade, the right-edge position, the closing, and the focus return. Done by the owner, as with the earlier visual checks.

## 7. Flat list (change to the approved spec)

The owner asked, after the first review, for one compact list with no group headings, the day or night mode row as a switch, and sign out last after a divider. This changes the spec requirement and the design (`design.md` decision 9, `docs/design.md` 7.10).

- [x] **7.1 Test first.** `apps/web/src/app/shared/account-sheet/account-sheet.spec.ts`: the sheet has no block headings (no `h3`); the rows come in the order view profile, language, day or night mode, about, sign out; one `hr` divider sits before the sign-out row; the day or night mode row has `role="switch"` and an `aria-checked` value that follows the `darkMode` input (default false). `packages/shared/test/account-sheet-i18n.spec.ts`: the keys are `close`, `profile`, `language`, `theme`, `aboutItem` and `signOut`, and no `blocks` key remains in `en.json` or `es.json`. Run them and show them failing.
- [x] **7.2 Code.** `account-sheet.ts`: remove the four blocks and their headings; render the rows in one list with an `hr` before sign out; make the day or night mode row a `role="switch"` button with `aria-checked` from a new input `darkMode` (default false). `account-sheet.css`: divider, switch track and knob with the tokens of `design.md` decision 5. Remove `account.sheet.blocks` from `en.json` and `es.json`. Run the tests and show them passing.
- [x] **7.3 Checks.** Re-run the axe check of the sheet open (5.x), `pnpm check` and `pnpm build:web` from the repo root, and add the summary to the PR.

## Out of scope in these tasks

- The actions of the rows (profile, about page, language, theme, sign-out).
- The display name from a user store, which comes with the user store change. Until then the sheet shows the loading skeleton.
