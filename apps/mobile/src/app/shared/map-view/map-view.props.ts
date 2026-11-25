import { buildMapStyle, type MapState } from '@matchmap/shared';
import countries from '../../../../../../packages/shared/geo/countries.json';
import capitals from '../../../../../../packages/shared/geo/capitals.json';
import { colors, mapColors } from '../../core/theme/tokens.ts';

export type MapScheme = 'day' | 'night';

export const mapViewProps = (states: Record<string, MapState>, scheme: MapScheme) => ({
  mapStyle: JSON.stringify(buildMapStyle({
    states,
    palette: scheme === 'day' ? mapColors.light : mapColors.dark,
    text: scheme === 'day' ? colors.light.text : colors.dark.text,
    excludeAntarctica: true,
    sources: { countries, capitals },
  })),
  dragPan: true,
  touchZoom: true,
  doubleTapZoom: true,
  touchRotate: false,
  touchPitch: false,
});
