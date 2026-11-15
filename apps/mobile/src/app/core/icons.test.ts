import { describe, expect, it } from 'vitest';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

describe('app icons', () => {
  it('registers the alert icon used by every error message', () => {
    const main = readFileSync(resolve(nodeProcess.cwd(), 'src/main.ts'), 'utf8');
    const registered = main.slice(main.indexOf('provideIcons('), main.indexOf(')', main.indexOf('provideIcons(')));

    expect(registered).toContain('tablerAlertCircle');
  });
});
