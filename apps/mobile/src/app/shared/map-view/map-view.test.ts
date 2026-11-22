import '@angular/compiler';
import { signal } from '@angular/core';
import { ColorScheme, type ColorSchemeSource, type Scheme } from '@ng-native/device';
import { render } from '@ng-native/testing';
import { TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import { MapView } from './map-view.ts';
import { mapViewProps } from './map-view.props.ts';

const schemeSource = (scheme: Scheme): ColorSchemeSource => ({
  current: () => scheme,
  subscribe: () => () => undefined,
});

const renderMap = async (scheme: Scheme) => {
  const { componentRef } = await render(MapView, {
    providers: [
      { provide: ColorScheme.SOURCE, useValue: schemeSource(scheme) },
      { provide: TranslateService, useValue: { instant: (key: string) => key } },
    ],
  });
  return componentRef.instance as unknown as { props: () => ReturnType<typeof mapViewProps> };
};

describe('MapView', () => {
  it('uses the day palette in light mode', async () => {
    const map = await renderMap('light');

    expect(map.props().mapStyle).toEqual(mapViewProps({}, 'day').mapStyle);
  });

  it('uses the night palette in dark mode', async () => {
    const map = await renderMap('dark');

    expect(map.props().mapStyle).toEqual(mapViewProps({}, 'night').mapStyle);
  });
});
