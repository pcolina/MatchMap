# Spec: world-map

## ADDED Requirements

### Requirement: World map view

The web app SHALL show a world map in the Mercator projection, with the country borders drawn from the bundled Natural Earth 1:50m countries dataset. The map SHALL be a presentational component with no store and no API call.

#### Scenario: World map is shown
- **WHEN** the main route is shown in the web app
- **THEN** a world map in the Mercator projection is shown with the borders of every country

#### Scenario: Map fills the page
- **WHEN** the main route is shown on the web app at any supported width
- **THEN** the map fills the full width and the full height of the page area

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
- **THEN** it keeps the map land colour

#### Scenario: Colour is not the only cue
- **WHEN** a country is coloured
- **THEN** it also has a visible outline, so the state can be told apart without colour (`docs/design.md` §2.2)

### Requirement: Map background from the map tokens

The map background SHALL use the ocean and land colours from the map tokens, in day and night.

#### Scenario: Background colours
- **WHEN** the map is shown in day mode
- **THEN** the ocean and the land use the day values of the map tokens

#### Scenario: Night colours
- **WHEN** the map is shown in night mode
- **THEN** the ocean and the land use the night values of the map tokens
