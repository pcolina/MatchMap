import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStartArgs, buildExpoEnv } from './start.mjs';

test('no argument starts the app without mocks', () => {
  assert.deepEqual(parseStartArgs([]), { mock: false });
});

test('mock starts the app with mocks', () => {
  assert.deepEqual(parseStartArgs(['mock']), { mock: true });
});

test('any other argument fails with the usage', () => {
  assert.throws(() => parseStartArgs(['other']), /Usage: pnpm mobile \[mock\]/);
});

test('mock sets the public mock flag for the Expo bundle', () => {
  assert.equal(buildExpoEnv({ mock: true }).EXPO_PUBLIC_MATCHMAP_MOCKS, 'true');
});

test('no mock does not set the public mock flag', () => {
  assert.equal(buildExpoEnv({ mock: false }).EXPO_PUBLIC_MATCHMAP_MOCKS, undefined);
});
