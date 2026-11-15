import { environment } from '../../environments/environment';

export {};

describe('web environment', () => {
  it('uses an empty API base in development so the calls go through the proxy', () => {
    expect(environment.apiBaseUrl).toBe('');
  });
});
