import { inject, provideAppInitializer } from '@angular/core';
import { ThemeStore } from './theme.store';

export const provideTheme = () =>
  provideAppInitializer(() => {
    inject(ThemeStore);
  });
