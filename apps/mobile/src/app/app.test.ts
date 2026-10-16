import { render, screen } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';

test('shows the app name as a header', async () => {
  await render(App);

  expect(screen.getByRole('header', { name: 'MatchMap' })).toBeTruthy();
});
