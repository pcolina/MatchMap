# Proposal: add-account-sheet

## Why

The web phone map has an account button at the top right (issue #43, delivered by `add-web-mobile-ui`), but tapping it does nothing. The account button should open everything about the user and the settings, in one place, without leaving the map.

## What Changes

- **Account button opens a side sheet.** Tapping the account button opens a sheet attached to the right edge of the screen. Its height and width fit its content, with a maximum width.
- **Soft fade.** The sheet and its backdrop fade in and out. With reduced motion set, the sheet appears and disappears at once.
- **Header.** The display name of the user, at the top of the sheet.
- **Blocks, in this order:**
  1. **Account:** view profile.
  2. **Settings:** language, and day or night mode.
  3. **About:** an about entry.
  4. **Session:** sign out.
- **Closing.** The sheet closes on tap outside it, on Escape, and with a close control in its header.
- **Pattern in the design.** The side sheet is added to `docs/design.md` as a new pattern (width by content, maximum width, fade, how it closes), as agreed in issue #43.

## Capabilities

- **New:** `web-account-sheet`. It defines the side sheet of the account button on phone-sized viewports: the header, the blocks, the fade and the closing.

## Out of scope

- The actions behind the rows: opening the profile, the about page, changing the language, switching day and night, and signing out. The rows are presentational in this change. Their logic is added in later changes, so that sign-out and the language switch follow their own specs.
- The attribution entry in the sheet. The attribution button was removed from the map, so the sheet has no attribution entry.
- Tablet and laptop layouts. The sheet is for phone-sized viewports only.
- Friends and the add-place action (issues #41 and #42).

## Depends on

- `web-mobile-layout` (main spec, the account button in the top-right control group).
- Issue #43.

## Decisions

- The sheet shows the display name only, not the email. The email is personal data and is not needed here. Its place is the profile, in a later change.
- The rows are grouped in blocks, so each block has one purpose and the sheet stays short.
