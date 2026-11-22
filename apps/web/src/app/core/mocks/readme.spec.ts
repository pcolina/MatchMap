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
    expect(webMocksSection).toContain('one@matchmap.test');
    expect(webMocksSection).toContain('One-pass1');
    expect(webMocksSection).toContain('two@matchmap.test');
    expect(webMocksSection).toContain('Two-pass2');
  });

  it('explains how to reset the mock users', () => {
    expect(webMocksSection).toContain('clear the site data');
  });

  it('starts the mocks with pnpm web mock', () => {
    expect(webMocksSection).toContain('pnpm web mock');
  });

  it('documents the -l flag that signs in as one@matchmap.test', () => {
    expect(webMocksSection).toContain('pnpm web mock -l');
    expect(webMocksSection).toContain('signs in as `one@matchmap.test`');
  });

  it('says the -l flag needs mock', () => {
    expect(webMocksSection).toContain('only together with `mock`');
  });
});
