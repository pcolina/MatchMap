# Proposal: add-account-sheet

## Why

The web phone map has an account button at the top right (issue #43, delivered by `add-web-mobile-ui`), but tapping it does nothing. The account button should open everything about the user and the settings, in one place, without leaving the map.

## What Changes

- **Account button opens a side sheet.** Tapping the account button opens a sheet attached to the right edge of the screen. Its height and width fit its content, with a maximum width.
- **Sheet content, in this order:** the user information (username and email), the language, the day or night mode, and sign-out. Each item is a row with a text label and its value or action.
- **Closing.** The sheet closes on tap outside it, on Escape, and with a close control inside the sheet.
- **Pattern in the design.** The side sheet is added to `docs/design.md` as a new pattern (width by content, maximum width, how it closes), as the owner agreed in issue #43.

## Capabilities

- **New:** `web-account-sheet`. It defines the side sheet of the account button on phone-sized viewports.

## Out of scope

- The actions behind the rows: changing the language, switching day and night, and signing out. The rows are presentational in this change. Their logic is added in a later change, so that the sign-out and the language switch follow their own specs.
- The attribution entry in the sheet. The attribution button was removed from the map, so the sheet has no attribution entry.
- Tablet and laptop layouts. The sheet is for phone-sized viewports only.
- Friends and the add-place action (issues #41 and #42).

## Depends on

- `web-mobile-layout` (main spec, the account button in the top-right control group).
- Issue #43.

## Open questions

- [NEEDS CLARIFICATION: the sheet holds the user information. Is the user information shown with the username only, or username and email? The email is personal data, so the recommendation is username only, with the email shown in the account settings in a later change.]
