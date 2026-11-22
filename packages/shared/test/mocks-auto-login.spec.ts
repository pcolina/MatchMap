import { describe, expect, it } from 'vitest';
import { autoLoginCredentials } from '../src/mocks/auto-login.ts';
import usersData from '../src/mocks/data/users.json';

describe('autoLoginCredentials', () => {
  it('returns the email and password of one@matchmap.test from the users file', () => {
    expect(autoLoginCredentials(usersData)).toEqual({
      email: 'one@matchmap.test',
      password: usersData.find((user) => user.email === 'one@matchmap.test')?.password,
    });
  });

  it('throws when one@matchmap.test is not in the users', () => {
    const withoutOne = usersData.filter((user) => user.email !== 'one@matchmap.test');
    expect(() => autoLoginCredentials(withoutOne)).toThrow('one@matchmap.test');
  });
});
