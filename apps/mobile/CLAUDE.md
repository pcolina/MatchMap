# CLAUDE.md: apps/mobile

Read the root `CLAUDE.md` and `.specify/memory/constitution.md` first.

## ng-native rules

This app is Angular rendered as native iOS/Android views through ng-native. It is not a web app:
there is no DOM, no browser and no React tree. Before changing anything, read the official docs:
https://ng-native.com/llms-full.txt (outline: https://ng-native.com/llms.txt).

- Templates use ng-native's lowercase native elements (`<view>`, `<text>`, `<pressable>`,
  `<scroll-view>`, `<text-input>`, `<image>`, `<switch>`, `<safe-area-view>`, `<virtual-list>`,
  `<modal>`), each imported from `@ng-native/components` into the component's `imports`. Never
  use `document`, `window`, `<button>`, `<a>`, `<input>`, `<img>`, `@angular/platform-browser` or
  `@angular/animations`.
- All visible text goes inside `<text>`.
- Events are native: `(press)` instead of `(click)`, `(changeText)`/`[(value)]` on inputs.
- A component that must fill its parent sets `:host { flex: 1; }`; otherwise its content can
  collapse to zero height.
- Styling is CSS compiled to native styles, flexbox only (column by default). Grid, floats,
  pseudo-elements, `:hover` and `:focus-visible` are not supported.
- Long lists use `<virtual-list>`; `<scroll-view>` is only for short content.
- Navigation uses `provideNativeRouter()` from `@ng-native/router`. HTTP uses
  `provideNativeHttpClient()` from `@ng-native/platform/http`. Forms use Signal Forms.
- No backticks inside inline templates.
- Accessibility is set with props: `accessibilityRole`, `accessibilityLabel`,
  `[accessibilityState]` (or their `role`/`aria-*` aliases).
- Tests run in Node with `@ng-native/testing`: `render()`, then query with `screen.getByRole`,
  `getByText` or `getByTestId`, and act with `userEvent.setup()`.

## Stack

ng-native 0.x (Angular rendered as native views on React Native Fabric + Expo), `@ng-native/router`,
`provideNativeHttpClient()` from `@ng-native/platform/http`, Apollo (`apollo-angular`),
`@ngrx/signals` (SignalStore), MapLibre (`@maplibre/maplibre-react-native`, registered as a native
view), `expo-secure-store`, `@ngx-translate/core`, Vitest with `@ng-native/testing`, ESLint +
Prettier. GraphQL operations and generated types come from `@matchmap/shared`.

ng-native is alpha. Pin exact versions (no `^`/`~`) for every `@ng-native/*`, `expo` and
`react-native` package. If an API behaves differently from the docs, stop and report it. Do not
hack around it.

MapLibre is a native module that Expo Go does not include: the app runs as a development build
(`npx expo run:android`, or EAS for iOS).

## Structure

```
apps/mobile/src/app/
├── core/          # apollo config, auth interceptor + token refresh, guards, secure storage, i18n setup
├── shared/        # presentational components, pipes, utils (no store, no Apollo)
└── features/<feature>/
    ├── data/      # <feature>.api.ts: Apollo calls only
    ├── state/     # <feature>.store.ts: NgRx SignalStore (state, computed, rxMethod/methods)
    ├── ui/        # presentational components (inputs/outputs only)
    └── pages/     # routed container components that inject the store
```

- Use standalone components with `ChangeDetectionStrategy.OnPush`, the new control flow
  (`@if`/`@for`), and `inject()` over constructor DI.
- State: one SignalStore per feature. Pages read store signals and call store methods. Only
  `data/*.api.ts` calls Apollo. Use the Apollo cache as server-state cache. Stores hold UI state
  and derived state. Use optimistic updates for pin mutations.
- Do not put business rules in components. Put them in the store, in pure functions next to it,
  or in `packages/shared` when web needs them too, so they can be unit-tested.
- Map: the Natural Earth 1:50m simplified GeoJSON is bundled in the app under `assets/geo/`. The
  backend only sends `{countryCode, status}`. Style data-driven by `iso_a2`.
- Auth: the access token stays in memory and the refresh token goes in `expo-secure-store`. On a
  401 or `UNAUTHENTICATED`, refresh once, then log out.
- Phones and tablets in both orientations; text follows the system font scale. Every interactive
  element sets `accessibilityRole` and `accessibilityLabel`.

## Testing (TDD)

Vitest unit tests for stores, pure functions, pipes and api services (with a mocked Apollo).
Component tests only for UI logic, with `@ng-native/testing` and queries by role. Coverage ≥ 80 %
on `state/` and pure functions. No E2E tests in the MVP.
