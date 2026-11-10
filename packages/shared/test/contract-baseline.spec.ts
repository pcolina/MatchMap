import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const changeDir = resolve(__dirname, '../../../openspec/changes/add-login-page');
const baseline = '57943e3';

describe('add-login-page contract baseline', () => {
  const design = readFileSync(resolve(changeDir, 'design.md'), 'utf8');
  const tasks = readFileSync(resolve(changeDir, 'tasks.md'), 'utf8');
  const section = design.split(/^## /m).find((part) => part.startsWith('Contract baseline')) ?? '';

  it('records the contract baseline heading in design.md', () => {
    expect(design).toMatch(/^## Contract baseline$/m);
  });

  it('records the current matchmap-api baseline commit in that section', () => {
    expect(section).toContain(`commit \`${baseline}\``);
  });

  it('uses the same baseline commit in tasks.md', () => {
    expect(tasks).toContain(`commit \`${baseline}\``);
    expect(tasks).not.toContain('0bb29cb');
  });
});
