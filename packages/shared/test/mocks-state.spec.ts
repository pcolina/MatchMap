import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import usersData from '../src/mocks/data/users.json';

describe('mock state from data files', () => {
  it('starts with the users of the users data file', () => {
    const state = createState();

    expect(state.users.map((user) => user.email)).toEqual(usersData.map((user) => user.email));
  });

  it('takes its users from the data it is given, so a changed value shows in the state', () => {
    const changed = usersData.map((user) => ({ ...user, username: `${user.username}-changed` }));

    const state = createState(changed);

    expect(state.users[0].username).toBe('one-changed');
  });
});
