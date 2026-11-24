export {};

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

describe('map view space around the globe', () => {
  it('paints the area around the globe with the app background token, not a map colour', () => {
    const css = readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'map-view', 'map-view.css'), 'utf8');

    expect(css).toMatch(/\.map-view\s*\{[^}]*background-color:\s*var\(--mm-color-bg\);/);
  });
});
