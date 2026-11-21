import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServeArgs } from './start-command.mjs';

test('mock passes the define flag to the dev server', () => {
  assert.ok(buildServeArgs({ mock: true }).includes('--define=MATCHMAP_MOCKS=true'));
});

test('no mock does not pass the define flag', () => {
  assert.ok(!buildServeArgs({ mock: false }).some((arg) => arg.startsWith('--define')));
});

test('the dev server keeps port 4300', () => {
  assert.deepEqual(buildServeArgs({ mock: false }), ['serve', '--port', '4300']);
});
