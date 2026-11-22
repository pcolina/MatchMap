# Proposal: add-web-mobile-ui

## Why

The web main screen on phone-sized viewports shows the map and the stats panel, but no controls. Users cannot add a visited place, reach friends, change the map view, open settings or see the map full screen. This change adds the controls around the map, styled and laid out, without any logic.

## What Changes

- **Top right:** avatar. It opens a side sheet attached to the right edge, with the height and width its content needs. The sheet holds user info, language, day/night mode and sign-out.
- **Top left, one column:** add a visited place, then friends.
- **Bottom right, one row, left to right:** the brand mark, the attribution info icon (ⓘ), then the globe/mercator toggle.
- **Stats panel, bottom:** only stats. A full-screen button sits inside the panel, 40 px above the bottom edge, and is the only tappable element of the panel.
- **Loading:** the avatar shows a grey circle while its user info loads, and friends shows one only if its icon carries a count from the server. The other controls are not loading states and show no skeleton (`docs/design.md`, 7.9).
- **Accessibility:** every icon-only control has an accessible name from i18n keys in `es` and `en`; touch targets are at least 44 px; controls over the map sit on a surface that keeps text contrast at 4.5:1; the globe toggle exposes its state with `aria-pressed`; focus follows the order top left, top right, map, panel, bottom right; transitions are instant with reduced motion.
- **UX:** add and friends show a short label on long press; full screen leaves room for the system gesture area; with full screen on, the panel hides and the top controls stay over the map.

## Capabilities

- **Modified:** `web-mobile-layout`. It keeps the map and the stats panel and adds the controls and their placement on phone-sized viewports.

## Out of scope

- Any logic: no API calls, no stores, no actions. Buttons do not change anything yet.
- Friends content, the add-place flow and the settings contents.
- The tab bar (Map · Destinations · Friends · Profile), which belongs to a separate change for the app and the web.
- The laptop layout (`web-laptop-layout`) and the tablet layout.
- The mobile app. The globe is not available in the mobile MapLibre library version in use.

## Depends on

- `web-mobile-layout` (main spec), `world-map` (main spec), `mobile-main-layout` (main spec, for the map area).

## Open questions

- [NEEDS CLARIFICATION: the side sheet of the avatar is a new pattern and is not in `docs/design.md`. Confirm its name, its behaviour (closes on tap outside and on swipe to the right) and whether it goes into `docs/design.md` in this change.]
- [NEEDS CLARIFICATION: is the attribution a centred modal or the bottom sheet of `docs/design.md` 7.6?]
- [NEEDS CLARIFICATION: the wording of the attribution text, in `es` and `en`, with the MapLibre and Natural Earth credits. It is an i18n key to be reviewed.]
- [NEEDS CLARIFICATION: what the full-screen button does exactly: hides the panel only, or also the header and the top controls?]
