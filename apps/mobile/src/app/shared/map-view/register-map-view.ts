import { registerViewName } from '@ng-native/fabric';

export const registerMapView = (): void => {
  registerViewName('maplibre-map', 'MLRNMapView');
};
