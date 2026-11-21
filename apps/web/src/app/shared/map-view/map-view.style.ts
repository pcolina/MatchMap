import type { StyleSpecification } from 'maplibre-gl';
import { colors, mapColors } from '../../../../../../tokens/tokens.ts';

export type MapScheme = 'day' | 'night';
export type MapState = 'visited' | 'lived' | 'wantToGo';

export const buildMapStyle = (states: Record<string, MapState>, scheme: MapScheme): StyleSpecification => {
  const palette = scheme === 'day' ? mapColors.light : mapColors.dark;
  const text = scheme === 'day' ? colors.light.text : colors.dark.text;
  const stateColors = Object.entries(states).flatMap(([countryCode, state]) => [countryCode, palette[state]]);
  const fillColor = stateColors.length === 0 ? palette.land : ['match', ['get', 'iso_a2'], ...stateColors, palette.land];

  return {
    version: 8,
    sources: {
      countries: { type: 'geojson', data: new URL('/geo/countries.geojson', window.location.origin).href },
      capitals: { type: 'geojson', data: new URL('/geo/capitals.geojson', window.location.origin).href },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': palette.ocean } },
      { id: 'countries-fill', type: 'fill', source: 'countries', paint: { 'fill-color': fillColor as never } },
      {
        id: 'countries-state-outline',
        type: 'line',
        source: 'countries',
        filter: ['in', ['get', 'iso_a2'], ['literal', Object.keys(states)]] as never,
        paint: { 'line-color': text, 'line-width': 1.5 },
      },
      { id: 'capitals-point', type: 'circle', source: 'capitals', paint: { 'circle-color': text } },
    ],
  };
};
