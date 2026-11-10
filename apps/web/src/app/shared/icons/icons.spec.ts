import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerLanguage } from '@ng-icons/tabler-icons';

describe('icon packages', () => {
  it('provides the Tabler icons used by the app through NgIcon', () => {
    expect(NgIcon).toBeDefined();
    expect(provideIcons).toBeTypeOf('function');
    expect(tablerLanguage).toBeDefined();
    expect(tablerBrandGoogle).toBeDefined();
    expect(tablerBrandFacebook).toBeDefined();
    expect(tablerBrandApple).toBeDefined();
  });
});
