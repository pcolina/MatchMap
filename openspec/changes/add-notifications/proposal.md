# Proposal: add-notifications

## Why

The main screen has an account button at the top right (`web-mobile-layout`, "Top-right avatar control") that opens the account sheet (`web-account-sheet`). The user has no way to see that something new is waiting for them. A notifications row in the account sheet and a red dot on the avatar tell the user that there is an unread notification.

## What Changes

- The account sheet gets one more row, "Notifications". It goes second in the list, after view profile and before language, because it is the item the user most needs to reach from the account menu.
- A notification is pending when it has been received and not read. When there is at least one pending notification, a red dot shows on the avatar control. When there are none, no dot is shown.
- The dot is never the only cue: the avatar's accessible name states the number of pending notifications.
- Pressing the Notifications row does nothing in this change. No list is opened, no state changes and no request is sent. The row is a button with an accessible name.
- Notifications are stored on the device only. No API operation is added, and nothing is sent to the API.
- The change applies to the web app and to the mobile app, so both have the same behaviour (CLAUDE.md §1).

## Capabilities

- **New:** `notifications`. The rule for what a pending notification is, and where the pending count is kept on the device.
- **Modified:** `web-account-sheet`. The requirement "Rows form one list in order" gets the Notifications row between view profile and language.
- **Modified:** `web-mobile-layout`. The requirement "Top-right avatar control" gets the red dot and the accessible name with the pending count.
- **Mobile:** the mobile account button, sheet and top-right avatar are a separate change (`add-mobile-account-sheet`, to be opened). The mobile part of this change starts only after that change is archived.

## Out of scope

- Opening a list of notifications, or any other action on the Notifications row. Decided later, with its own change.
- Creating notifications from a server, from push notifications, email, or any other source sent by the system.
- Marking notifications as read from the user interface.
- Notification settings (turning types on or off).
- Tablet and laptop layouts (each needs its own change).

## Depends on

- `web-account-sheet` (`openspec/specs/web-account-sheet`).
- `web-mobile-layout` (`openspec/specs/web-mobile-layout`).
- `add-mobile-account-sheet` (separate change, not yet opened), for the mobile part.
- No API contract: no notification operation exists in `matchmap-api/contracts/` (checked at commit `ca97e41`), and this change does not add one.

## Decisions

- Local only: notifications and their read state are kept on the device.
- The source of notifications and their read state are deferred; this change reads only the stored pending count.
- The Notifications row sits second in the account sheet, after view profile.
- The red dot appears when at least one notification is pending, and the avatar's accessible name carries the count.

## Open questions

- Where notifications come from and how they become read is not defined in this change and will be decided later. This change only defines how the dot reads the pending count stored on the device.
- Only one change can be open at a time (CLAUDE.md §2). `add-notifications` is open, so `add-mobile-account-sheet` cannot be opened until this change is archived or paused. [NEEDS CLARIFICATION: archive order. Pause this change and open `add-mobile-account-sheet` first, or finish the web part of this change first?]
