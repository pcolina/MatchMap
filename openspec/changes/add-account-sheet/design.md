# Design: add-account-sheet

## Contract baseline

No API operation is called and no endpoint is added. The contract baseline in `matchmap-api` is `ca97e41`, unchanged.

## Scope

Web only, phone-sized viewports (600 px and less). The sheet is presentational: its rows do nothing yet (spec, out of scope).

## What checks were made

- `apps/web/src/app/shared/main-layout/main-layout.ts` is the container of the map area. The account button lives in `app-map-top-controls`.
- The web has no user store yet, so there is no display name in the app today.
- `docs/design.md` 7.6 defines the bottom sheet, but no side sheet. The side sheet is added as section 7.10 in this change.
- Tokens: `--mm-color-surface`, `--mm-color-text`, `--mm-color-textSecondary`, `--mm-color-borderStrong`, `--mm-color-accent`, `--mm-elevation-card`.
- The native `<dialog>` element supports modal display, the focus trap, Escape, and restoring focus to the opener.

## Decisions

### 1. Native modal dialog

The sheet is a `<dialog>` opened with `showModal()`. The browser gives:

- the focus trap and Tab cycling (spec: focus stays in the sheet);
- Escape to close;
- the `::backdrop` element for the tap-outside area;
- focus back to the element that opened the dialog, when it closes (spec: focus returns to the account button).

The component keeps the close control and the backdrop tap in code, because the close event must also reset the layout state.

### 2. State in the container

`MainLayout` holds `accountOpen = signal(false)`. It sets it to true when `MapTopControls` emits the account press, and to false when the sheet emits `closed`. The sheet is a presentational component: input `open` and `displayName`, output `closed`. This follows the rule that components do not hold business state, and the sheet has no logic.

### 3. Position and size

- `position: fixed; right: 0; top: calc(16px + env(safe-area-inset-top))`.
- `width: fit-content; max-width: 320px` (spec). Inside, `max-width: 100vw` guards the 320 px viewport.
- Height is the content height, with `max-height: calc(100dvh - 32px)` and `overflow-y: auto` for very short screens.
- Radius on the left corners only, from the `radius` tokens (`xl`).

### 4. Fade

- `dialog` opacity transitions over 200 ms: `transition: opacity 200ms`, with `@starting-style` for the opening frame, so the browser fades it in.
- Closing: the dialog is closed when the transition ends. The 200 ms wait is done with the `transitionend` event on the dialog.
- `::backdrop` fades with the same duration.
- `@media (prefers-reduced-motion: reduce)`: no transition, no delay.

### 5. Look

- Surface: `--mm-color-surface`, border `--mm-color-borderStrong` on the left and top edges.
- Shadow: `--mm-elevation-card` in day mode; in night mode the token is `none` and the border separates the sheet. This follows `docs/design.md` 4 for cards.
- The four blocks are separated by a 1 px `border` line and a heading in `label` (`docs/design.md` 3). Rows are 44 px high, with `bodyStrong` for the label and `textSecondary` for the value.
- The display name is a `title3` heading (Sora 600).

### 6. Display name

The sheet takes `displayName: string | null`. `null` means the user information is still loading: the header shows a grey skeleton line (`docs/design.md` 7.9). The web has no user store yet, so `MainLayout` passes `null` until that change exists. The email is not used.

### 7. The new side sheet pattern

`docs/design.md` gets section 7.10, "Side sheet (account)", with: the anchor (right edge), the width by content and the 320 px maximum, the fade of 200 ms, the closing rules, and the rule that the sheet is for account and settings only, never for content the user must compare.

### 8. i18n keys

Under `account.sheet` in `packages/shared/i18n/en.json` and `es.json`:

| Key | en | es |
|---|---|---|
| `account.sheet.close` | Close | Cerrar |
| `account.sheet.blocks.account` | Account | Cuenta |
| `account.sheet.blocks.settings` | Settings | Ajustes |
| `account.sheet.blocks.about` | About | Acerca de |
| `account.sheet.blocks.session` | Session | Sesión |
| `account.sheet.profile` | View profile | Ver perfil |
| `account.sheet.language` | Language | Idioma |
| `account.sheet.theme` | Light or dark mode | Modo claro u oscuro |
| `account.sheet.aboutItem` | About matchMap | Acerca de matchMap |
| `account.sheet.signOut` | Sign out | Cerrar sesión |

The Spanish text is AI-generated and goes under "Translations to review" in the PR.

## Files

- `apps/web/src/app/shared/account-sheet/account-sheet.ts` (+ `.css`, `.spec.ts`)
- `apps/web/src/app/shared/map-controls/map-top-controls.ts` (emits the account press)
- `apps/web/src/app/shared/main-layout/main-layout.ts` and `.spec.ts` (state and wiring)
- `packages/shared/i18n/en.json`, `es.json`
- `docs/design.md` (section 7.10)
- `apps/web/src/app/features/auth/pages/accessibility.spec.ts` (the sheet open, in the axe list)

## Tests (TDD)

- Account sheet: the dialog has an accessible name equal to the display name; `open` shows it; Escape emits `closed`; a tap on the backdrop emits `closed`; the close control emits `closed`; the blocks come in order; the rows are buttons with names; the skeleton shows when `displayName` is null and no email text is in the DOM.
- Styles: `max-width: 320px` on the dialog; `transition` of 200 ms; a reduced-motion rule without transition.
- Main layout: the account press opens the sheet, and `closed` closes it.
- Axe: the sheet open, with no violations.
- Manual, on the phone browser: fade, the right-edge position at 320, 360 and 600 px, focus return.

## Risks

- `@starting-style` is supported in current Chrome and Edge, which are the MVP browsers (`CLAUDE.md` §4). If not, the sheet appears without a fade and the layout still works.
- The browser restores focus to the opener only if the dialog was opened with `showModal()` from that element. The container must call the open from the account button's own press.

## Performance

No budget is affected. The sheet adds a few hundred bytes of markup.
