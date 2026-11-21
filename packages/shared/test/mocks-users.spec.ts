import { describe, expect, it } from 'vitest';
import { validateRegisterPassword } from '../src/auth/validators';
import users from '../src/mocks/data/users.json';

describe('mock users', () => {
  it('contains the two mock users with their passwords', () => {
    const byEmail = Object.fromEntries(users.map((user) => [user.email, user.password]));

    expect(byEmail['one@matchmap.test']).toBe('One-pass1');
    expect(byEmail['two@matchmap.test']).toBe('Two-pass2');
  });

  it('has passwords that meet the password rule', () => {
    for (const user of users) {
      expect(validateRegisterPassword(user.password)).toBeNull();
    }
  });
});
