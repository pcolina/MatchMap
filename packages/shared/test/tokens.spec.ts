import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokensTs = readFileSync(resolve(__dirname, '../../../tokens/tokens.ts'), 'utf8');
const tokensCss = readFileSync(resolve(__dirname, '../../../tokens/tokens.css'), 'utf8');

describe('focus border width token', () => {
  it('is 2 in tokens.ts', () => {
    expect(tokensTs).toMatch(/borderWidth\s*=\s*\{[\s\S]*?focus:\s*2\b/);
  });

  it('is 2px in tokens.css', () => {
    expect(tokensCss).toMatch(/--mm-border-width-focus:\s*2px;/);
  });
});
