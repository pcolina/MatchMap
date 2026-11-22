# api-mocks Delta

## ADDED Requirements

### Requirement: Auto sign-in flag at start-up

The web and mobile start commands SHALL accept the flag `-l` after `mock`, as in `pnpm web mock -l` and `pnpm mobile mock -l`. With the flag, the app SHALL start with a session already signed in as `one@matchmap.test`, through the mocked sign-in with that user's email and password. The flag SHALL take effect only when the mock flag is on. Without the flag, the app SHALL show the sign-in page at start-up as before.

#### Scenario: Web starts signed in with the flag
- **WHEN** the web app is started with `pnpm web mock -l`
- **THEN** the app opens with `one@matchmap.test` signed in and no sign-in page is shown

#### Scenario: Mobile starts signed in with the flag
- **WHEN** the mobile app is started with `pnpm mobile mock -l`
- **THEN** the app opens with `one@matchmap.test` signed in and no sign-in page is shown

#### Scenario: Auto sign-in uses the mocked sign-in
- **WHEN** the app starts with `-l`
- **THEN** the sign-in is answered by the mock and no request for it reaches the API

#### Scenario: Flag without mock is a usage error
- **WHEN** the start command is run with `-l` and without `mock`, as in `pnpm web -l`
- **THEN** the command prints the usage message and exits with an error, and the app does not start

#### Scenario: Unknown argument is a usage error
- **WHEN** the start command is run with an argument other than `mock` or `-l`
- **THEN** the command prints the usage message and exits with an error

#### Scenario: Start without the flag shows the sign-in page
- **WHEN** the app starts with `pnpm web mock` or `pnpm mobile mock`, without `-l`
- **THEN** the sign-in page is shown and no session is opened

#### Scenario: Flag applies at every start
- **WHEN** the user signs out in an app started with `-l`, and then reloads the page or restarts the app
- **THEN** the app signs in as `one@matchmap.test` again

## MODIFIED Requirements

### Requirement: Documentation

The `README.md` SHALL document, for the web app and for the mobile app, how to start the app with the mock flag, the mock users and their passwords, how to reset the mock users, how to start the app without the flag, and the `-l` flag that signs in as `one@matchmap.test` at start-up.

#### Scenario: README lists the mock users
- **WHEN** a developer reads the README section of each app
- **THEN** the section names both mock users and their passwords

#### Scenario: README explains the reset
- **WHEN** a developer reads the README section of each app
- **THEN** the section explains how to clear the browser storage to reset the mock users

#### Scenario: README explains the flag
- **WHEN** a developer reads the README section of each app
- **THEN** the section shows `-l` after `mock`, says it signs in as `one@matchmap.test`, and says it needs `mock`
