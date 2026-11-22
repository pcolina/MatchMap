import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const design = readFileSync(resolve(__dirname, '../../../docs/design.md'), 'utf8');

describe('design document', () => {
  it('has the side sheet pattern as section 7.10', () => {
    expect(design).toMatch(/### 7\.10 Side sheet \(account\)/);
  });

  it('gives the side sheet its width, fade and closing rules', () => {
    const section = design.slice(design.indexOf('### 7.10'));
    expect(section).toMatch(/320 px/);
    expect(section).toMatch(/200 ms/);
    expect(section).toMatch(/Escape/);
  });
});
