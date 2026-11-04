# AGENTS.md: apps/web

Read the root `CLAUDE.md` first.

This is a standard Angular web app built with the Angular CLI. It renders HTML in a browser: the
ng-native rules of `apps/mobile` do not apply here.

## Stack

Angular (zoneless, signals), `@angular/router`, Apollo (`apollo-angular`), `@ngrx/signals`
(SignalStore) with RxJS for asynchronous streams, Signal Forms (`@angular/forms/signals`), MapLibre
GL JS, `@ngx-translate/core`, Lucide icons through `@ng-icons/lucide`, Vitest (through `ng test`),
ESLint + Prettier. GraphQL operations and generated types come from `@matchmap/shared`. Exact versions are
pinned in the web change that sets up the project. Supported browsers in the MVP: Chrome and Edge. The web app is not
deployed in the MVP.

## Structure

```
apps/web/src/app/
├── core/          # apollo config, auth interceptor + token refresh, guards, i18n setup
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
- RxJS is for asynchronous streams only (Apollo observables, debounced input, timers). Bridge
  them into the store with `rxMethod` from `@ngrx/signals/rxjs-interop`, and expose signals to the
  pages. Do not use the classic `@ngrx/store`.
- Do not put business rules in components. Put them in the store, in pure functions next to it,
  or in `packages/shared` when mobile needs them too, so they can be unit-tested.
- Map: the same Natural Earth 1:50m simplified GeoJSON as mobile. The backend only sends
  `{countryCode, status}`. Style data-driven by `iso_a2`.
- Auth: the access token stays in memory. Where the refresh token lives on web is decided in
  the sign-in change. On a 401 or `UNAUTHENTICATED`, refresh once, then log out.
- Forms use Signal Forms (`@angular/forms/signals`), as on mobile, with native controls and
  validation in the template. Do not use reactive or template-driven forms.
- Styling: component CSS only. Colours, sizes, radii and spacing come from the `--mm-*` variables
  in `tokens.css`. No Tailwind and no utility-class library.
- Icons come from `@ng-icons/lucide` (`NgIcon`). Do not use `lucide-react-native` or other React
  packages.
- Semantic HTML first: native `<button>`, `<a>`, `<label>`, landmarks and headings before ARIA.
- Responsive from 320 px to wide desktop with flexbox/grid and relative units.

## Testing (TDD)

Vitest unit tests for stores, pure functions, pipes and api services (with a mocked Apollo).
Component tests only for UI logic, querying by role. Automated axe checks on every page.
Coverage ≥ 80 % on `state/` and pure functions. No E2E tests in the MVP.
