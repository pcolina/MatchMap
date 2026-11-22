# mobile-startup Specification

## ADDED Requirements

### Requirement: Start-up without an uncaught error

The mobile app SHALL start without an uncaught error. Its start-up initializers SHALL run to the end, so the router can show its first screen.

#### Scenario: Start-up with no session shows the sign-in page
- **WHEN** the mobile app starts with no stored session and no auto sign-in flag
- **THEN** the start-up completes without an uncaught error and the sign-in page is shown

#### Scenario: Start-up with auto sign-in shows the signed-in screen
- **WHEN** the mobile app starts with the mock flag and the auto sign-in flag on
- **THEN** the start-up completes without an uncaught error and the app is signed in as `one@matchmap.test`

### Requirement: Translation start-up

The mobile app SHALL load the `en` and `es` translations at start-up and SHALL select the language of the device when it is `en` or `es`, and `en` otherwise.

#### Scenario: Device language is Spanish
- **WHEN** the mobile app starts on a device whose language is `es`
- **THEN** the translations `en` and `es` are loaded, `es` is selected, and no uncaught error is raised

#### Scenario: Device language is not supported
- **WHEN** the mobile app starts on a device whose language is neither `en` nor `es`
- **THEN** the translations `en` and `es` are loaded, `en` is selected, and no uncaught error is raised

### Requirement: Start-up regression test

The start-up of the mobile app SHALL be covered by an automated test that fails when the translation initializer or the session initializer raises an error.

#### Scenario: Initializer error is detected
- **WHEN** the translation initializer raises an error during start-up
- **THEN** the automated start-up test fails
