import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readme = readFileSync(resolve(process.cwd(), '../../README.md'), 'utf8');
const mobileSection = readme.slice(readme.indexOf('### Run the mobile app'), readme.indexOf('## Development'));

describe('README mobile mocks section', () => {
  it('starts the mocks with pnpm mobile mock', () => {
    expect(mobileSection).toContain('pnpm mobile mock');
  });

  it('names both mock users and their passwords', () => {
    expect(mobileSection).toContain('one@matchmap.test');
    expect(mobileSection).toContain('One-pass1');
    expect(mobileSection).toContain('two@matchmap.test');
    expect(mobileSection).toContain('Two-pass2');
  });

  it('explains how to reset the mock users', () => {
    expect(mobileSection).toContain('clear the app data');
  });
});
