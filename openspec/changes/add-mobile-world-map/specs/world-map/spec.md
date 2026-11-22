# world-map Delta

## MODIFIED Requirements

### Requirement: World map view

The web app and the mobile app on phone-sized screens SHALL show a world map in the Mercator projection, with the country borders drawn from the bundled Natural Earth 1:50m countries dataset. The map SHALL be a presentational component with no store and no API call.

#### Scenario: World map is shown
- **WHEN** the main route is shown in the web app or in the mobile app on a phone-sized screen
- **THEN** a world map in the Mercator projection is shown with the borders of every country

#### Scenario: Map fills the page
- **WHEN** the main route is shown on the web app at any supported width, or on a phone-sized screen of the mobile app
- **THEN** the map fills the full width and the full height of the map area of its page

#### Scenario: Map needs no network service
- **WHEN** the map loads
- **THEN** it draws the countries and the background from bundled data and the map tokens, with no tile request to an external service

## ADDED Requirements

### Requirement: Pan and zoom on phones

The mobile app on phone-sized screens SHALL let the user pan the map with one finger and zoom it with a pinch gesture. The gestures SHALL move and scale the map from bundled data only.

#### Scenario: Pan with one finger
- **WHEN** the user drags one finger across the map on a phone-sized screen
- **THEN** the view moves with the finger and the countries keep their position relative to each other

#### Scenario: Zoom with a pinch
- **WHEN** the user pinches on the map on a phone-sized screen
- **THEN** the map zooms in or out around the point between the fingers

#### Scenario: Gestures need no network service
- **WHEN** the user pans or zooms the map
- **THEN** no tile request is sent to an external service

[NEEDS CLARIFICATION: what are the minimum and maximum zoom levels of the phone map? The web spec defines no zoom, and a value is not guessed.]
