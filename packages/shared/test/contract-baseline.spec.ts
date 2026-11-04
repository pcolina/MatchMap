import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const designPath = resolve(__dirname, '../../../openspec/changes/add-login-page/design.md');

describe('add-login-page design', () => {
  const design = readFileSync(designPath, 'utf8');

  it('records the contract baseline heading', () => {
    expect(design).toMatch(/^## Contract baseline$/m);
  });

  it('records the matchmap-api commit the contracts were read from', () => {
    expect(design).toContain('0bb29cb');
  });
});
