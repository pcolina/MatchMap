import { mapColors } from '../../../../../../tokens/tokens.ts';
import { buildMapStyle } from './map-view.style';

type Layer = { id: string; type: string; source?: string; paint?: Record<string, unknown> };
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

});
