import '@angular/compiler';
import { provideNativeRouter } from '@ng-native/router';
import { render } from '@ng-native/testing';
import { expect, test, vi } from 'vitest';
import { App } from './app.ts';

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(), deleteItemAsync: vi.fn() }));

test('hosts the routed screens in a native stack', async () => {
  const { componentRef } = await render(App, { providers: [provideNativeRouter([])] });

  expect(componentRef.location.nativeElement).toBeTruthy();
});
