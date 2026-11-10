import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaPath = resolve(__dirname, '../src/generated/schema.ts');
const operationsPath = resolve(__dirname, '../src/generated/operations.ts');
const operationPath = resolve(__dirname, '../src/graphql/register.graphql');

describe('register operation', () => {
  it('has a register.graphql operation document', () => {
    expect(existsSync(operationPath)).toBe(true);
    expect(readFileSync(operationPath, 'utf8')).toMatch(/mutation Register\(\$input: RegisterInput!\)/);
  });

  it('generates the input type with email and password only', () => {
    const generated = readFileSync(schemaPath, 'utf8');
    const block = generated.match(/export type RegisterInput = \{([\s\S]*?)\};/);
    expect(block).not.toBeNull();
    const fields = [...(block?.[1] ?? '').matchAll(/^\s*(\w+)\??:/gm)].map((match) => match[1]);
    expect(fields.sort()).toEqual(['email', 'password']);
  });

  it('generates the mutation result and variables types', () => {
    const generated = readFileSync(operationsPath, 'utf8');
    expect(generated).toMatch(/export type RegisterMutation = \{/);
    expect(generated).toMatch(/export type RegisterMutationVariables = Exact<\{/);
  });
});
