# world-map Delta

## MODIFIED Requirements

### Requirement: Capital point per country

The map SHALL show one point at the capital of each country, from the bundled Natural Earth populated places dataset. The radius of each point SHALL be 2 px at the minimum zoom of the map, SHALL grow by 1 px every three zoom levels above the minimum, and SHALL stop at 5 px from zoom 12 upwards. A capital point SHALL always be visible at every zoom level the map allows.

#### Scenario: Capital points are shown
- **WHEN** the map is shown
- **THEN** each country with a capital in the dataset has one point at that capital

#### Scenario: Smallest point at the minimum zoom
- **WHEN** the map is shown at the minimum zoom of 3
- **THEN** each capital point has a radius of 2 px

#### Scenario: Point grows every three zoom levels
- **WHEN** the zoom is 6, 9 or 12
- **THEN** each capital point has a radius of 3 px, 4 px or 5 px

#### Scenario: Point stops growing
- **WHEN** the zoom is above 12
- **THEN** each capital point has a radius of 5 px

#### Scenario: Points stay visible
- **WHEN** the map is shown at any zoom level it allows
- **THEN** each capital point has a radius of at least 2 px

### Requirement: Pan and zoom on phones

The mobile app on phone-sized screens SHALL let the user pan the map with one finger and zoom it with a pinch gesture. The gestures SHALL move and scale the map from bundled data only. The Mercator map SHALL NOT zoom out below zoom 3, SHALL NOT pan south of latitude -60, so that Antarctica is not shown, and SHALL keep the default maximum zoom of the MapLibre map view.

#### Scenario: Pan with one finger
- **WHEN** the user drags one finger across the map on a phone-sized screen
- **THEN** the view moves with the finger and the countries keep their position relative to each other

#### Scenario: Zoom with a pinch
- **WHEN** the user pinches on the map on a phone-sized screen
- **THEN** the map zooms in or out around the point between the fingers, and never below zoom 3

#### Scenario: Antarctica is not shown
- **WHEN** the user pans the map south
- **THEN** the view stops at latitude -60 and the Antarctic strip is not shown

#### Scenario: Gestures need no network service
- **WHEN** the user pans or zooms the map
- **THEN** no tile request is sent to an external service

## ADDED Requirements

### Requirement: Country borders are visible in both schemes

The map SHALL draw the country borders in a colour that stands out from the land colour in both schemes. In the day scheme the border colour SHALL be the `borderInput` token. In the night scheme it SHALL be the `textSecondary` token.

#### Scenario: Borders in day scheme
- **WHEN** the map is shown in day mode
- **THEN** the country borders use the `borderInput` token

#### Scenario: Borders in night scheme
- **WHEN** the map is shown in night mode
- **THEN** the country borders use the `textSecondary` token

### Requirement: Globe minimum zoom fits the container width

The web app's globe projection SHALL NOT zoom out below the zoom at which the globe fills the width of its container with a 4 px gap on each side. That zoom SHALL be log2((W − 8) · π / 512), where W is the width of the container in pixels.

#### Scenario: Globe on a phone width
- **WHEN** the globe is shown in a container 390 px wide
- **THEN** the minimum zoom is about 1.24 and the globe does not get smaller than 382 px

#### Scenario: Globe on a laptop width
- **WHEN** the globe is shown in a container 1024 px wide
- **THEN** the minimum zoom is about 2.64 and the globe does not get smaller than 1016 px

#### Scenario: Globe cannot zoom out further
- **WHEN** the user zooms out a globe that is at its minimum zoom
- **THEN** the zoom stays at the minimum zoom for the container width
