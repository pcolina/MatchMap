# Proposal: add-notifications

## Why

The main screen has an account button at the top right (`web-mobile-layout`, "Top-right avatar control") that opens the account sheet (`web-account-sheet`). The user has no way to see that something new is waiting for them. A notifications row in the account sheet and a red dot on the avatar tell the user that there is an unread notification.

## What Changes

- The account sheet gets one more row, "Notifications". It goes second in the list, after view profile and before language, because it is the item the user most needs to reach from the account menu.
- A notification is pending when it has been received and not read. When there is at least one pending notification, a red dot shows on the avatar control. When there are none, no dot is shown.
- The dot is never the only cue: the avatar's accessible name states the number of pending notifications.
- Pressing the Notifications row does nothing in this change. No list is opened, no state changes and no request is sent. The row is a button with an accessible name.
- Notifications are stored on the device only. No API operation is added, and nothing is sent to the API.
- This change applies to the web app. The mobile app follows in a later change, after `add-mobile-account-sheet` is archived (see Capabilities).

## Capabilities

- **New:** `notifications`. The rule for what a pending notification is, and where the pending count is kept on the device.
- **Modified:** `web-account-sheet`. The requirement "Rows form one list in order" gets the Notifications row between view profile and language.
- **Modified:** `web-mobile-layout`. The requirement "Top-right avatar control" gets the red dot and the accessible name with the pending count.
- **Mobile, later change:** the mobile account button, sheet and top-right avatar are `add-mobile-account-sheet`, which comes first. The mobile Notifications row and red dot are a further change after it. Neither is part of this change.

## Out of scope

- Opening a list of notifications, or any other action on the Notifications row. Decided later, with its own change.
- Creating notifications from a server, from push notifications, email, or any other source sent by the system.
- Marking notifications as read from the user interface.
- Notification settings (turning types on or off).
- Tablet and laptop layouts (each needs its own change).

## Depends on

- `web-account-sheet` (`openspec/specs/web-account-sheet`).
- `web-mobile-layout` (`openspec/specs/web-mobile-layout`).
- No mobile dependency in this change. The mobile part comes later, after `add-mobile-account-sheet`.
- No API contract: no notification operation exists in `matchmap-api/contracts/` (checked at commit `ca97e41`), and this change does not add one.

## Decisions

- Local only: notifications and their read state are kept on the device.
- The source of notifications and their read state are deferred; this change reads only the stored pending count.
- The Notifications row sits second in the account sheet, after view profile.
- The red dot appears when at least one notification is pending, and the avatar's accessible name carries the count.

## Open questions

- Where notifications come from and how they become read is not defined in this change and will be decided later. This change only defines how the dot reads the pending count stored on the device.
- Order: this web change is done and archived first. Only then `add-mobile-account-sheet` is opened, followed by the mobile notifications change (CLAUDE.md §2, one open change at a time).
