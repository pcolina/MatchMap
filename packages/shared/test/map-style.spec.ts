import { describe, expect, it } from 'vitest';
import tokens from '../../../tokens/tokens.json';
import { buildMapStyle } from '../src/map/map-style';

const palette = {
  ocean: '#CCD7E6',
  land: '#E8ECF2',
  countryBorder: tokens.map.countryBorder.light,
  visited: '#0F7C80',
  lived: '#0A5458',
  wantToGo: '#E3F4F2',
};

const style = () =>
  buildMapStyle({
    states: {},
    palette,
    text: '#111827',
    sources: { countries: 'countries.json', capitals: 'capitals.json' },
  });

describe('map style', () => {
  it('sizes the capital points by zoom in steps: 2 px from zoom 3, 3 px from 6, 4 px from 9, 5 px from 12', () => {
    const capitals = style().layers.find((layer) => layer.id === 'capitals-point');
    const paint = capitals?.paint as Record<string, unknown>;

    expect(paint['circle-radius']).toEqual(['step', ['zoom'], 2, 6, 3, 9, 4, 12, 5]);
  });

  it('draws the day country borders in the borderInput colour of the map tokens', () => {
    expect(tokens.map.countryBorder.light).toBe('#6B7485');
    const border = style().layers.find((layer) => layer.id === 'countries-border');
    expect((border?.paint as Record<string, unknown>)['line-color']).toBe('#6B7485');
  });

  it('draws the night country borders in the textSecondary colour of the map tokens', () => {
    expect(tokens.map.countryBorder.dark).toBe('#9AA6BA');
    const night = buildMapStyle({
      states: {},
      palette: { ...palette, countryBorder: tokens.map.countryBorder.dark },
      text: '#EEF2F8',
      sources: { countries: 'countries.json', capitals: 'capitals.json' },
    });
    const border = night.layers.find((layer) => layer.id === 'countries-border');
    expect((border?.paint as Record<string, unknown>)['line-color']).toBe('#9AA6BA');
  });
});
