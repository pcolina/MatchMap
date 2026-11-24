import { buildMapStyle as buildSharedMapStyle } from '@matchmap/shared';
import { describe, expect, it } from 'vitest';
import { colors, mapColors } from '../../../../../../tokens/tokens.ts';
import { buildMapStyle } from './map-view.style';

const urlOf = (path: string) => new URL(path, window.location.origin).href;

const sharedStyle = (states: Record<string, 'visited' | 'lived' | 'wantToGo'>, scheme: 'day' | 'night') => {
  const palette = scheme === 'day' ? mapColors.light : mapColors.dark;
  const text = scheme === 'day' ? colors.light.text : colors.dark.text;

  return buildSharedMapStyle({
    states,
    palette,
    text,
    sources: { countries: urlOf('/geo/countries.json'), capitals: urlOf('/geo/capitals.json') },
  });
};

describe('web map style parity with the shared style', () => {
  const states = { FR: 'visited' as const, IT: 'wantToGo' as const };

  it.each(['day', 'night'] as const)('matches the shared style with no states in %s mode', (scheme) => {
    expect(buildMapStyle({}, scheme)).toEqual(sharedStyle({}, scheme));
  });

  it.each(['day', 'night'] as const)('matches the shared style with filled states in %s mode', (scheme) => {
    expect(buildMapStyle(states, scheme)).toEqual(sharedStyle(states, scheme));
  });
});

describe('web map style projection', () => {
  const states = { FR: 'visited' as const };

  it('adds the globe projection to the style in both schemes', () => {
    const globeOf = (scheme: 'day' | 'night', accent: string) => {
      const shared = sharedStyle(states, scheme);
      return {
        ...shared,
        projection: { type: 'globe' },
        layers: shared.layers.map((layer) => (layer['id'] === 'background' ? { ...layer, paint: { 'background-color': accent } } : layer)),
      };
    };
    expect(buildMapStyle(states, 'day', 'globe')).toEqual(globeOf('day', colors.light.accent));
    expect(buildMapStyle(states, 'night', 'globe')).toEqual(globeOf('night', colors.dark.accent));
  });

  it('keeps the Mercator style equal to the shared style, with no projection field', () => {
    expect(buildMapStyle(states, 'day', 'mercator')).toEqual(sharedStyle(states, 'day'));
    expect(buildMapStyle(states, 'day')).toEqual(sharedStyle(states, 'day'));
  });
});

describe('web map style globe background', () => {
  const backgroundOf = (style: { layers: { id: string; paint?: Record<string, unknown> }[] }) =>
    style.layers.find((layer) => layer.id === 'background')?.paint?.['background-color'];

  it('paints the globe background with the accent colour in day mode', () => {
    expect(backgroundOf(buildMapStyle({}, 'day', 'globe') as never)).toBe(colors.light.accent);
  });

  it('paints the globe background with the accent colour in night mode', () => {
    expect(backgroundOf(buildMapStyle({}, 'night', 'globe') as never)).toBe(colors.dark.accent);
  });
});
