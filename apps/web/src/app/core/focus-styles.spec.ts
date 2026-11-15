export {};
type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const globalStyles = readFileSync(resolve(nodeProcess.cwd(), 'src/styles.css'), 'utf8');

describe('pointer focus style', () => {
  it('shows a half-width outline without halo only in pointer mode', () => {
    const rule = globalStyles.slice(globalStyles.indexOf(":root[data-input='pointer'] :focus-visible"));
    const body = rule.slice(0, rule.indexOf('}'));

    expect(body).toContain('outline: calc((var(--mm-border-width-focus) + 1px) / 2 + 1px) solid var(--mm-color-accent);');
    expect(body).toContain('box-shadow: none;');
  });

  it('keeps the keyboard focus rule unchanged', () => {
    expect(globalStyles).toContain('outline: calc(var(--mm-border-width-focus) + 1px) solid var(--mm-color-accent);');
    expect(globalStyles).toContain('box-shadow: var(--mm-focus-halo);');
  });
});
