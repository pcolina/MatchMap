# Proposal: add-mobile-stats-layout

## Why

After sign-in, the mobile app shows the main layout, which is empty today. This change sets the layout of that screen: a map area that takes the remaining height, and a fixed-height `stats-resume` panel at the bottom. The panel is a summary: tapping it opens a fuller statistics view. For now the panel has no content, with the green background of the sign-in button, so the distribution can be found by trial and error. The map component and the fuller statistics come in later changes.

## What Changes

- **Main layout** (`apps/mobile/src/app/shared/main-layout/main-layout.ts`): a column with two areas.
  - Map area: fills the height left over by the panel. It is empty in this change; the map component is placed here later.
  - `stats-resume` panel: at the bottom of the screen, with a fixed height of 250 px.
- **New component `StatsResume`** (selector `app-stats-resume`) in the mobile app. It is presentational: no store, no Apollo, no inputs, no text, no icons.
- **Panel background:** the `accent` colour token, the same one the sign-in button uses (`palette().accent`). In the light scheme it is `#0F7C80`; in the dark scheme it is `#2DD4BF`. No new colour is added.
- **Panel has no vertical scroll:** its content is clipped to the 250 px height. It does not use `<scroll-view>`.
- **Tappable:** the panel is a pressable element with an accessible role and label, so it can open the fuller statistics view. The accessible label is a new i18n key, with `en` and `es` text.
- **Trial and error:** the spacing inside the layout is adjusted on the emulator during the change. The spec fixes only the measurable results above.
- **Safe area:** the layout respects the device safe area, so the panel does not sit under the home indicator.

## Capabilities

- `mobile-main-layout` (new): the post-login layout, the `StatsResume` panel with its fixed height and its tap target, and the map area that is reserved for the map.

## Out of scope

- The map component. This change reserves its area only.
- The fuller statistics view and its content. See the open question below.
- Any API call, store or data for the statistics or the map.
- Changes to the sign-in or register screens, or to tokens.

## Depends on

- `add-mock-system` (archived): the layout is the same with and without the mock flag.

## Open questions

- [NEEDS CLARIFICATION: until the map change, the map area is empty. Is that right, or should it show the neutral `bg` token so the layout is visible on the emulator?]
- [NEEDS CLARIFICATION: where does `StatsResume` live? Recommended: `apps/mobile/src/app/shared/stats-resume/`, because it is presentational (no store, no Apollo). The fuller statistics view, when it comes, is a feature with its own store. Which folder?]

## Decided

- When the panel is tapped, this change only makes it tappable. The route for the fuller statistics comes in a later change (option B).
- `StatsResume` is not reused for the fuller statistics view: the two show different data.
