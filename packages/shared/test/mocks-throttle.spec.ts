import { describe, expect, it } from 'vitest';
import { createState } from '../src/mocks/state';
import { signIn } from '../src/mocks/sign-in';
import type { MockContext, MockState } from '../src/mocks/types';

const minute = 60_000;
const contextAt = (now: number): MockContext => ({ now, random: (length) => 'x'.repeat(length) });
const email = 'one@matchmap.test';

const failWith = (state: MockState, password: string, now: number) =>
  signIn(state, { client: 'web', email, password }, contextAt(now));

describe('login throttling', () => {
  it('throttles the sixth attempt within 15 minutes with too_many_attempts and Retry-After', () => {
    let state = createState();
    for (let attempt = 0; attempt < 5; attempt++) {
      state = failWith(state, 'Wrong-pass1', 0).state;
    }

    const sixth = signIn(state, { client: 'web', email, password: 'One-pass1' }, contextAt(0));

    expect(sixth.status).toBe(429);
    expect(sixth.body).toEqual({ error: 'too_many_attempts' });
    expect(sixth.retryAfterSeconds).toBe(15 * 60);
  });

  it('accepts the sign-in again after the 15 minute window', () => {
    let state = createState();
    for (let attempt = 0; attempt < 5; attempt++) {
      state = failWith(state, 'Wrong-pass1', 0).state;
    }

    const afterWindow = signIn(state, { client: 'web', email, password: 'One-pass1' }, contextAt(15 * minute));

    expect(afterWindow.status).toBe(200);
  });

  it('resets the count after a successful sign-in', () => {
    let state = createState();
    for (let attempt = 0; attempt < 4; attempt++) {
      state = failWith(state, 'Wrong-pass1', 0).state;
    }
    const success = signIn(state, { client: 'web', email, password: 'One-pass1' }, contextAt(0));
    state = success.state;

    const statuses: number[] = [];
    for (let attempt = 0; attempt < 4; attempt++) {
      const result = failWith(state, 'Wrong-pass1', 0);
      statuses.push(result.status);
      state = result.state;
    }

    expect(success.status).toBe(200);
    expect(statuses).toEqual([401, 401, 401, 401]);
  });
});
