# web-mobile-layout Delta

## MODIFIED Requirements

### Requirement: Top-right avatar control

The web main screen on phone-sized viewports SHALL show one avatar control at the top right over the map. While the user information is loading, the avatar SHALL show a grey placeholder circle with the shape of the avatar, as `docs/design.md` section 7.9 requires. While at least one notification is pending, the avatar SHALL show a red dot, and its accessible name SHALL state the number of pending notifications, from an i18n key. When no notification is pending, the avatar SHALL show no dot.

#### Scenario: Avatar placeholder while loading
- **WHEN** the user information is loading
- **THEN** the avatar control shows a grey circle with no pulse when reduced motion is set

#### Scenario: Avatar control is alone at the top right
- **WHEN** the phone layout is shown
- **THEN** no other control is at the top right of the map

#### Scenario: Red dot while notifications are pending
- **WHEN** at least one notification is pending
- **THEN** the avatar control shows a red dot and its accessible name states the number of pending notifications

#### Scenario: No dot without pending notifications
- **WHEN** no notification is pending
- **THEN** the avatar control shows no dot and its accessible name does not state a count
