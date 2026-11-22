import { describe, expect, it } from 'vitest';
import { buildMapStyle, type MapPalette } from '../src/map/map-style.ts';

const palette: MapPalette = {
  ocean: '#CCD7E6',
  land: '#E8ECF2',
  countryBorder: '#FFFFFF',
  visited: '#0F7C80',
  lived: '#0A5458',
  wantToGo: '#E3F4F2',
};

const sources = { countries: '/geo/countries.json', capitals: '/geo/capitals.json' };

describe('buildMapStyle', () => {
  it('returns the five layers in the web order', () => {
    const style = buildMapStyle({ states: {}, palette, text: '#111111', sources });

    expect(style.layers.map((layer) => layer.id)).toEqual([
      'background',
      'countries-fill',
      'countries-border',
      'countries-state-outline',
      'capitals-point',
    ]);
  });

  it('uses the ocean colour for the background', () => {
    const style = buildMapStyle({ states: {}, palette, text: '#111111', sources });

    expect(style.layers[0]).toMatchObject({ type: 'background', paint: { 'background-color': '#CCD7E6' } });
  });

  it('fills every country with the land colour when no state is set', () => {
    const style = buildMapStyle({ states: {}, palette, text: '#111111', sources });

    expect(style.layers[1]).toMatchObject({ id: 'countries-fill', paint: { 'fill-color': '#E8ECF2' } });
  });

  it('matches each state by iso_a2 with its palette colour', () => {
    const style = buildMapStyle({ states: { FR: 'visited', IT: 'wantToGo' }, palette, text: '#111111', sources });
    const fill = style.layers[1] as { paint: { 'fill-color': unknown[] } };

    expect(fill.paint['fill-color']).toEqual(['match', ['get', 'iso_a2'], 'FR', '#0F7C80', 'IT', '#E3F4F2', '#E8ECF2']);
  });

  it('outlines only the countries that have a state', () => {
    const style = buildMapStyle({ states: { FR: 'lived' }, palette, text: '#111111', sources });

    expect(style.layers[3]).toMatchObject({
      id: 'countries-state-outline',
      filter: ['in', ['get', 'iso_a2'], ['literal', ['FR']]],
      paint: { 'line-color': '#111111', 'line-width': 1.5 },
    });
  });

  it('uses the sources it is given, without building URLs', () => {
    const geo = { type: 'FeatureCollection', features: [] };
    const style = buildMapStyle({ states: {}, palette, text: '#111111', sources: { countries: geo, capitals: geo } });

    expect(style.sources).toEqual({
      countries: { type: 'geojson', data: geo },
      capitals: { type: 'geojson', data: geo },
    });
  });

  it('draws the capitals as circles in the text colour', () => {
    const style = buildMapStyle({ states: {}, palette, text: '#111111', sources });

    expect(style.layers[4]).toMatchObject({ id: 'capitals-point', type: 'circle', paint: { 'circle-color': '#111111' } });
  });
});
