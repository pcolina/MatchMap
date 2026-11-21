import { createState, type MockContext, type MockState } from '@matchmap/shared';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

const randomAlphanumeric = (length: number): string =>
  Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');

let state: MockState = createState();

export const getMockState = (): MockState => state;

export const setMockState = (next: MockState): void => {
  state = next;
};

export const resetMockState = (): void => {
  state = createState();
};

export const mockContext = (): MockContext => ({ now: Date.now(), random: randomAlphanumeric });
