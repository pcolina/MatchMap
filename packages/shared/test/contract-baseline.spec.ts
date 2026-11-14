import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const loginDir = resolve(__dirname, '../../../openspec/changes/archive/2026-11-10-add-login-page');
const registrationDir = resolve(__dirname, '../../../openspec/changes/add-registration-page');
const baseline = '57943e3';

describe('add-login-page contract baseline', () => {
  const design = readFileSync(resolve(loginDir, 'design.md'), 'utf8');
  const tasks = readFileSync(resolve(loginDir, 'tasks.md'), 'utf8');
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

describe('add-registration-page contract baseline', () => {
  const tasks = readFileSync(resolve(registrationDir, 'tasks.md'), 'utf8');

  it('records the current matchmap-api baseline commit in tasks.md section 0', () => {
    expect(tasks).toContain(`commit \`${baseline}\``);
    expect(tasks).not.toContain('0bb29cb');
  });
});
