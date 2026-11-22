import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildServeArgs } from './start-command.mjs';

test('mock passes the define flag to the dev server', () => {
  assert.ok(buildServeArgs({ mock: true, autoLogin: false }).includes('--define=MATCHMAP_MOCKS=true'));
});

test('no mock does not pass the define flag', () => {
  assert.ok(!buildServeArgs({ mock: false, autoLogin: false }).some((arg) => arg.startsWith('--define')));
});

test('the dev server keeps port 4300 without mocks', () => {
  assert.deepEqual(buildServeArgs({ mock: false, autoLogin: false }), ['serve', '--port', '4300']);
});

test('the dev server uses port 4333 with mocks', () => {
  assert.deepEqual(buildServeArgs({ mock: true, autoLogin: false }), ['serve', '--port', '4333', '--define=MATCHMAP_MOCKS=true']);
});

test('auto sign-in passes its define flag to the dev server with mocks', () => {
  assert.ok(buildServeArgs({ mock: true, autoLogin: true }).includes('--define=MATCHMAP_AUTO_LOGIN=true'));
});

test('without auto sign-in the auto sign-in define is not passed', () => {
  assert.ok(!buildServeArgs({ mock: true, autoLogin: false }).some((arg) => arg.includes('MATCHMAP_AUTO_LOGIN')));
});

test('auto sign-in keeps port 4333 and the mocks define', () => {
  assert.deepEqual(buildServeArgs({ mock: true, autoLogin: true }), [
    'serve',
    '--port',
    '4333',
    '--define=MATCHMAP_MOCKS=true',
    '--define=MATCHMAP_AUTO_LOGIN=true',
  ]);
});
