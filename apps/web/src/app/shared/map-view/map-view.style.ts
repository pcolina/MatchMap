import type { StyleSpecification } from 'maplibre-gl';
import { buildMapStyle as buildSharedMapStyle } from '@matchmap/shared';
import { colors, mapColors } from '../../../../../../tokens/tokens.ts';

export type MapScheme = 'day' | 'night';
export type MapState = 'visited' | 'lived' | 'wantToGo';

export const buildMapStyle = (states: Record<string, MapState>, scheme: MapScheme): StyleSpecification => {
  const palette = scheme === 'day' ? mapColors.light : mapColors.dark;
  const text = scheme === 'day' ? colors.light.text : colors.dark.text;

  return buildSharedMapStyle({
    states,
    palette,
    text,
    sources: {
      countries: new URL('/geo/countries.json', window.location.origin).href,
      capitals: new URL('/geo/capitals.json', window.location.origin).href,
    },
  }) as unknown as StyleSpecification;
};
