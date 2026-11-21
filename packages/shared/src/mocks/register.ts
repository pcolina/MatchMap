import { normalizeEmail, validateRegisterPassword, validateSignInEmail } from '../auth/validators.ts';
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
  if (validateSignInEmail(input.email)) {
    return { errors: [{ message: 'Invalid email', extensions: { code: 'VALIDATION_FAILED', field: 'email' } }], state };
  }
  if (validateRegisterPassword(input.password)) {
    return { errors: [{ message: 'Invalid password', extensions: { code: 'PASSWORD_INVALID', field: 'password' } }], state };
  }
  const email = normalizeEmail(input.email);
  if (state.users.some((candidate) => candidate.email === email)) {
    return { errors: [{ message: 'Email already in use', extensions: { code: 'EMAIL_TAKEN' } }], state };
  }
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
