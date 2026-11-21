import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStartArgs } from './start-args.mjs';

test('no argument starts the app without mocks', () => {
  assert.deepEqual(parseStartArgs([]), { mock: false });
});

test('mock starts the app with mocks', () => {
  assert.deepEqual(parseStartArgs(['mock']), { mock: true });
});

test('any other argument fails with the usage', () => {
  assert.throws(() => parseStartArgs(['other']), /Usage: pnpm web \[mock\]/);
});

test('more than one argument fails with the usage', () => {
  assert.throws(() => parseStartArgs(['mock', 'extra']), /Usage: pnpm web \[mock\]/);
});
