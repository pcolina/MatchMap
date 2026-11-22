import '@angular/compiler';
import { ColorScheme } from '@ng-native/device';
import { render, screen } from '@ng-native/testing';
import { TranslateService } from '@ngx-translate/core';
import { describe, expect, test } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { colors } from '../../core/theme/tokens.ts';
import { MainLayout } from './main-layout.ts';

const translate = {
  instant: (key: string): string => {
    const value = key.split('.').reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      en as Record<string, unknown>,
    );
    return typeof value === 'string' ? value : key;
  },
};

const renderWithScheme = (scheme: 'light' | 'dark') =>
  render(MainLayout, {
    providers: [
      { provide: TranslateService, useValue: translate },
      { provide: ColorScheme.SOURCE, useValue: { current: () => scheme, subscribe: () => () => undefined } },
    ],
  });

describe('MainLayout', () => {
  test('shows a map area and the stats-resume panel', async () => {
    await renderWithScheme('light');

    expect(screen.getByTestId('map-area')).toBeTruthy();
    expect(screen.getByTestId('stats-resume')).toBeTruthy();
  });

  test('the map area holds the world map', async () => {
    await renderWithScheme('light');

    expect(screen.getByRole('image', { name: 'World map' })).toBeTruthy();
  });

  test('the map area takes the leftover height', async () => {
    await renderWithScheme('light');

    expect(screen.getByTestId('map-area').props).toMatchObject({ flex: 1 });
  });

  test('the map area uses the neutral bg token in the light scheme', async () => {
    await renderWithScheme('light');

    expect(screen.getByTestId('map-area').props).toMatchObject({ backgroundColor: colors.light.bg });
  });

  test('the map area uses the neutral bg token in the dark scheme', async () => {
    await renderWithScheme('dark');

    expect(screen.getByTestId('map-area').props).toMatchObject({ backgroundColor: colors.dark.bg });
  });

  test('the layout is inside a safe area view', async () => {
    await renderWithScheme('light');

    expect(screen.getByTestId('main-safe-area').viewName).toBe('RNCSafeAreaView');
  });
});
