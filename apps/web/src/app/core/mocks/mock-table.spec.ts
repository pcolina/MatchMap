import { describe, expect, it } from 'vitest';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

const rows = readFileSync(resolve(nodeProcess.cwd(), '../../Mock-system.md'), 'utf8')
  .split(/\r?\n/)
  .filter((line) => /^\| M-\d+ /.test(line))
  .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));

const rowFor = (operation: string) => rows.find((row) => row[3].includes(operation));

describe('Mock-system.md', () => {
  it('has seven columns in every row', () => {
    for (const row of rows) {
      expect(row).toHaveLength(7);
    }
  });

  it.each(['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', 'register', 'me', 'apiVersion'])(
    'has a mocked row for %s with its data file and contract',
    (operation) => {
      const row = rowFor(operation);

      expect(row?.[4]).not.toBe('');
      expect(row?.[5]).not.toBe('');
      expect(row?.[6]).toBe('mocked');
    },
  );

  it('lists signInWithGoogle as not mocked', () => {
    expect(rowFor('/api/auth/google')?.[6]).toBe('not mocked');
  });
});
