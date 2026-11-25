# Proposal: add-laptop-side-menu

## Why

On laptop the web layout has no navigation for the two main actions of the app: adding a visited place and reaching friends. The phone layout has them in its bottom controls. A side menu gives the laptop layout a stable place for them and leaves room for more entries later.

## What Changes

- A side menu on the left of the laptop layout, 300 px wide. It starts under the header and runs to the bottom of the viewport. The header spans the full width of the viewport.
- Background: the header background token (`accentSubtle`).
- Two items:
  1. **Add place** (`map.controls.addPlace`), with a plus icon in the accent colour.
  2. **Friends** (`map.controls.friends`), with a users icon in the grey `textSecondary` colour.
  The icons do not need to match the phone icons. The labels reuse the existing i18n keys.
- The header and the rest of the laptop layout move to the right of the menu, so nothing is covered.
- Keyboard: the menu comes right after the last header icon in the tab order. A skip link at the end of the menu moves focus to the map, so the menu can grow later without slowing down keyboard users.
- Focus: the same focus ring as the header buttons (accent outline with the focus halo). Hover: the `accentSubtle` background, only on pointer devices.
- Responsive: the menu only exists from 601 px wide, like the other laptop-only parts of the layout. Phones are not changed.
- Accessibility: a `nav` landmark labelled from an i18n key; each item is a native button with an accessible name.

## Decisions taken without the owner

The owner asked for the decisions to be taken here and for review in the browser. The gates of the workflow (specs, design, tasks approval) were skipped at the owner's request. Every decision above can be changed after the browser review.

## Capabilities

### Modified Capabilities

- `web-laptop-layout`: one requirement added for the side menu.

## Out of scope

- What the two items do. They emit an event; the actions (add a place, open friends) belong to their own changes.
- Items beyond the two listed.
- The mobile layout.

## Depends on

- `web-laptop-layout` (`openspec/specs/web-laptop-layout`).
- `update-map-style` (archived) for the toggle placement inside the map area.
