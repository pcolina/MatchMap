# Proposal: add-web-header

## Why

The web main screen on laptop-sized viewports has a header that is only an empty accent bar (`web-laptop-layout`, "Header is an empty full-width accent bar"). The header has no content, so the screen has no place for the app's top-level navigation or for the account. This change defines what the header shows.

## What Changes

- [NEEDS CLARIFICATION: what does the header show? Options to choose from, or others: the matchMap logo, the page or section name, the account button that opens the account sheet, a language or theme switch, navigation links.]
- [NEEDS CLARIFICATION: does the header keep its 50 px height at every laptop width, as the current spec says?]
- [NEEDS CLARIFICATION: where does the account button go? Today it is the avatar at the top right of the map, and the phone layout keeps it there.]

## Capabilities

- **Modified:** `web-laptop-layout`. The requirement "Header is an empty full-width accent bar" changes from an empty bar to the content defined here. Its scenarios for full width and the accent background stay unless the clarifications change them.

## Out of scope

- The footer. It stays an empty placeholder until its own change.
- The phone layout (`web-mobile-layout`). It has no header and does not change.
- The tablet (iPad) layout, which needs its own change.
- The mobile app.

## Depends on

- `web-laptop-layout` (`openspec/specs/web-laptop-layout`).
- `web-account-sheet` (`openspec/specs/web-account-sheet`), only if the account button moves to the header.

## Decisions

- None yet. Waiting for the clarifications above.
