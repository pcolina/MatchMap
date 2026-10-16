import { ngNative } from '@ng-native/testing/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [ngNative()],
});
