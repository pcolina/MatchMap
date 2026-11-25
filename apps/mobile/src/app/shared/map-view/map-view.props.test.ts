import { buildMapStyle } from '@matchmap/shared';
import { describe, expect, it } from 'vitest';
import { colors, mapColors } from '../../core/theme/tokens.ts';
import countries from '../../../../../../packages/shared/geo/countries.json';
import capitals from '../../../../../../packages/shared/geo/capitals.json';
import { mapViewProps } from './map-view.props.ts';

const expectedStyle = (states: Record<string, 'visited' | 'lived' | 'wantToGo'>, scheme: 'day' | 'night') =>
  buildMapStyle({
    states,
    palette: scheme === 'day' ? mapColors.light : mapColors.dark,
    text: scheme === 'day' ? colors.light.text : colors.dark.text,
    excludeAntarctica: true,
    sources: { countries, capitals },
  });

describe('mapViewProps', () => {
  it('sends the style to the native view as JSON text, as the native view expects', () => {
    expect(typeof mapViewProps({}, 'day').mapStyle).toBe('string');
  });

  it('gives the phone map the same style as the web map in day mode', () => {
    expect(mapViewProps({}, 'day').mapStyle).toBe(JSON.stringify(expectedStyle({}, 'day')));
  });

  it('turns the gestures on for pan and zoom and off for rotation and pitch', () => {
    expect(mapViewProps({}, 'day')).toMatchObject({
      dragPan: true,
      touchZoom: true,
      doubleTapZoom: true,
      touchRotate: false,
      touchPitch: false,
    });
  });

  it('uses the night palette in night mode', () => {
    const states = { FR: 'visited' as const, IT: 'wantToGo' as const };

    expect(mapViewProps(states, 'night').mapStyle).toBe(JSON.stringify(expectedStyle(states, 'night')));
  });
});
