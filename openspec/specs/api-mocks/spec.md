# api-mocks Specification

## Purpose

Lets the web and mobile apps run without the API, behaving as the real API does for sign-in, registration and the account operations, with responses read from mock data files and a table that lists every mock.

## Requirements

### Requirement: Mock switch at start-up

The web and mobile apps SHALL read a mock flag when they start. When the flag is on, the app SHALL answer the mocked operations from the mock data and SHALL send no request to the API for them. When the flag is off, the app SHALL behave as it does without this capability. The flag SHALL be off by default.

#### Scenario: Flag on answers from the mock
- **WHEN** the app starts with the mock flag on and the user signs in with `one@matchmap.test`
- **THEN** the sign-in succeeds and no request for the sign-in reaches the API

#### Scenario: Flag off keeps the real API
- **WHEN** the app starts without the mock flag
- **THEN** the app sends its requests to the API as before

#### Scenario: Flag is off by default
- **WHEN** the app starts with no mock flag set
- **THEN** the mock is not active

### Requirement: Responses come from mock data files

The mock SHALL build every response of a mocked operation from a data file in the repository. The mock logic SHALL NOT contain fixed response bodies. The users SHALL come from a users data file.

#### Scenario: Changing a data file changes the response
- **WHEN** a value in the users data file is changed and the app is started again
- **THEN** the mock answers with the changed value

#### Scenario: Users come from the users file
- **WHEN** the app starts with the mock flag on for the first time in a browser
- **THEN** the sign-in accounts are the users of the users data file

### Requirement: Mocked operations

With the mock flag on, the mock SHALL answer the operations `login`, `refresh`, `logout`, `register`, `me` and `apiVersion`. The mock works with email and password only. The operation `signInWithGoogle` SHALL NOT be mocked. Its row in the mock table SHALL have the status "not mocked".

#### Scenario: Email sign-in is answered by the mock
- **WHEN** the mock flag is on and the user signs in with email and password
- **THEN** the sign-in is answered by the mock and no request for it reaches the API

### Requirement: Sign-in with email and password

The mock login SHALL accept the email and password of a user in the users data file, and SHALL return the same token response shape as the contract: `tokenType` `Bearer`, `accessToken` and `expiresIn`. The email SHALL be trimmed and lower-cased before the comparison, as the API does. For the web client, the mock SHALL NOT return `refreshToken` in the body. For the mobile client, the mock SHALL return `refreshToken` in the body.

#### Scenario: Correct credentials for the web client
- **WHEN** the web client sends `one@matchmap.test` with the correct password
- **THEN** the response is 200 with `tokenType` `Bearer`, an `accessToken` and an `expiresIn`, and no `refreshToken` in the body

#### Scenario: Correct credentials for the mobile client
- **WHEN** the mobile client sends `one@matchmap.test` with the correct password
- **THEN** the response is 200 and includes a `refreshToken` in the body

#### Scenario: Email is normalised before the comparison
- **WHEN** the user sends `  One@MatchMap.test ` with the correct password
- **THEN** the sign-in succeeds

### Requirement: Sign-in credential error

The mock login SHALL return 401 with the body `{ "error": "invalid_credentials" }` for a wrong password and for an unknown email, with the same response in both cases.

#### Scenario: Wrong password
- **WHEN** the user sends `one@matchmap.test` with a wrong password
- **THEN** the response is 401 with `{ "error": "invalid_credentials" }`

#### Scenario: Unknown email
- **WHEN** the user sends an email that is not in the users data file
- **THEN** the response is 401 with `{ "error": "invalid_credentials" }`

### Requirement: Sign-in client and email errors

The mock login SHALL return `invalid_client` (400) when the `X-Client` header is missing or is not `web` or `mobile`, and SHALL return `invalid_email` (400) or `email_too_long` (400) for an email that breaks its rules, with the body `{ "error": <code> }`. The email rules are those of the validators in `packages/shared`: not empty, standard format, and at most 254 characters after trimming and lower-casing.

