import { createRequire } from 'node:module';
import { expect, test } from 'vitest';

const require = createRequire(import.meta.url);

test('declares the icon and secure storage packages', () => {
  expect(require.resolve('@ng-icons/core/package.json')).toBeTruthy();
  expect(require.resolve('@ng-icons/tabler-icons/package.json')).toBeTruthy();
  expect(require.resolve('expo-secure-store/package.json')).toBeTruthy();
});
