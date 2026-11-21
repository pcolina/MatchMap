import '@angular/compiler';
import { Accessibility, ColorScheme } from '@ng-native/device';
import { render, screen, userEvent } from '@ng-native/testing';
import { TranslateService } from '@ngx-translate/core';
import { describe, expect, test, vi } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { colors } from '../../core/theme/tokens.ts';
import { StatsResume } from './stats-resume.ts';

const translate = {
  instant: (key: string): string => {
    const value = key.split('.').reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      en as Record<string, unknown>,
    );
    return typeof value === 'string' ? value : key;
  },
};

const screenPanel = () => screen.getByTestId('stats-resume');

const renderWithScheme = (scheme: 'light' | 'dark') =>
  render(StatsResume, {
    providers: [
      { provide: TranslateService, useValue: translate },
      { provide: ColorScheme.SOURCE, useValue: { current: () => scheme, subscribe: () => () => undefined } },
      { provide: Accessibility.SOURCE, useValue: { current: async () => ({ screenReader: false, reduceMotion: false, boldText: false, fontScale: 1 }), subscribe: () => () => undefined, announce: () => undefined } },
    ],
  });

describe('StatsResume panel', () => {
  test('has a fixed height of 250 px', async () => {
    await renderWithScheme('light');

    expect(screenPanel().props).toMatchObject({ height: 250 });
  });

  test('uses the accent token in the light scheme', async () => {
    await renderWithScheme('light');

    expect(screenPanel().props).toMatchObject({ backgroundColor: colors.light.accent });
  });

  test('clips its content and is not a scroll view', async () => {
    await renderWithScheme('light');

    expect(screenPanel().props).toMatchObject({ overflow: 'hidden' });
    expect(screenPanel().type).not.toBe('scroll-view');
  });

  test('is announced as a button with the translated label', async () => {
    await renderWithScheme('light');

    expect(screen.getByRole('button', { name: 'Statistics summary' })).toBeTruthy();
  });

  test('emits one press when tapped and nothing else', async () => {
    const { componentRef } = await renderWithScheme('light');
    const presses = vi.fn();
    componentRef.instance.press.subscribe(presses);

    await userEvent.setup().press(screen.getByRole('button', { name: 'Statistics summary' }));

    expect(presses).toHaveBeenCalledTimes(1);
  });

  test('uses the accent token in the dark scheme', async () => {
    await renderWithScheme('dark');

    expect(screenPanel().props).toMatchObject({ backgroundColor: colors.dark.accent });
  });
});
