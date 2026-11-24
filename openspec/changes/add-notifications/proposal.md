# Proposal: add-notifications

## Why

The web main screen has an account button at the top right (`web-mobile-layout`, "Top-right avatar control") that opens the account sheet (`web-account-sheet`). The user has no way to see that something new is waiting for them. A notifications entry in the account sheet and a red dot on the avatar tell the user that there is something to read.

## What Changes

- The account sheet gets one more row, "Notifications", in the list of rows. Its position in the list is a [NEEDS CLARIFICATION: where in the row order does the Notifications row go?].
- When there are notifications, a red dot shows on the avatar control at the top right of the web main screen. When there are none, no dot is shown.
- [NEEDS CLARIFICATION: what does pressing the Notifications row do? Open a list of notifications, or only show the count in this change?]

## Capabilities

- **New:** `web-notifications`. Rules for the notifications row, the list of notifications (if any), and the red dot.
- **Modified:** `web-account-sheet`. The requirement "Rows form one list in order" gets the Notifications row.
- **Modified:** `web-mobile-layout`. The requirement "Top-right avatar control" gets the red dot.

## Out of scope

- [NEEDS CLARIFICATION: is the mobile app in scope, or is it a separate change as with the globe toggle?]
- Push notifications, email notifications or any notification sent to the device by the system.
- Notification settings (turning types on or off).
- Tablet and laptop layouts (each needs its own change).

## Depends on

- `web-account-sheet` (`openspec/specs/web-account-sheet`).
- `web-mobile-layout` (`openspec/specs/web-mobile-layout`).
- [NEEDS CLARIFICATION: where do the notifications come from? No notification operation exists in `matchmap-api/contracts/` (checked at commit `ca97e41`). A new GraphQL operation would start in `contracts/` first, as CLAUDE.md §2 requires, or the data is only local for now.]

## Decisions

- None yet. Waiting for the clarifications above.
