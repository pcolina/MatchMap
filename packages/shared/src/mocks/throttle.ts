import type { MockState } from './types.ts';

const maxFailedLogins = 5;
const failedLoginWindowMs = 15 * 60 * 1000;

export const retryAfterSeconds = (state: MockState, email: string, now: number): number | null => {
  const failures = state.failures[email];
  if (!failures) {
    return null;
  }
  const windowEnd = failures.windowStart + failedLoginWindowMs;
  if (now >= windowEnd || failures.count < maxFailedLogins) {
    return null;
  }
  return Math.ceil((windowEnd - now) / 1000);
};

export const recordFailure = (state: MockState, email: string, now: number): MockState => {
  const current = state.failures[email];
  const fresh = !current || now >= current.windowStart + failedLoginWindowMs;
  const next = fresh
    ? { windowStart: now, count: 1 }
    : { windowStart: current.windowStart, count: current.count + 1 };
  return { ...state, failures: { ...state.failures, [email]: next } };
};

export const resetFailures = (state: MockState, email: string): MockState => ({
  ...state,
  failures: Object.fromEntries(Object.entries(state.failures).filter(([key]) => key !== email)),
});
