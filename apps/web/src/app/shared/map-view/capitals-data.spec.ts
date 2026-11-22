export {};

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

type Feature = { type: string; geometry: { type: string } | null; properties: Record<string, unknown> | null };
type FeatureCollection = { type: string; features: Feature[] };

describe('capitals.json', () => {
  const data = JSON.parse(
    readFileSync(resolve(nodeProcess.cwd(), '..', '..', 'packages', 'shared', 'geo', 'capitals.json'), 'utf8'),
  ) as FeatureCollection;

  it('is a FeatureCollection', () => {
    expect(data.type).toBe('FeatureCollection');
  });

  it('has point features only', () => {
    expect(data.features.length).toBeGreaterThan(0);
    for (const feature of data.features) {
      expect(feature.type).toBe('Feature');
      expect(feature.geometry?.type).toBe('Point');
    }
  });

  it('gives every feature an iso_a2 string and a name', () => {
    for (const feature of data.features) {
      expect(typeof feature.properties?.['iso_a2']).toBe('string');
      expect(typeof feature.properties?.['name']).toBe('string');
    }
  });
});
