import { describe, expect, it, vi } from 'vitest';

const registerViewName = vi.fn();

vi.mock('@ng-native/fabric', () => ({ registerViewName: (...args: unknown[]) => registerViewName(...args) }));

describe('registerMapView', () => {
  it('maps the maplibre-map element to the MapLibre native map view', async () => {
    const { registerMapView } = await import('./register-map-view.ts');

    registerMapView();

    expect(registerViewName).toHaveBeenCalledWith('maplibre-map', 'MLRNMapView');
  });
});
