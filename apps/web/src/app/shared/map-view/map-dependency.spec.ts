export {};

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

describe('maplibre-gl dependency', () => {
  it('is pinned to the exact version 6.16.0', () => {
    const pkg = JSON.parse(readFileSync(resolve(nodeProcess.cwd(), 'package.json'), 'utf8')) as { dependencies?: Record<string, string> };

    expect(pkg.dependencies?.['maplibre-gl']).toBe('6.16.0');
  });
});
