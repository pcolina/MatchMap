# world-map Specification

## Purpose

Shows the world map of the web app, with each country's border, a capital point and a colour for its state, as the base of the personal map. It shows no data from the API yet.

## Requirements

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

### Requirement: Capital point per country

The map SHALL show one point at the capital of each country, from the bundled Natural Earth populated places dataset.

#### Scenario: Capital points are shown
- **WHEN** the map is shown
- **THEN** each country with a capital in the dataset has one point at that capital

### Requirement: Colour per country

The map SHALL colour each country that has a colour state supplied by its page, using a data-driven fill keyed by the country's `iso_a2` code. The colours SHALL come from the map tokens (`mapColors`).

#### Scenario: Country with a colour state
- **WHEN** a country code is supplied with a colour state
- **THEN** that country is filled with the colour of the state from the map tokens

#### Scenario: Country without a colour state
- **WHEN** a country has no colour state
- **THEN** it keeps the `map.land` colour, the default for unmarked countries

#### Scenario: WANT_TO_GO is a colour
- **WHEN** a country has the `WANT_TO_GO` colour state
- **THEN** it is filled with the `wantToGo` colour from the map tokens, with no dashed border

#### Scenario: Colour is not the only cue
- **WHEN** a country is coloured
- **THEN** it also has a visible outline, so the state can be told apart without colour (`docs/design.md` Â§2.2)

### Requirement: Map background from the map tokens

The map background SHALL use the ocean and land colours from the map tokens, in day and night.

#### Scenario: Background colours
- **WHEN** the map is shown in day mode
- **THEN** the ocean and the land use the day values of the map tokens

#### Scenario: Night colours
- **WHEN** the map is shown in night mode
- **THEN** the ocean and the land use the night values of the map tokens

### Requirement: Pan and zoom on phones

The mobile app on phone-sized screens SHALL let the user pan the map with one finger and zoom it with a pinch gesture. The gestures SHALL move and scale the map from bundled data only. The zoom range SHALL be the default minimum and maximum zoom of the MapLibre map view.

#### Scenario: Pan with one finger
- **WHEN** the user drags one finger across the map on a phone-sized screen
- **THEN** the view moves with the finger and the countries keep their position relative to each other

#### Scenario: Zoom with a pinch
- **WHEN** the user pinches on the map on a phone-sized screen
- **THEN** the map zooms in or out around the point between the fingers

#### Scenario: Gestures need no network service
- **WHEN** the user pans or zooms the map
- **THEN** no tile request is sent to an external service
