import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copyGeo } from './copy-geo.mjs';

const fixture = () => {
  const base = mkdtempSync(join(tmpdir(), 'copy-geo-'));
  const source = join(base, 'shared', 'geo');
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, 'countries.json'), '{"type":"FeatureCollection","features":[]}');
  writeFileSync(join(source, 'capitals.json'), '{"type":"FeatureCollection","features":[]}');
  return { base, source, target: join(base, 'web', 'public', 'geo') };
};

test('copies every geo file to the public folder of the web app', () => {
  const { source, target } = fixture();

  copyGeo(source, target);

  assert.deepEqual(readdirSync(target).sort(), ['capitals.json', 'countries.json']);
  assert.equal(readFileSync(join(target, 'countries.json'), 'utf8'), readFileSync(join(source, 'countries.json'), 'utf8'));
});

test('returns the names of the copied files', () => {
  const { source, target } = fixture();

  assert.deepEqual(copyGeo(source, target), ['capitals.json', 'countries.json']);
});
