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
- **New, mobile:** the mobile app has no account sheet and no top-right avatar yet (checked in `openspec/specs/mobile-main-layout` and `openspec/specs/mobile-startup`, and in `apps/mobile/src`). The account button, the sheet and the avatar must exist on mobile before the Notifications row and the dot can be added. [NEEDS CLARIFICATION: should this change also create the mobile account button and sheet, with the rows that the web sheet has (view profile, language, day or night mode, about, sign out), or should mobile be a separate change that comes first?]

## Out of scope

- Opening a list of notifications, or any other action on the Notifications row. Decided later, with its own change.
- Creating notifications from a server, from push notifications, email, or any other source sent by the system.
- Marking notifications as read from the user interface.
- Notification settings (turning types on or off).
- Tablet and laptop layouts (each needs its own change).

## Depends on

- `web-account-sheet` (`openspec/specs/web-account-sheet`).
- `web-mobile-layout` (`openspec/specs/web-mobile-layout`).
- `mobile-main-layout` (`openspec/specs/mobile-main-layout`), for the mobile part.
- No API contract: no notification operation exists in `matchmap-api/contracts/` (checked at commit `ca97e41`), and this change does not add one.

## Decisions

- Local only: notifications and their read state are kept on the device.
- The Notifications row sits second in the account sheet, after view profile.
- The red dot appears when at least one notification is pending, and the avatar's accessible name carries the count.

## Open questions

- [NEEDS CLARIFICATION: how does a notification arrive on the device, and how does it become read? The row does nothing and there is no API, so with the current answers a notification can never be created and the dot can never clear. Options: (a) a local list that this change seeds with fixed sample notifications so the dot can be seen; (b) a way to mark all as read from the account sheet, which would be an action on the row, so it contradicts "the row does nothing"; (c) the list and its read state come later, and this change only defines how the dot reads a pending count stored on the device.]
- [NEEDS CLARIFICATION: the mobile account button and sheet, see "What Changes".]
