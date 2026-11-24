# Design: add-notifications

## Scope of this design

Web only, as in `proposal.md`. No API call and no contract change: the pending count is read from this device. The API baseline is recorded for the next change that calls it: `matchmap-api` at commit `ca97e41`.

## Decisions

### 1. Pending count is a device value, read through a store

The pending count is stored on the device under the key `matchmap.notifications.pending`, as a whole number. A `NotificationsStore` in `apps/web/src/app/core/notifications/` follows the pattern of `ThemeStore` and `MapProjectionStore`: `@ngrx/signals` `signalStore` with `providedIn: 'root'`, the count read at creation, and a `pending` computed signal (`count > 0`).

- Reads and writes go through try/catch. A missing, empty or non-numeric value reads as 0.
- The store has no method that writes the count in this change. How notifications arrive and become read is deferred (see `proposal.md`), so the store only reads.
- Tests use the stored value to drive the count; no test sends a request.

### 2. Wiring follows the existing layout inputs

- `MainLayout` reads `NotificationsStore` and passes the count to the top-right avatar control through an input, the same way it passes `accountOpen` and `globeActive` today.
- `AccountSheet` gets one new row, Notifications, between view profile and language. It is a button with an accessible name and emits an output that nothing listens to, so pressing it changes nothing. The row is presentational, as the spec says.

### 3. The red dot

- The dot is a decorative element with `aria-hidden="true"`. The accessible name of the avatar carries the count, so the dot is never the only cue (`docs/design.md` section 10).
- Colour: the `danger` token (`colors.light.danger` `#B91C1C`, dark `#F87171`). The palette has one accent, and the dot is an alert, not the accent. Contrast of the dot against the avatar surface must meet 3:1 for a graphical element (WCAG 1.4.11). The check is part of task 4 of `tasks.md` before the change is closed.
- Position: at the top-right of the avatar, as the user asked. It sits on the edge of the avatar circle, clear of the initials. Its size and offset are not set here; they are checked on screen in the visual check of the tasks, and any value not in `docs/design.md` is asked for before it is used.

### 4. Accessible name with the count

The avatar's accessible name comes from i18n keys, with no hard-coded text:

- With no pending notifications: the existing avatar name key, unchanged.
- With pending notifications: a new key `account.avatar.labelWithPending` with the count as a parameter, for example "Account, 3 unread notifications" in English. The `es` and `en` translations are listed under "Translations to review" in the PR.

### 5. Motion

The dot appears without animation. It does not pulse, which is also what the reduced-motion rule requires.

## Risks

- The dot can only be seen with a pending count stored on the device. Until the notifications source is defined, the dot can be checked only by setting the stored value in a test or in the browser.
- The `danger` colour on the avatar surface needs a visual check in day and night mode before the change is closed.

## Performance

No new network request and no new asset. No performance budget changes.
