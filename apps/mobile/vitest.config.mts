import { ngNative } from '@ng-native/testing/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [ngNative({ inline: [/\/node_modules\/@ngrx\/signals/, /\/node_modules\/@ngx-translate\/core/] })],
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'scripts/**'],
  },
});
