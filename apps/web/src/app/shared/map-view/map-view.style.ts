import type { StyleSpecification } from 'maplibre-gl';
import { mapColors } from '../../../../../../tokens/tokens.ts';

export type MapScheme = 'day' | 'night';
export type MapState = 'visited' | 'lived' | 'wantToGo';

export const buildMapStyle = (states: Record<string, MapState>, scheme: MapScheme): StyleSpecification => {
  const colors = scheme === 'day' ? mapColors.light : mapColors.dark;
  const stateColors = Object.entries(states).flatMap(([countryCode, state]) => [countryCode, colors[state]]);
  const fillColor = stateColors.length === 0 ? colors.land : ['match', ['get', 'iso_a2'], ...stateColors, colors.land];

  return {
    version: 8,
    sources: {
      countries: { type: 'geojson', data: '/geo/countries.geojson' },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': colors.ocean } },
      { id: 'countries-fill', type: 'fill', source: 'countries', paint: { 'fill-color': fillColor as never } },
    ],
  };
};
