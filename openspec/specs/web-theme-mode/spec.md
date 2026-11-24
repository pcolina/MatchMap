# web-theme-mode Specification

## Purpose

The day or night mode of the web app: it follows the system setting until the user chooses, the switch in the account sheet changes the whole app at once, and the choice is kept on this device only and never sent to the API.

## Requirements

### Requirement: The app follows the system mode until the user chooses

When the user has not chosen a mode on this device, the app SHALL show the light or dark mode that the system uses.

#### Scenario: No saved choice
- **WHEN** no mode is saved on this device
- **THEN** the app shows the mode of the system setting

### Requirement: The day or night switch changes the mode of the whole app

Activating the day or night switch in the account sheet SHALL switch the whole app to the other mode at once, and SHALL save that choice on this device. The switch SHALL expose whether dark mode is on.

#### Scenario: Switch to dark mode
- **WHEN** the user activates the switch while the app is in light mode
- **THEN** the whole app shows dark mode and the switch exposes that dark mode is on

#### Scenario: Switch back to light mode
- **WHEN** the user activates the switch while the app is in dark mode
- **THEN** the whole app shows light mode and the switch exposes that dark mode is off

### Requirement: The saved choice is kept on this device only

A chosen mode SHALL be kept on this device, and SHALL be applied again when the app is opened. The mode choice SHALL NOT be sent to the API.

#### Scenario: Choice survives a reload
- **WHEN** the user chooses dark mode and then reloads the app
- **THEN** the app opens in dark mode

#### Scenario: No request for the mode choice
- **WHEN** the user changes the mode
- **THEN** no request is sent to the API

#### Scenario: Storage unavailable
- **WHEN** the device cannot save the choice
- **THEN** the switch still changes the mode for the current session and the app follows the system mode when it is opened again
