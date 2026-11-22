# Proposal: add-account-sheet

## Why

The web phone map has an account button at the top right (issue #43, delivered by `add-web-mobile-ui`), but tapping it does nothing. The account button should open everything about the user and the settings, in one place, without leaving the map.

## What Changes

- **Account button opens a side sheet.** Tapping the account button opens a sheet attached to the right edge of the screen. Its height and width fit its content, with a maximum width.
- **Soft fade.** The sheet and its backdrop fade in and out. With reduced motion set, the sheet appears and disappears at once.
- **Header.** The username of the user in the app's accent colour, with the email in smaller text under it, at the top of the sheet. Both come from the `me` query of the API and show a loading line until it answers.
- **One list, in this order, with no group headings:** view profile, language, day or night mode (a switch), an about entry, and sign out last, after a divider.
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
- The `me` query in `matchmap-api/contracts/graphql/account.graphqls` (baseline `ca97e41`, unchanged since the baseline).
- Issue #43.

## Decisions

- The sheet shows the username and the email, as the owner asked after registration. The email is personal data: it is shown only to the signed-in user, in smaller text under the name, and it is not sent to any other service.
- The rows form one compact list with no group headings, as the owner asked after the first review. Day or night mode is a switch, and sign out is the last row.
