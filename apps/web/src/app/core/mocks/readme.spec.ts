import { describe, expect, it } from 'vitest';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');

const readme = readFileSync(resolve(nodeProcess.cwd(), '../../README.md'), 'utf8');
const webMocksSection = readme.slice(readme.indexOf('#### With mocks'), readme.indexOf('#### With the API'));

describe('README mocks section', () => {
  it('names both mock users and their passwords', () => {
    expect(webMocksSection).toContain('mock@matchmap.test');
    expect(webMocksSection).toContain('Mock-pass1');
    expect(webMocksSection).toContain('second@matchmap.test');
    expect(webMocksSection).toContain('Second-pass2');
  });

  it('explains how to reset the mock users', () => {
    expect(webMocksSection).toContain('clear the site data');
  });

  it('starts the mocks with pnpm web mock', () => {
    expect(webMocksSection).toContain('pnpm web mock');
  });
});
