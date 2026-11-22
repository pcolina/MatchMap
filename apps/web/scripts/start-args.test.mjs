import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStartArgs } from './start-args.mjs';

const usage = /Usage: pnpm web \[mock \[-l\]\]/;

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
