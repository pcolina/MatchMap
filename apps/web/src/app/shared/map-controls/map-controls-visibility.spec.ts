import { describe, expect, it } from 'vitest';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve: resolvePath } = nodeProcess.getBuiltinModule('node:path');
const appDir = resolvePath(nodeProcess.cwd(), 'src', 'app');
const read = (path: string): string => readFileSync(path, 'utf8');

describe('map controls are visible', () => {
  it('registers every icon the map controls use in the app config', () => {
    const config = read(resolvePath(appDir, 'app.config.ts'));

    for (const icon of ['tablerPlus', 'tablerUsers', 'tablerUser', 'tablerInfoCircle', 'tablerMap', '']) {
      expect(config).toContain(icon);
    }
  });

  it('stacks the top controls above the map canvas', () => {
    const css = read(resolvePath(appDir, 'shared', 'map-controls', 'map-top-controls.css'));

    expect(css).toMatch(/:host\s*\{[^}]*z-index:\s*\d+/);
  });

  it('stacks the bottom controls above the map canvas', () => {
    const css = read(resolvePath(appDir, 'shared', 'map-controls', 'map-bottom-controls.css'));

    expect(css).toMatch(/:host\s*\{[^}]*z-index:\s*\d+/);
  });

  it('gives the top control buttons the card elevation so they stand out from the map', () => {
    const css = read(resolvePath(appDir, 'shared', 'map-controls', 'map-top-controls.css'));

    expect(css).toMatch(/\.control\s*\{[^}]*box-shadow:\s*var\(--mm-elevation-card\)/);
  });

  it('gives the bottom control buttons the card elevation so they stand out from the map', () => {
    const css = read(resolvePath(appDir, 'shared', 'map-controls', 'map-bottom-controls.css'));

    expect(css).toMatch(/\.control\s*\{[^}]*box-shadow:\s*var\(--mm-elevation-card\)/);
  });
});
