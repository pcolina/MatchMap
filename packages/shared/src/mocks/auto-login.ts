import type { MockUser } from './types.ts';

const autoLoginEmail = 'one@matchmap.test';

export const autoLoginCredentials = (users: Pick<MockUser, 'email' | 'password'>[]): { email: string; password: string } => {
  const user = users.find((candidate) => candidate.email === autoLoginEmail);
  if (user === undefined) {
    throw new Error(`Auto sign-in user ${autoLoginEmail} is not in the mock users`);
  }
  return { email: user.email, password: user.password };
};
