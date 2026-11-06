import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const generatedPath = resolve(__dirname, '../src/generated/openapi.ts');

describe('auth OpenAPI types', () => {
  const generated = readFileSync(generatedPath, 'utf8');

  it('generates the login path from contracts/openapi/auth.yaml', () => {
    expect(generated).toMatch(/["']\/api\/auth\/login["']/);
  });

  it('generates the login request and token response schemas', () => {
    expect(generated).toContain('LoginRequest');
    expect(generated).toContain('TokenResponse');
  });
});
