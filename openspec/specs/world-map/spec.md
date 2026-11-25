# world-map Specification

## Purpose

Shows the world map of the web app, with each country's border, a capital point and a colour for its state, as the base of the personal map. It shows no data from the API yet.

## Requirements

### Requirement: World map view

The web app and the mobile app on phone-sized screens SHALL show a world map in the Mercator projection, with the country borders drawn from the bundled Natural Earth 1:50m countries dataset. The web app SHALL also offer the globe projection, as described in "Projection choice". The map SHALL be a presentational component with no store and no API call.

#### Scenario: World map is shown
- **WHEN** the main route is shown in the web app or in the mobile app on a phone-sized screen
- **THEN** a world map is shown with the borders of every country, in the Mercator projection when no other projection is chosen

#### Scenario: Map fills the page
- **WHEN** the main route is shown on the web app at any supported width, or on a phone-sized screen of the mobile app
- **THEN** the map fills the full width and the full height of the map area of its page

#### Scenario: Map needs no network service
- **WHEN** the map loads
- **THEN** it draws the countries and the background from bundled data and the map tokens, with no tile request to an external service

### Requirement: Capital point per country

The map SHALL show one point at the capital of each country, from the bundled Natural Earth populated places dataset. The radius of each point SHALL be 2 px at the minimum zoom of the map, SHALL grow by 1 px every three zoom levels above the minimum, and SHALL stop at 5 px from zoom 12 upwards. A capital point SHALL always be visible at every zoom level the map allows.

#### Scenario: Capital points are shown
- **WHEN** the map is shown
- **THEN** each country with a capital in the dataset has one point at that capital

#### Scenario: Smallest point at the minimum zoom
- **WHEN** the map is shown at the minimum zoom of -2
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

The mobile app on phone-sized screens SHALL let the user pan the map with one finger and zoom it with a pinch gesture. The gestures SHALL move and scale the map from bundled data only. The Mercator map SHALL NOT zoom out below zoom -2, which is the lowest zoom MapLibre allows, and SHALL keep the default maximum zoom of the MapLibre map view.

#### Scenario: Pan with one finger
- **WHEN** the user drags one finger across the map on a phone-sized screen
- **THEN** the view moves with the finger and the countries keep their position relative to each other

#### Scenario: Zoom with a pinch
- **WHEN** the user pinches on the map on a phone-sized screen
- **THEN** the map zooms in or out around the point between the fingers, and never below zoom -2

#### Scenario: Gestures need no network service
- **WHEN** the user pans or zooms the map
- **THEN** no tile request is sent to an external service

### Requirement: Projection choice

The web app's map SHALL switch between the Mercator projection and the globe projection when the user presses the view toggle. The switch SHALL NOT reload the page, SHALL NOT change the zoom level the user has reached, and SHALL NOT change the country states or the capital points.

#### Scenario: Switch to the globe
- **WHEN** the user presses the view toggle while the Mercator projection is shown
- **THEN** the map is drawn as a globe, with the same countries, capital points and colours

#### Scenario: Switch back to Mercator
- **WHEN** the user presses the view toggle while the globe is shown
- **THEN** the map is drawn in the Mercator projection, with the same countries, capital points and colours

#### Scenario: States are the same in both projections
- **WHEN** a country has a colour state and the projection is switched
- **THEN** the country keeps the same colour and the same outline in both projections

### Requirement: The chosen projection is kept on this device

The chosen projection SHALL be kept on this device by the web app and applied again when the web app is opened. The projection choice SHALL NOT be sent to the API. The default, when nothing is saved, SHALL be the Mercator projection.

#### Scenario: Default is Mercator
- **WHEN** the app is opened and no projection is saved on this device
- **THEN** the map is shown in the Mercator projection

#### Scenario: Choice survives a reload
- **WHEN** the user chooses the globe and then reloads the app
- **THEN** the app opens with the globe projection

#### Scenario: No request for the projection choice
- **WHEN** the user switches the projection
- **THEN** no request is sent to the API

#### Scenario: Storage unavailable
- **WHEN** the device does not keep the choice, for example in a private window
- **THEN** the map still switches projection for the current session and opens in the Mercator projection on the next load

### Requirement: Country borders are visible in both schemes

The map SHALL draw the country borders in a colour that stands out from the land colour in both schemes. In the day scheme the border colour SHALL be the `borderInput` token. In the night scheme it SHALL be the `textSecondary` token.

#### Scenario: Borders in day scheme
- **WHEN** the map is shown in day mode
- **THEN** the country borders use the `borderInput` token

#### Scenario: Borders in night scheme
- **WHEN** the map is shown in night mode
- **THEN** the country borders use the `textSecondary` token

### Requirement: Globe minimum zoom fits the container

The web app's globe projection SHALL NOT be smaller than its container in either direction. The globe SHALL NOT zoom out below the zoom at which its diameter, with a 4 px gap on each side, equals the smaller of the container width and height. That zoom SHALL be log2((S − 8) · π / 512), where S is the smaller of the width W and the height H of the container, in pixels.

#### Scenario: Globe on a phone width
- **WHEN** the globe is shown in a container 390 px wide and 844 px high
- **THEN** the minimum zoom is about 1.23 and the globe does not get smaller than 382 px

#### Scenario: Globe limited by the height
- **WHEN** the globe is shown in a container 1024 px wide and 700 px high
- **THEN** the minimum zoom is about 2.09 and the globe does not get smaller than 692 px

#### Scenario: Globe cannot zoom out further
- **WHEN** the user zooms out a globe that is at its minimum zoom
- **THEN** the zoom stays at the minimum zoom for the container

### Requirement: Antarctica is not shown in Mercator

The Mercator map SHALL NOT draw Antarctica and SHALL NOT let the visible area go south of latitude -60. When the visible bottom of the map goes south of latitude -60, the map SHALL move north until the bottom is at latitude -60. The globe SHALL keep Antarctica and SHALL NOT be limited.

#### Scenario: Antarctica is hidden in Mercator
- **WHEN** the map is shown in Mercator
- **THEN** the Antarctica country area is not drawn

#### Scenario: The view stops at latitude -60
- **WHEN** the user pans the Mercator map so that the visible bottom is south of latitude -60
- **THEN** the map moves north until the visible bottom is at latitude -60

#### Scenario: Globe keeps Antarctica
- **WHEN** the map is shown as a globe
- **THEN** Antarctica is drawn and the view is not limited

### Requirement: Mercator starts centred on latitude 42

The web Mercator map SHALL start at the smallest zoom it allows, centred on longitude 0 and latitude 42, and SHALL show the world once horizontally.

#### Scenario: Start view
- **WHEN** the Mercator map is first shown
- **THEN** the map is centred on latitude 42 at zoom -2

#### Scenario: World shown once
- **WHEN** the user pans the Mercator map sideways
- **THEN** the world does not repeat horizontally

### Requirement: Laptop view toggle

The web laptop layout SHALL show the globe/Mercator toggle in the same position and with the same behaviour as on phone-sized screens.

#### Scenario: Toggle visible on laptop
- **WHEN** the viewport is 601 px or wider
- **THEN** the globe/Mercator toggle is visible above the stats bar

#### Scenario: Toggle switches the projection
- **WHEN** the user presses the toggle
- **THEN** the map switches from Mercator to globe, or from globe to Mercator

#### Scenario: Toggle is reachable by keyboard
- **WHEN** the user moves through the page with Tab
- **THEN** the toggle receives focus and has an accessible name from an i18n key
