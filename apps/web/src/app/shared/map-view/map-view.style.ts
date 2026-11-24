import type { LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { buildMapStyle as buildSharedMapStyle } from '@matchmap/shared';
import { colors, mapColors } from '../../../../../../tokens/tokens.ts';
import type { MapProjection } from '../../core/map-projection/map-projection.store';

export type MapScheme = 'day' | 'night';
export type MapState = 'visited' | 'lived' | 'wantToGo';

export const buildMapStyle = (
  states: Record<string, MapState>,
  scheme: MapScheme,
  projection: MapProjection = 'mercator',
): StyleSpecification => {
  const palette = scheme === 'day' ? mapColors.light : mapColors.dark;
  const text = scheme === 'day' ? colors.light.text : colors.dark.text;

  const style = buildSharedMapStyle({
    states,
    palette,
    text,
    sources: {
      countries: new URL('/geo/countries.json', window.location.origin).href,
      capitals: new URL('/geo/capitals.json', window.location.origin).href,
    },
  }) as unknown as StyleSpecification;

  if (projection !== 'globe') {
    return style;
  }

  const accent = scheme === 'day' ? colors.light.accent : colors.dark.accent;
  return {
    ...style,
    projection: { type: 'globe' },
    layers: style.layers.map((layer) =>
      layer.id === 'background' ? ({ ...layer, paint: { 'background-color': accent } } as LayerSpecification) : layer,
    ),
  };
};
