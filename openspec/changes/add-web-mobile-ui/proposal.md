# Proposal: add-web-mobile-ui

## Why

The web main screen on phone-sized viewports shows the map and the stats panel, but no controls. Users cannot add a visited place, reach friends, change the map view, open settings or see the map full screen. This change adds the controls around the map, styled and laid out, without any logic.

## What Changes

First step: the controls are painted as static layout, to see how they feel on the phone. No logic and no behaviour in this step.

- **Top right:** avatar. It opens a side sheet attached to the right edge, with the height and width its content needs. The sheet holds user info, language, day/night mode and sign-out.
- **Top left, one column:** add a visited place, then friends.
- **Bottom right, one row, left to right:** the attribution info icon (ⓘ, replaces the MapLibre logo and opens the credits), then the globe/mercator toggle. The matchMap brand mark is not in this row.
- **Stats panel, bottom:** only stats. The full-screen button is not painted in this change: it is designed with the stats component.
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

- Side sheet of the avatar: the owner agreed to add the pattern to `docs/design.md` in this change. Its details (width, height, how it closes) are specified with the avatar change.
- Attribution modal: decided with the avatar change, together with the sheet pattern.
- Attribution language: the app language. Until the language change exists, the rule is: the saved user choice if any; otherwise the browser language if it is `es` or `en`; otherwise `en`.
- Full-screen button: deferred to the stats component change. Not painted here.
