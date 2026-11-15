import { colors, mapColors } from '../../../../../../tokens/tokens.ts';
import { buildMapStyle } from './map-view.style';

type Layer = { id: string; type: string; source?: string; paint?: Record<string, unknown>; filter?: unknown[] };
type Style = { version: number; sources: Record<string, unknown>; layers: Layer[]; glyphs?: string };

const layerById = (style: Style, id: string): Layer => {
  const layer = style.layers.find((candidate) => candidate.id === id);
  if (!layer) {
    throw new Error(`missing layer ${id}`);
  }
  return layer;
};

describe('buildMapStyle', () => {
  describe('background colours', () => {
    it('uses the day ocean colour as the background in day mode', () => {
      const style = buildMapStyle({}, 'day') as unknown as Style;

      expect(layerById(style, 'background').paint?.['background-color']).toBe(mapColors.light.ocean);
    });

    it('uses the night ocean colour as the background in night mode', () => {
      const style = buildMapStyle({}, 'night') as unknown as Style;

      expect(layerById(style, 'background').paint?.['background-color']).toBe(mapColors.dark.ocean);
    });
  });

  describe('country fill', () => {
    it('gives each state its map colour in day mode', () => {
      const style = buildMapStyle({ FR: 'visited', NO: 'lived', JP: 'wantToGo' }, 'day') as unknown as Style;
      const fill = layerById(style, 'countries-fill').paint?.['fill-color'] as unknown[];

      expect(fill).toEqual([
        'match',
        ['get', 'iso_a2'],
        'FR',
        mapColors.light.visited,
        'NO',
        mapColors.light.lived,
        'JP',
        mapColors.light.wantToGo,
        mapColors.light.land,
      ]);
    });

    it('gives each state its map colour in night mode', () => {
      const style = buildMapStyle({ FR: 'visited' }, 'night') as unknown as Style;
      const fill = layerById(style, 'countries-fill').paint?.['fill-color'] as unknown[];

      expect(fill).toEqual(['match', ['get', 'iso_a2'], 'FR', mapColors.dark.visited, mapColors.dark.land]);
    });

    it('gives every other country the land colour', () => {
      const style = buildMapStyle({ FR: 'visited' }, 'day') as unknown as Style;
      const fill = layerById(style, 'countries-fill').paint?.['fill-color'] as unknown[];

      expect(fill.at(-1)).toBe(mapColors.light.land);
    });

    it('uses the land colour for every country when no state is given', () => {
      const style = buildMapStyle({}, 'day') as unknown as Style;

      expect(layerById(style, 'countries-fill').paint?.['fill-color']).toBe(mapColors.light.land);
    });
  });

  describe('capitals and network', () => {
    it('draws one circle per capital from the capitals source in day mode', () => {
      const style = buildMapStyle({}, 'day') as unknown as Style;
      const capitals = layerById(style, 'capitals-point');

      expect(capitals.type).toBe('circle');
      expect(capitals.source).toBe('capitals');
      expect(capitals.paint?.['circle-color']).toBe(colors.light.text);
    });

    it('uses the night text colour for capital points in night mode', () => {
      const style = buildMapStyle({}, 'night') as unknown as Style;

      expect(layerById(style, 'capitals-point').paint?.['circle-color']).toBe(colors.dark.text);
    });

    it('has only GeoJSON sources, with no raster or vector tile source and no glyphs', () => {
      const style = buildMapStyle({ FR: 'visited' }, 'day') as unknown as Style;

      expect(Object.keys(style.sources).sort()).toEqual(['capitals', 'countries']);
      for (const source of Object.values(style.sources)) {
        expect((source as { type: string }).type).toBe('geojson');
      }
      expect(style.glyphs).toBeUndefined();
    });
  });

  describe('state outline', () => {
    it('draws a 1.5 px text-coloured outline only around the coloured countries in day mode', () => {
      const style = buildMapStyle({ FR: 'visited', JP: 'wantToGo' }, 'day') as unknown as Style;
      const outline = layerById(style, 'countries-state-outline');

      expect(outline.type).toBe('line');
      expect(outline.source).toBe('countries');
      expect(outline.paint?.['line-color']).toBe(colors.light.text);
      expect(outline.paint?.['line-width']).toBe(1.5);
      expect(outline.filter).toEqual(['in', ['get', 'iso_a2'], ['literal', ['FR', 'JP']]]);
    });

    it('uses the night text colour in night mode', () => {
      const style = buildMapStyle({ FR: 'visited' }, 'night') as unknown as Style;

      expect(layerById(style, 'countries-state-outline').paint?.['line-color']).toBe(colors.dark.text);
    });

    it('draws the outline above the country fill', () => {
      const style = buildMapStyle({ FR: 'visited' }, 'day') as unknown as Style;
      const ids = style.layers.map((layer) => layer.id);

      expect(ids.indexOf('countries-state-outline')).toBeGreaterThan(ids.indexOf('countries-fill'));
    });
  });
});
