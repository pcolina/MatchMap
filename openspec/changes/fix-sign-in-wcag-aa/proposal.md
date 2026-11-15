# Proposal: fix-sign-in-wcag-aa

## Why

`CLAUDE.md` §9 requires WCAG 2.2 AA on web and mobile. A check of the sign-in colours against `docs/design.md` §2 found that the input border does not meet the non-text contrast of WCAG 2.2 criterion 1.4.11, which asks for 3:1 against the adjacent colour for the boundary of a component that is needed to identify it.

- `borderStrong` `#C3CCD9` on `surface` `#FFFFFF`: **1.62:1**. On `bg` `#F2F4F8`: **1.47:1**.
- `border` `#E1E5EC` on `surface` (the social buttons' outline): **1.26:1**.
- Dark mode, `borderStrong` `#3B4660` on `surface` `#121A2B`: **1.85:1**.

The text pairs checked pass AA: `textSecondary` on `surface` 7.56:1, `danger` on `surface` 6.47:1, `onAccent` on `accent` 4.98:1, `text` on `surface` 17.74:1.

This check covers colour tokens only. It does not run axe, a screen reader or a keyboard walk-through, so other WCAG findings may exist and are not part of this proposal.

## What Changes

- **Input border:** the border of the email and password inputs reaches 3:1 against `surface` and against `bg`, in day mode.
  - [NEEDS CLARIFICATION: which value should `borderStrong` take in day mode? Candidates measured against `surface` `#FFFFFF` and `bg` `#F2F4F8`: `#7C8699` gives 3.67:1 and 3.33:1; `#737D8F` gives 4.15:1 and 3.77:1; `#6B7485` gives 4.71:1 and 4.27:1. Or another value you choose.]
- **Social button outline:** the outline of the Google, Facebook and Apple buttons.
  - [NEEDS CLARIFICATION: these buttons are disabled in the MVP. Should their outline also reach 3:1, or does the disabled state exempt it from criterion 1.4.11? If it must, which colour?]
- **Dark mode:** the same token in dark mode is 1.85:1.
  - [NEEDS CLARIFICATION: should dark mode be fixed in this change, or stay with `docs/design.md` GitHub issue `matchMap` #7, as the archived `add-login-input-errors` proposal said?]
- **Tokens:** the change goes in `tokens/tokens.json` (the source), then `tokens.ts` and `tokens.css` are regenerated. No hard-coded colour.
- **Scope of the token:** `borderStrong` is also used for inactive focus. The change must keep the focus style of `docs/design.md` §Focus (3 px `accent` ring) as the focus indicator.
  - [NEEDS CLARIFICATION: is changing `borderStrong` for every use acceptable, or should a separate `input.border` token be added for input borders only?]

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

- The four `[NEEDS CLARIFICATION]` items above. Nothing is implemented until they are answered.
