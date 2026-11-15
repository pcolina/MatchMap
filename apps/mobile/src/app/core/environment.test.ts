import { describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment.ts';

describe('mobile environment', () => {
  it('points development at the host machine from the Android emulator', () => {
    expect(environment.apiBaseUrl).toBe('http://10.0.2.2:8080');
  });
});
