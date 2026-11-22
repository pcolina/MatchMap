export {};

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

const readWebFile = (name: string): string => readFileSync(resolve(nodeProcess.cwd(), name), 'utf8');

describe('maplibre worker serving', () => {
  it('copies the worker before start, build and watch', () => {
    const pkg = JSON.parse(readWebFile('package.json')) as { scripts: Record<string, string> };

    expect(pkg.scripts['prestart']).toBe('node scripts/copy-geo.mjs && node scripts/copy-maplibre-worker.mjs');
    expect(pkg.scripts['prebuild']).toBe('node scripts/copy-geo.mjs && node scripts/copy-maplibre-worker.mjs');
    expect(pkg.scripts['prewatch']).toBe('node scripts/copy-geo.mjs && node scripts/copy-maplibre-worker.mjs');
  });

  it('excludes maplibre-gl from the dev server prebundle so its worker resolves', () => {
    const angular = JSON.parse(readWebFile('angular.json')) as {
      projects: { web: { architect: { serve: { options: { prebundle: { exclude: string[] } } } } } };
    };

    expect(angular.projects.web.architect.serve.options.prebundle.exclude).toContain('maplibre-gl');
  });

  it('keeps the copied worker out of git', () => {
    expect(readWebFile('.gitignore').split(/\r?\n/)).toContain('/public/maplibre-gl-worker.mjs');
  });
});