#### Scenario: Invalid email format
- **WHEN** the user sends `not-an-email`
- **THEN** the response is 400 with `{ "error": "invalid_email" }`

#### Scenario: Email too long
- **WHEN** the user sends an email of 255 characters
- **THEN** the response is 400 with `{ "error": "email_too_long" }`

#### Scenario: Missing or unknown client header
- **WHEN** the request has no `X-Client` header, or a value other than `web` or `mobile`
- **THEN** the response is 400 with `{ "error": "invalid_client" }`

### Requirement: Sign-in password error

The mock login SHALL return `invalid_password` (400) when the password has fewer than 6 or more than 20 characters, with the body `{ "error": "invalid_password" }`.

#### Scenario: Password outside its limits
- **WHEN** the user sends a password of 5 characters
- **THEN** the response is 400 with `{ "error": "invalid_password" }`

### Requirement: Login throttling

The mock SHALL count failed logins per email. After 5 failed logins within 15 minutes, the next login for that email SHALL return 429 with `{ "error": "too_many_attempts" }` and a `Retry-After` header with the seconds left in the window. The window SHALL start at the first failure. A successful login SHALL reset the count for that email.

#### Scenario: Sixth attempt is throttled
- **WHEN** the user sends five wrong passwords for `one@matchmap.test` and then the correct password within 15 minutes
- **THEN** the sixth response is 429 with `{ "error": "too_many_attempts" }` and a `Retry-After` header

#### Scenario: Window expires
- **WHEN** 15 minutes pass after the first failure and the user sends the correct password
- **THEN** the sign-in succeeds

#### Scenario: Success resets the count
- **WHEN** the user sends four wrong passwords and then the correct password, and then four wrong passwords
- **THEN** the last four responses are 401 with `invalid_credentials`, and none is 429

### Requirement: Refresh

The mock refresh SHALL return new tokens and SHALL invalidate the refresh token it received. A refresh token that is unknown, already used or revoked SHALL return 401 with `{ "error": "invalid_refresh_token" }`. For the web client the refresh token SHALL be sent and received as the real API does, through the refresh token cookie, and for the mobile client through the request body.

#### Scenario: Refresh rotates the token
- **WHEN** a client refreshes with a valid refresh token
- **THEN** the response is 200 with a new access token, and the old refresh token no longer works

#### Scenario: Reused refresh token
- **WHEN** a client refreshes twice with the same refresh token
- **THEN** the second response is 401 with `{ "error": "invalid_refresh_token" }`

### Requirement: Logout

The mock logout SHALL revoke the session of the refresh token and SHALL return 204. It SHALL return 204 as well when the token is unknown or missing.

#### Scenario: Logout revokes the session
- **WHEN** a signed-in client logs out
- **THEN** the response is 204 and the refresh token no longer works

#### Scenario: Logout with an unknown token
- **WHEN** a client logs out with a token the mock does not know
- **THEN** the response is 204

### Requirement: Registration

The mock register mutation SHALL create a user with the email and password given, store the email trimmed and lower-cased, and return the `User` type of the contract.

#### Scenario: Valid registration
- **WHEN** a user registers with a new valid email and a valid password
- **THEN** the mutation returns the new user with `id`, `email`, `username` and `createdAt`

#### Scenario: Registration stores the normalised email
- **WHEN** a user registers with `New.User@MatchMap.test`
- **THEN** the returned `email` is `new.user@matchmap.test`

### Requirement: Registration email rule

The mock register mutation SHALL require the email to be not blank, in standard format and at most 254 characters. A failed rule SHALL return `VALIDATION_FAILED` with `extensions.field` `email`.

#### Scenario: Input breaks the email rule
- **WHEN** a user registers with an empty email
- **THEN** the error has `extensions.code` `VALIDATION_FAILED` and `extensions.field` `email`

### Requirement: Registration password rule

