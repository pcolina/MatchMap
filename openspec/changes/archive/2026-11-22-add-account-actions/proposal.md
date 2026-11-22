# Proposal: add-account-actions

## Why

The account sheet (`web-account-sheet`, archived) shows its rows, but none of them acts. Three of them are simple and can work now: sign out, the day or night switch, and the about entry. Language and the profile stay out, as they need their own changes.

## What Changes

- **Sign out.** The last row calls the `logout` operation of the API (`POST /api/auth/logout`, web client, cookie based). Then it clears the access token in the app and goes to the sign-in page. If the call fails, the app still signs out on the device, so the user is never stuck signed in.
- **Day or night.** The switch in the Settings row reflects the mode in use. By default the app follows the system setting. Changing the switch applies at once across the app, and the choice is saved on this device, so it survives a reload. Nothing is sent to the API.
- **About.** The about row opens a small dialog with the app name, `matchMap`, and its version, `1.0.0`, shown in the accent colour. The dialog closes with its close control, Escape or a tap outside it, and focus returns to the about row. The version is a constant in the app for this release.

## Capabilities

- **Modified:** `web-account-sheet`. Its rows are no longer presentational: sign out, the day or night switch and about now act. The requirement that rows send no request and change no state is replaced for these three rows.
- **New:** `web-theme-mode`. It defines the light and dark choice: the default that follows the system, the saved choice on this device, and how the choice is applied to the whole app.

## Out of scope

- Language switch, view profile, and any other row not named above.
- Saving the day or night choice on the account or the server. This needs an API contract that does not exist.
- Changes to the sign-in flow beyond clearing the session on sign out.
- The map attribution (not requested).
- Tablet and laptop layouts.

## Depends on

- `web-account-sheet` (archived in `openspec/specs/web-account-sheet`).
- The `logout` operation in `matchmap-api/contracts/openapi/auth.yaml` (baseline `ca97e41`, unchanged since the baseline).

## Decisions

- Sign out clears the device session even when the API call fails. The alternative, keeping the user signed in after a failed call, leaves the user stuck with no way to sign out from the sheet. This is my choice; tell me if you want the other behaviour.
- The about dialog is a small native dialog opened from the sheet, not a new page, as chosen. Its content is only the name and the version.
- The version is `1.0.0`, the release version, kept as a constant in the app.
