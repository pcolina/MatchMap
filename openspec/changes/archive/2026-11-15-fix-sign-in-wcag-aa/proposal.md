# Proposal: fix-sign-in-wcag-aa

## Why

`CLAUDE.md` §9 requires WCAG 2.2 AA on web and mobile. A check of the sign-in colours against `docs/design.md` §2 found that the input border does not meet the non-text contrast of WCAG 2.2 criterion 1.4.11, which asks for 3:1 against the adjacent colour for the boundary of a component that is needed to identify it.

- `borderStrong` `#C3CCD9` on `surface` `#FFFFFF`: **1.62:1**. On `bg` `#F2F4F8`: **1.47:1**.
- `border` `#E1E5EC` on `surface` (the social buttons' outline): **1.26:1**.
- Dark mode, `borderStrong` `#3B4660` on `surface` `#121A2B`: **1.85:1**.

The text pairs checked pass AA: `textSecondary` on `surface` 7.56:1, `danger` on `surface` 6.47:1, `onAccent` on `accent` 4.98:1, `text` on `surface` 17.74:1.

This check covers colour tokens only. It does not run axe, a screen reader or a keyboard walk-through, so other WCAG findings may exist and are not part of this proposal.

## What Changes

- **Input border:** the border of the email and password inputs reaches 3:1 against `surface` and against `bg`, in day mode. A new token, `borderInput`, takes the value `#6B7485` (4.71:1 on `surface` `#FFFFFF`, 4.27:1 on `bg` `#F2F4F8`). The token is defined in `tokens/tokens.json` and used only for input borders. `borderStrong` keeps its current value and its other uses.
- **Social button outline:** the outline of the Google, Facebook and Apple buttons uses `borderInput`, so it reaches 3:1 too, even though the buttons are disabled in the MVP.
- **Dark mode:** not part of this change. The dark-mode border (1.85:1) is tracked by GitHub issue `matchMap` #7, which reviews dark mode for the auth pages as a whole.
- **Tokens:** the change goes in `tokens/tokens.json` (the source), then `tokens.ts` and `tokens.css` are regenerated. No hard-coded colour.
- **Keyboard and mouse focus:** the keyboard focus (Tab) keeps the current style: a 3 px `accent` ring with the halo, as `docs/design.md` §Focus requires. Mouse focus is different: no halo (no gradient), and a ring half the width of the keyboard ring, so 1.5 px (`calc((var(--mm-border-width-focus) + 1px) / 2)`, derived from the existing tokens).
  - Chrome shows `:focus-visible` on text inputs after a mouse click, so CSS alone cannot tell the two apart. The change tracks the input modality in JavaScript: a `pointerdown` marks the page as pointer, and a Tab `keydown` marks it as keyboard. The mouse style applies only in pointer mode, through a rule on `:root[data-input='pointer']`.
  - Scope: web only. The mobile app has no halo.
- **Errors need more than red text (WCAG 1.4.1):** every error message gets a red warning icon before its text, not only the red colour. This covers the field errors (email and password) and the sign-in failure message, on web and mobile.
  - Proposed: `tablerAlertCircle` from `@ng-icons/tabler-icons`, coloured `danger`, at the existing `size-icon-md` token. No new token.
  - Also added as a general rule: `docs/design.md` (a new rule under accessibility) and `CLAUDE.md` §9.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `client-sign-in`: the input borders meet 3:1, and the Accessibility requirement names the colour check for the sign-in page.

## Impact

- **Tokens:** `tokens/tokens.json`, regenerated `tokens/tokens.ts` and `tokens/tokens.css`. The apps read them through `apps/mobile/src/app/core/theme/tokens.ts` and `apps/web` `--mm-*` variables.
- **Code:** no template change expected, because the sign-in templates already use `borderStrong`. A test asserts the computed contrast of each token pair.
- **APIs:** none.
- **Dependencies:** none new.

## Out of scope

- Other WCAG criteria not measured here (keyboard order, names of icon-only buttons beyond those already tested, text resize, reflow). They need their own check.
- The registration page, unless the token change applies to it without extra work. Its border is the same token.
- Map colours (`docs/design.md` §2.2).

## Depends on

- **Spec `client-sign-in`** in `openspec/specs/client-sign-in/`, requirement "Accessibility".
- **Design `docs/design.md` §2.1 and §Focus**.

## Open questions

- None. The contrast and focus decisions are recorded above. Nothing is implemented until the proposal is approved.
