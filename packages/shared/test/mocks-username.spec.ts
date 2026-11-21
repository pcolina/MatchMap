import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { register } from '../src/mocks/register';
import type { MockContext } from '../src/mocks/types';

const context: MockContext = { now: Date.UTC(2026, 0, 2), random: (length) => 'r'.repeat(length) };
const usernameOf = (email: string, state = createState()) =>
  register(state, { email, password: 'Fresh-pass1' }, context).data?.register.username;

describe('username on register', () => {
  it('is the email local part with dots replaced by underscores', () => {
    expect(usernameOf('jane.doe@matchmap.test')).toBe('jane_doe');
  });

  it('starts with user_ and has 13 characters when the local part is shorter than 3', () => {
    const username = usernameOf('ab@matchmap.test') ?? '';

    expect(username.startsWith('user_')).toBe(true);
    expect(username).toHaveLength(13);
  });

  it('adds a numeric suffix when the username is taken', () => {
    const state = createState();
    state.users.push({ ...state.users[0], id: 'taken', email: 'other@matchmap.test', username: 'mock_user' });

    expect(usernameOf('mock.user@matchmap.test', state)).toBe('mock_user_2');
  });
});
