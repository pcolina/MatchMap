# notifications Delta

## ADDED Requirements

### Requirement: Pending notifications

A notification is pending when it has been received on this device and has not been read. The pending count is the number of pending notifications kept on this device. This capability does not define how notifications arrive or how they become read.

#### Scenario: No notifications
- **WHEN** no notification is kept on this device
- **THEN** the pending count is 0

#### Scenario: Received and not read
- **WHEN** a notification is kept on this device and is not read
- **THEN** it is counted in the pending count

#### Scenario: Read notifications are not counted
- **WHEN** a notification is kept on this device and is read
- **THEN** it is not counted in the pending count

### Requirement: The pending count is kept on this device only

The app SHALL read the pending count from this device when it opens. The pending count SHALL NOT be sent to the API and SHALL NOT be fetched from it.

#### Scenario: Count is read on open
- **WHEN** the app opens
- **THEN** the pending count is read from this device

#### Scenario: No request for the pending count
- **WHEN** the app shows the pending count
- **THEN** no request is sent to the API
