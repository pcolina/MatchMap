import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLanguages } from '@ng-icons/lucide';

describe('icon packages', () => {
  it('provides the Lucide languages icon through NgIcon', () => {
    expect(NgIcon).toBeDefined();
    expect(provideIcons).toBeTypeOf('function');
    expect(lucideLanguages).toBeDefined();
  });
});
