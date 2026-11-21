# Proposal: add-mobile-stats-layout

## Why

The mobile app needs its layout before the screens that will fill it. This change adds an empty `Stats` component with the green background of the sign-in button, so the layout can be set now and its content can be designed in a later change.

## What Changes

- **New component `Stats`** in the mobile app (`apps/mobile`). It is presentational: no store, no Apollo, no inputs. It renders an empty view that fills its parent.
- **Background:** the `accent` colour token of `tokens/tokens.json`, the same one the sign-in button uses (`palette().accent`). In the light scheme it is `#0F7C80`; in the dark scheme it is `#2DD4BF`. No new colour is added.
- **No content:** the component has no text, no icons and no controls. Its content is designed in a later change.
- **Layout:** the component fills the space it is given, with `:host { flex: 1; }` as the mobile rules require, and works in portrait and landscape.

## Capabilities

- `mobile-stats-layout` (new): the empty `Stats` component, its background and its place in the mobile layout.

## Out of scope

- Any content, text, icon or control inside `Stats`.
- Any API call, store or data for the stats.
- Changes to the sign-in or register screens.
- Changes to tokens. The colour is the existing `accent` token.

## Depends on

- `add-mock-system` (archived): the mobile app runs with and without mocks; `Stats` does not depend on the mock flag.

## Open questions

- [NEEDS CLARIFICATION: where does `Stats` appear? Options: (a) the route the user lands on after a successful sign-in, (b) a new route, or (c) a component to be placed later without a route. Which one, and which route path?]
- [NEEDS CLARIFICATION: is the green background the light `accent` (`#0F7C80`) in light mode and the dark `accent` (`#2DD4BF`) in dark mode, as the sign-in button does, or a fixed colour?]
- [NEEDS CLARIFICATION: is `Stats` a full screen (fills the whole phone screen, including under the status bar, as `safe-area-view` does on the sign-in page) or only the content area below a header?]
- [NEEDS CLARIFICATION: where does the component live? Options: `apps/mobile/src/app/features/stats/` (a feature folder) or `apps/mobile/src/app/shared/stats/` (a presentational component, as `shared/` in the structure rules).]
