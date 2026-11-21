import { normalizeEmail } from '../auth/validators.ts';
import type { MockContext, MockState, MockUser } from './types.ts';

export type RegisterInput = {
  email: string;
  password: string;
};

export type PublicUser = Omit<MockUser, 'password'>;

export type GraphqlError = {
  message: string;
  extensions: { code: string; field?: string };
};

export type GraphqlResult<T> = {
  data?: T;
  errors?: GraphqlError[];
  state: MockState;
};

export const register = (
  state: MockState,
  input: RegisterInput,
  context: MockContext,
): GraphqlResult<{ register: PublicUser }> => {
  const email = normalizeEmail(input.email);
  const user: MockUser = {
    id: `${context.random(8)}-${context.random(4)}-${context.random(4)}-${context.random(12)}`,
    email,
    username: email.split('@')[0],
    password: input.password,
    createdAt: new Date(context.now).toISOString(),
  };
  return {
    data: { register: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt } },
    state: { ...state, users: [...state.users, user] },
  };
};
