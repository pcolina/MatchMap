# Proposal: add-web-header

## Why

The web main screen on laptop-sized viewports has a header that is only an empty accent bar (`web-laptop-layout`, "Header is an empty full-width accent bar"). The screen has no place for the brand or for the account and notifications controls. This change defines what the header shows.

## What Changes

- **Left:** the matchMap logo with its text, the horizontal lockup. It uses `logo/lockup/svg-sora/horizontal-on-light.svg` in light mode and `logo/lockup/svg-sora/horizontal-on-dark.svg` in dark mode. The brand is written "matchMap", as in `docs/brand.md`.
- **Right, at the far right:** the profile button. It looks and behaves like the account avatar of the map (`map.controls.account`): it opens the account sheet. It does not show the notification dot.
- **Right, to the left of the profile button:** the notifications bell, with a red dot. The bell and its dot are painted only: the dot is always shown, and the bell has no logic (no count from the store and no action).
- **Keyboard:** the bell and the profile button are native buttons with an accessible name from i18n keys (`account.sheet.notifications` and `map.controls.account`). Tab order goes left to right: bell, then profile. The focus style is the same as the map controls: a 2 px accent outline with a 2 px offset.
- The logo is an image with the accessible name "matchMap" and is not a link, because the header has no target yet.
- Light and dark mode: the logo follows the app mode, and the header colours come from the tokens.

## Capabilities

- **Modified:** `web-laptop-layout`. The requirement "Header is an empty full-width accent bar" is removed and replaced by "Header shows the brand, the notifications bell and the profile". The header background changes from the accent token to the surface token, in both schemes.

## Out of scope

- The footer. It stays an empty placeholder until its own change.
- The phone layout (`web-mobile-layout`). It has no header and does not change.
- The tablet (iPad) layout, which needs its own change.
- The avatar at the top right of the map on laptop. This change only specifies what the header shows; the map controls are not changed here.
- The mobile app.
- Any action on the bell, and reading the notification count in the header.

## Depends on

- `web-laptop-layout` (`openspec/specs/web-laptop-layout`).
- `web-account-sheet` (`openspec/specs/web-account-sheet`): the profile button opens the sheet.
- `notifications` (`openspec/specs/notifications`): only for the visual dot, which is not connected to the store in this change.

## Decisions

- The header shows the logo at the left and the bell and profile at the right, in that order from the right: profile, then bell.
- The header keeps the 50 px height at every laptop width, as the current spec says. This is revisited only if the content needs more or less space.

## Open questions

- None.
