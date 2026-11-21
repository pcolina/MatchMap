import usersData from './data/users.json';
import type { MockState, MockUser } from './types.ts';

export const createState = (users: MockUser[] = usersData): MockState => ({
  users: users.map((user) => ({ ...user })),
  refreshSessions: [],
  failures: {},
});
