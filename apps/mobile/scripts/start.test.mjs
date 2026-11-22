import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStartArgs, buildExpoEnv } from './start.mjs';

const usage = /Usage: pnpm mobile \[mock \[-l\]\]/;

test('no argument starts the app without mocks and without auto sign-in', () => {
  assert.deepEqual(parseStartArgs([]), { mock: false, autoLogin: false });
});

test('mock starts the app with mocks', () => {
  assert.deepEqual(parseStartArgs(['mock']), { mock: true, autoLogin: false });
});

test('mock followed by -l starts the app with mocks and auto sign-in', () => {
  assert.deepEqual(parseStartArgs(['mock', '-l']), { mock: true, autoLogin: true });
});

test('-l without mock fails with the usage', () => {
  assert.throws(() => parseStartArgs(['-l']), usage);
});

test('-l before mock fails with the usage', () => {
  assert.throws(() => parseStartArgs(['-l', 'mock']), usage);
});

test('any other argument fails with the usage', () => {
  assert.throws(() => parseStartArgs(['other']), usage);
});

test('more than two arguments fail with the usage', () => {
  assert.throws(() => parseStartArgs(['mock', '-l', 'extra']), usage);
});

test('an unknown argument after mock fails with the usage', () => {
  assert.throws(() => parseStartArgs(['mock', 'extra']), usage);
});

test('mock sets the public mock flag for the Expo bundle', () => {
  assert.equal(buildExpoEnv({ mock: true, autoLogin: false }).EXPO_PUBLIC_MATCHMAP_MOCKS, 'true');
});

test('no mock does not set the public mock flag', () => {
  assert.equal(buildExpoEnv({ mock: false, autoLogin: false }).EXPO_PUBLIC_MATCHMAP_MOCKS, undefined);
});

test('auto sign-in sets the public auto sign-in flag for the Expo bundle', () => {
  assert.equal(buildExpoEnv({ mock: true, autoLogin: true }).EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN, 'true');
});

test('without auto sign-in the public auto sign-in flag is not set', () => {
  assert.equal(buildExpoEnv({ mock: true, autoLogin: false }).EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN, undefined);
});

test('no mock does not set the public auto sign-in flag', () => {
  assert.equal(buildExpoEnv({ mock: false, autoLogin: false }).EXPO_PUBLIC_MATCHMAP_AUTO_LOGIN, undefined);
});
