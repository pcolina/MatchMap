# Design: fix-sign-in-wcag-aa

## Context

Three requirements from the approved specs (`specs/client-sign-in/spec.md`): input and social button outlines reach 3:1, keyboard and pointer focus differ, and each error message has an icon as well as colour. The sign-in page already uses `borderStrong`, `danger` and the existing focus style from `docs/design.md` §Focus.

## Decisions

### 1. Input border token

- Add `borderInput` to `tokens/tokens.json`: light `#6B7485` (4.71:1 on `surface` `#FFFFFF`, 4.27:1 on `bg` `#F2F4F8`), dark `#3B4660`. The dark value is the current `borderStrong` dark value, so dark mode does not change. The dark contrast is tracked by issue `matchMap` #7.
- `borderStrong` keeps its value and its other uses.
- `tokens/tokens.ts` and `tokens/tokens.css` are versioned by hand; the repo has no generator script. All three files change in the same commit, and a test checks that the three values agree.
- `tokens/contrast-report.md` gets a row for `borderInput` against `surface` and `bg`, in day and night.
- Inputs and social buttons use `borderInput` in their outline or border.

### 2. Keyboard and pointer focus (web only)

- A new module `apps/web/src/app/core/input-modality.ts` exports one function, `trackInputModality(doc)`. It adds `pointerdown` and `keydown` listeners on the document. A pointer press sets `data-input="pointer"` on `<html>`. A `Tab` key press sets `data-input="keyboard"`. Other keys do not change the attribute, and the function returns a cleanup for tests.
- The function is registered once, with `provideAppInitializer` in `apps/web/src/app/app.config.ts`, next to the existing initializers.
- `apps/web/src/styles.css` keeps the keyboard focus rule as is. A new rule, `:root[data-input='pointer'] :focus-visible`, sets `outline` to `calc((var(--mm-border-width-focus) + 1px) / 2) solid var(--mm-color-accent)` with the same offset and `box-shadow: none`. Its specificity is higher than the global `:focus-visible` rule, so it wins only in pointer mode.
- Before the first key or pointer press, the attribute is absent, so the keyboard rule applies. This is the safe default for keyboard users.

### 3. Error icon

- Each error message on the web sign-in page gets an `<ng-icon name="tablerAlertCircle">` before its text, inside the same `<p>`. The icon colour is `var(--mm-color-danger)` and its size is `var(--mm-size-icon-md)`, both existing tokens.
- The icon is decorative (`aria-hidden="true"`). The message text is what screen readers announce, and the `role="alert"` on the failure message stays.
- An empty error space shows no icon, because the `<ng-icon>` is inside the `@if` that renders the message.
- On mobile, each error text becomes a row: a `view` with `flex-direction: row` holds the icon and the text. The icon uses the `danger` palette colour and `size.iconMd`. The row keeps the reserved space and the 5 px offset from the previous change.
- `provideIcons` in the web and mobile test setups gets `tablerAlertCircle`, so the icon resolves in tests.

### 4. Documentation rules

- `docs/design.md`: a new rule under accessibility, "A message that is shown in red must also show an icon, so colour is not the only cue", and the focus section gets the pointer and keyboard split.
- `CLAUDE.md` §9: the same rule, in one line.

## Risks

- **Layout on mobile:** the icon takes width from the error text. Checked visually at phone width.
- **Dark mode:** not changed, so dark outlines stay at their current contrast until issue `matchMap` #7.
- **Modality detection:** `pointerdown` also fires for touch on web. Touch counts as pointer, which matches the spec.

## Tests

Each test is written first and must fail before its change (`CLAUDE.md` §2, TDD).

- `tokens`: a test reads `tokens.json`, `tokens.ts` and `tokens.css` and checks that `borderInput` has the same light value in all three files, and that `borderStrong` is unchanged.
- `input-modality.spec.ts` (new, web): a pointer press sets `data-input="pointer"`; Tab sets `data-input="keyboard"`; another key does not change it; the cleanup removes the listeners.
- `sign-in.page.spec.ts` (web): each error element contains an `ng-icon` named `tablerAlertCircle`, with `aria-hidden="true"`; an empty error space has no icon; the email and password inputs and the social buttons use `var(--mm-color-borderInput)` for their border colour.
- `styles` (web): the stylesheet contains the pointer rule with `box-shadow: none` and the half-width outline.
- `sign-in.page.test.ts` (mobile): each error text has an icon in the same row, and the failure text has an icon.
