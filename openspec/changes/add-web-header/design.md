# Design: add-web-header

## Scope

Web, laptop layout only, as in `proposal.md` and `specs/web-laptop-layout`. No API call and no contract change. The header stays presentational: it has no store.

## Decisions

### 1. Presentational header with inputs and one output

`LayoutHeader` (`apps/web/src/app/shared/layout-header/layout-header.ts`) gets:

- an input `darkMode` (boolean, default `false`), which chooses the logo variant;
- an output `accountPressed`, which the profile button emits.

`MainLayout` passes `[darkMode]="theme.isDark()"` and handles `(accountPressed)="accountOpen.set(true)"`, the same way it already drives `app-map-top-controls`. The notifications button has no output and no handler, as the spec says.

### 2. Logo as two images, chosen by the app mode

The two lockups are copied from `logo/lockup/svg-sora/` into `apps/web/public/brand/`:

- `horizontal-on-light.svg` for the light scheme;
- `horizontal-on-dark.svg` for the dark scheme.

The header renders one `<img>` with `src` picked from `darkMode`, and `alt="matchMap"`. The brand name is not translated (`docs/brand.md`). The image is not a link.

### 3. Background and layout from the tokens

- The header uses `background: var(--mm-color-accentSubtle)` in the light scheme and `var(--mm-color-surfaceRaised)` in the dark scheme (class `dark`), height `50px`, width `100%`, `display: flex`, `justify-content: space-between`, `align-items: center`, and horizontal padding `var(--mm-space-4)`.
- The header does not scroll (`overflow: hidden`).
- The `50px` height is the value the spec sets. It is the only size in this design that is not a token; it comes from the spec.

### 4. Controls use the existing button pattern

- Both buttons are native `<button type="button">` with a 44 px touch target, as the controls of `web-mobile-layout` already use.
- Icons: `tablerBell` for notifications and `tablerUser` for the profile. Both icons are already registered in `app.config.ts`.
- Accessible names: the bell is named with `account.sheet.notifications`, the profile with `map.controls.account`, both through the translate pipe.
- Focus: the header buttons take the global `:focus-visible` style of the app (outline `calc(var(--mm-border-width-focus) + 1px)` in `var(--mm-color-accent)`, offset `var(--mm-border-width-focus)`, and the `--mm-focus-halo` shadow), the same as the sign-in page. The header adds no focus rule of its own, and the hover circle is not drawn on focus.
- Order in the DOM: bell, then profile, so Tab reaches the bell first.

### 5. The dot

The dot on the bell is a `<span aria-hidden="true">` with `background: var(--mm-color-danger)`, a minimum size of `var(--mm-space-3)` high, a pill shape (`--mm-radius-pill`) that grows to fit two digits, and the pending count centred inside it. It is shown only while the count is above 0. The count comes from the notifications store.

### 6. What stays unchanged

- The map's own avatar at the top right of the map is not touched (out of scope).
- The phone layout keeps its layout; the header is not shown there, as today.

## Risks

- On laptop the profile now appears twice: in the header and on the map's avatar. Both open the same sheet. This is accepted for now, as the proposal says.
- The bell and its dot do nothing, so a screen reader user hears a button that does nothing. This is accepted: the spec asks for it.

## Performance

No new network request. Two small SVG files of the logo are loaded only once.

## Testing

The tasks name the failing tests first, as the spec scenarios require: rendered order, logo variant by mode, dot always painted, profile emits `accountPressed`, notifications button has no output, accessible names, and focus style in the CSS.
