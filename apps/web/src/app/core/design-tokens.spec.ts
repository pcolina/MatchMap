import tokensJson from '../../../../../tokens/tokens.json';
import { colors } from '../../../../../tokens/tokens.ts';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const tokensCss = readFileSync(resolve(nodeProcess.cwd(), '../../tokens/tokens.css'), 'utf8');
const contrastReport = readFileSync(resolve(nodeProcess.cwd(), '../../tokens/contrast-report.md'), 'utf8');

describe('input border token', () => {
  it('has the same light and dark values in tokens.json, tokens.ts and tokens.css', () => {
    expect(JSON.stringify(tokensJson)).toContain('"borderInput":{"light":"#6B7485","dark":"#3B4660"}');
    expect(colors.light.borderInput).toBe('#6B7485');
    expect(colors.dark.borderInput).toBe('#3B4660');
    expect(tokensCss).toContain('--mm-color-borderInput: #6B7485;');
    expect(tokensCss.match(/--mm-color-borderInput: #3B4660;/g)).toHaveLength(2);
  });

  it('keeps borderStrong unchanged', () => {
    expect(JSON.stringify(tokensJson)).toContain('"borderStrong":{"light":"#C3CCD9","dark":"#3B4660"}');
    expect(colors.light.borderStrong).toBe('#C3CCD9');
    expect(tokensCss).toContain('--mm-color-borderStrong: #C3CCD9;');
  });

  it('reports the input border contrast in the contrast report', () => {
    expect(contrastReport).toContain('| Input border (`borderInput` / `surface`) | 3:1 | 4.71:1 ✅ | 1.85:1 ❌ (issue #7) | non-text |');
    expect(contrastReport).toContain('| Input border (`borderInput` / `bg`) | 3:1 | 4.27:1 ✅ | 2.03:1 ❌ (issue #7) | non-text |');
  });
});
