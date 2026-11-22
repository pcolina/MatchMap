import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const geoDir = resolve(__dirname, '../geo');

const read = (file: string) => JSON.parse(readFileSync(resolve(geoDir, file), 'utf8')) as { type: string; features: Array<{ properties: Record<string, unknown> }> };

describe('shared geo data', () => {
  it('has the countries and capitals files', () => {
    expect(existsSync(resolve(geoDir, 'countries.json'))).toBe(true);
    expect(existsSync(resolve(geoDir, 'capitals.json'))).toBe(true);
  });

  it('parses as GeoJSON feature collections', () => {
    expect(read('countries.json').type).toBe('FeatureCollection');
    expect(read('capitals.json').type).toBe('FeatureCollection');
  });

  it('gives every country an iso_a2 code', () => {
    const countries = read('countries.json').features;

    expect(countries.length).toBeGreaterThan(200);
    expect(countries.every((feature) => typeof feature.properties['iso_a2'] === 'string')).toBe(true);
  });
});
