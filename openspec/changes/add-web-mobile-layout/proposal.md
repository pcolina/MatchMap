# Proposal: add-web-mobile-layout

## Why

The mobile app now has its main layout after sign-in: a map area that takes the remaining height, and a 250 px tappable `stats-resume` panel at the bottom (`add-mobile-stats-layout`). `CLAUDE.md` §1 says that the web app on phone-sized screens shares one design and one behaviour with the mobile app, so the web main screen should follow the same layout. The web is built mobile first: the phone layout is the base, and wider layouts are added in their own changes.

## What Changes

- **Main layout** (`apps/web/src/app/shared/main-layout/`): a column with two areas, the same as the mobile layout.
  - Map area: fills the height left over by the panel. It holds the existing `app-map-view` component, which already fills its parent.
  - `stats-resume` panel: at the bottom of the screen, 250 px high, with no vertical scroll.
- **New component `StatsResume`** in the web app (`apps/web/src/app/shared/stats-resume/`, selector `app-stats-resume`). It is presentational: no store, no Apollo, no inputs. Its design is the same as the mobile panel: the `accent` token of the current colour scheme, the same accessible name (`stats.resume.label`), and it emits a `press` output that the layout does not yet act on.
- **Tokens:** the web uses the same token values as the mobile app, from `tokens/tokens.css` (`--mm-*`). No new colour is added.
- **Mobile first:** the base CSS is the phone layout. A wider layout is not part of this change.
- **Safe area:** the bottom of the panel respects the device bottom inset (`env(safe-area-inset-bottom)`), so it does not sit under the home indicator on phones that have one.

## Capabilities

- `web-mobile-layout` (new): the web main screen on phone-sized screens, its `StatsResume` panel with its fixed height and tap target, and the map area that fills the remaining height.

## Out of scope

- The iPad and laptop layouts. `CLAUDE.md` §6 gives each of them its own spec and change.
- The fuller statistics view and its route. The panel is tappable only; the route comes in a later change (as in mobile).
- The login and register pages. Their layout is not changed.
- Any API call, store or data for the statistics.
- Changes to the map component itself.

## Depends on

- `add-mobile-stats-layout` (archived): the phone layout and the `StatsResume` design that the web copies.
- `add-world-map-view` (archived): `app-map-view` fills the map area.

## Open questions

- [NEEDS CLARIFICATION: which width counts as phone-sized on the web? The web supports 320 px to wide desktop (`CLAUDE.md` §9). Options: a maximum width of 600 px, 768 px, or another value. Below that width the phone layout applies; above it, the layout belongs to the iPad or laptop change, so what is shown there until then?]
- [NEEDS CLARIFICATION: should the phone layout be limited to a maximum width (for example a centred column of 430 px) when the browser is wider than a phone but narrower than the breakpoint? Or does it fill the full width?]
- [NEEDS CLARIFICATION: where does the web `StatsResume` live? Recommended: `apps/web/src/app/shared/stats-resume/`, because it is presentational.]