The mock register mutation SHALL require the password to have 6 to 20 characters, at least one lowercase letter, at least one uppercase letter, at least one special character from the OWASP ASCII list, and no whitespace. Letters and digits are not special characters, and Unicode characters are allowed. A failed rule SHALL return `PASSWORD_INVALID` with `extensions.field` `password`.

#### Scenario: Password breaks the rule
- **WHEN** a user registers with the password `abcdef`
- **THEN** the error has `extensions.code` `PASSWORD_INVALID` and `extensions.field` `password`

### Requirement: Email already in use

The mock register mutation SHALL return the error code `EMAIL_TAKEN` when the email belongs to an existing user.

#### Scenario: Email already in use
- **WHEN** a user registers with the email of an existing user
- **THEN** the error has `extensions.code` `EMAIL_TAKEN`

### Requirement: Username on register

The mock SHALL derive the username of a new user from the email local part, as the API does: lower-cased, every character outside `a-z0-9_` replaced by `_`, cut to 30 characters. When the result has fewer than 3 characters, the username SHALL be `user_` followed by 8 random characters from `a-z0-9`. When the username is taken, the mock SHALL add `_2`, `_3` and so on, so that the username is unique.

#### Scenario: Username from the email
- **WHEN** a user registers with `jane.doe@matchmap.test`
- **THEN** the username is `jane_doe`

#### Scenario: Short local part
- **WHEN** a user registers with `ab@matchmap.test`
- **THEN** the username starts with `user_` and has 13 characters

#### Scenario: Taken username gets a suffix
- **WHEN** a user registers with `mock.user@matchmap.test`, whose username `mock_user` is already taken
- **THEN** the username is `mock_user_2`

### Requirement: Me and apiVersion

With a valid access token, the mock `me` query SHALL return the signed-in user's `id`, `email`, `username` and `createdAt`. Without one, it SHALL return the authentication error. The mock `apiVersion` query SHALL return the project version `0.1.0-SNAPSHOT`.

#### Scenario: Me returns the signed-in user
- **WHEN** a signed-in user queries `me`
- **THEN** the result has the user's `id`, `email`, `username` and `createdAt`

#### Scenario: Me without a token
- **WHEN** a client queries `me` without an access token
- **THEN** the query fails with an authentication error

#### Scenario: Api version
- **WHEN** a client queries `apiVersion`
- **THEN** the result is `0.1.0-SNAPSHOT`

### Requirement: Registered users persist in the browser

Users registered through the mock SHALL be kept in the browser storage, so they remain after a page reload, as accounts do in the API. The users data file SHALL be the starting set. Clearing the browser storage for the app SHALL return the mock to the users data file. The access token SHALL be kept in memory only.

#### Scenario: Registered user survives a reload
- **WHEN** a user registers, reloads the page, and signs in with the new account
- **THEN** the sign-in succeeds

#### Scenario: Clearing the storage resets the users
- **WHEN** the browser storage of the app is cleared and the app is reloaded
- **THEN** only the users of the users data file can sign in

#### Scenario: Access token is not stored
- **WHEN** a user signs in and reloads the page
- **THEN** no access token is found in the browser storage

### Requirement: Mock users

The users data file SHALL contain two users, `one@matchmap.test` with password `One-pass1` and `two@matchmap.test` with password `Two-pass2`. Both passwords SHALL meet the password rule of the contract.

#### Scenario: Both mock users can sign in
- **WHEN** a user signs in with each mock user and its password
- **THEN** both sign-ins succeed

### Requirement: Mock table

The file `Mock-system.md` at the repository root SHALL list every mock in one table with the columns: ID, app (web, mobile or both), transport, operation or endpoint, data file, contract (a file in `contracts/`, or "none") and status. Operations that are not mocked SHALL appear in the table with the status "not mocked". Removing a mock SHALL be done by removing its row.

#### Scenario: Every mocked operation has a row
- **WHEN** the mock table is read
- **THEN** each mocked operation of this capability has one row with its data file and its contract

#### Scenario: Google sign-in has a row
- **WHEN** the mock table is read
- **THEN** the `signInWithGoogle` row has the status "not mocked"

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
