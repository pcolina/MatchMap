export type MapState = 'visited' | 'lived' | 'wantToGo';

export type MapPalette = {
  ocean: string;
  land: string;
  countryBorder: string;
  visited: string;
  lived: string;
  wantToGo: string;
};

export type GeoSource = string | object;

export type BuildMapStyleInput = {
  states: Record<string, MapState>;
  palette: MapPalette;
  text: string;
  sources: { countries: GeoSource; capitals: GeoSource };
  excludeAntarctica?: boolean;
};

const antarcticaFilter = ['!=', ['get', 'iso_a2'], 'AQ'];

export type MapStyle = {
  version: 8;
  sources: Record<string, { type: 'geojson'; data: GeoSource }>;
  layers: Array<Record<string, unknown>>;
};

export const buildMapStyle = ({ states, palette, text, sources, excludeAntarctica = false }: BuildMapStyleInput): MapStyle => {
  const countryFilter = excludeAntarctica ? { filter: antarcticaFilter } : {};
  const stateColors = Object.entries(states).flatMap(([countryCode, state]) => [countryCode, palette[state]]);
  const fillColor = stateColors.length === 0 ? palette.land : ['match', ['get', 'iso_a2'], ...stateColors, palette.land];

  return {
    version: 8,
    sources: {
      countries: { type: 'geojson', data: sources.countries },
      capitals: { type: 'geojson', data: sources.capitals },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': palette.ocean } },
      { id: 'countries-fill', type: 'fill', source: 'countries', ...countryFilter, paint: { 'fill-color': fillColor } },
      {
        id: 'countries-border',
        type: 'line',
        source: 'countries',
        ...countryFilter,
        paint: { 'line-color': palette.countryBorder, 'line-width': 0.5 },
      },
      {
        id: 'countries-state-outline',
        type: 'line',
        source: 'countries',
        filter: ['in', ['get', 'iso_a2'], ['literal', Object.keys(states)]],
        paint: { 'line-color': text, 'line-width': 1.5 },
      },
      {
        id: 'capitals-point',
        type: 'circle',
        source: 'capitals',
        paint: { 'circle-color': text, 'circle-radius': ['step', ['zoom'], 2, 6, 3, 9, 4, 12, 5] },
      },
    ],
  };
};
