# api-mocks Delta

## ADDED Requirements

### Requirement: Mock unread notifications on sign-in

The users data file SHALL give each mock user the number of unread notifications in the field `unreadNotifications`. When the mock sign-in succeeds with the mock flag on, the web app SHALL write that number to the pending count kept on this device (`matchmap.notifications.pending`), replacing the previous value. A user without the field, or with 0, SHALL leave the pending count at 0. The mock SHALL NOT change the sign-in response that the API contract defines.

#### Scenario: User one has one unread notification
- **WHEN** `one@matchmap.test` signs in with the mock flag on
- **THEN** the pending count on this device is 1 and the avatar shows the red dot

#### Scenario: User two has no unread notification
- **WHEN** `two@matchmap.test` signs in with the mock flag on
- **THEN** the pending count on this device is 0 and the avatar shows no dot

#### Scenario: Flag off
- **WHEN** the app runs without the mock flag
- **THEN** the pending count on this device is not changed by sign-in
