import '@angular/compiler';
import { computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { TranslateService } from '@ngx-translate/core';
import { Accessibility } from '@ng-native/device';
import { ColorScheme } from '@ng-native/device';
import { render, screen, userEvent } from '@ng-native/testing';
import { beforeEach, expect, test, vi } from 'vitest';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import { colors } from '../../../../core/theme/tokens.ts';
import { AuthStore, type AuthState } from '../../state/auth.store.ts';
import { SignInPage } from './sign-in.page.ts';

vi.mock('@expo-google-fonts/caveat', () => ({ Caveat_600SemiBold: 'caveat-600' }));
vi.mock('@expo-google-fonts/sora', () => ({ Sora_600SemiBold: 's600', Sora_700Bold: 's700', Sora_800ExtraBold: 's800' }));
vi.mock('@expo-google-fonts/inter', () => ({ Inter_400Regular: 'i400', Inter_500Medium: 'i500', Inter_600SemiBold: 'i600', Inter_700Bold: 'i700' }));
vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), getItemAsync: vi.fn(), deleteItemAsync: vi.fn() }));

const fakeStore = () => {
  const status = signal<AuthState['status']>('idle');
  const failure = signal<AuthState['failure']>(null);
  const accessToken = signal<string | null>(null);
  return {
    status,
    failure,
    accessToken,
    isLoading: computed(() => status() === 'loading'),
    signIn: vi.fn(),
  };
};

const catalogue = en as Record<string, unknown>;

const translate = {
  instant: (key: string): string => {
    const value = key.split('.').reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      catalogue,
    );
    return typeof value === 'string' ? value : key;
  },
};

const setup = async (store = fakeStore()) => {
  const router = { navigateByUrl: vi.fn(async () => true) };
  await render(SignInPage, {
    providers: [
      { provide: AuthStore, useValue: store },
      { provide: Router, useValue: router },
      { provide: TranslateService, useValue: translate },
      { provide: ColorScheme.SOURCE, useValue: { current: () => 'light', subscribe: () => () => undefined } },
      { provide: Accessibility.SOURCE, useValue: { current: async () => ({ screenReader: false, reduceMotion: false, boldText: false, fontScale: 1 }), subscribe: () => () => undefined, announce: () => undefined } },
      provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
    ],
  });
  return { store, router, user: userEvent.setup() };
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('shows the email and password fields with their labels', async () => {
  await setup();

  expect(screen.getByLabelText('Email')).toBeTruthy();
  expect(screen.getByLabelText('Password')).toBeTruthy();
});

test('shows one primary sign-in button', async () => {
  await setup();

  expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
});

test('shows the language switcher with the accessible name languages', async () => {
  await setup();

  expect(screen.getByRole('button', { name: 'languages' })).toBeTruthy();
});

test('shows the social buttons as unavailable', async () => {
  await setup();

  for (const name of ['Google', 'Facebook', 'Apple']) {
    expect(screen.getByRole('button', { name }).props['accessibilityState']).toEqual({ disabled: true });
  }
});

test('shows an error for an empty email and sends no request', async () => {
  const { store, user } = await setup();

  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Enter your email.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test('signs in with the entered email and password', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), '123456');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(store.signIn).toHaveBeenCalledWith({ email: 'user@example.com', password: '123456' });
});

test('shows the invalid credentials message from the store', async () => {
  const store = fakeStore();
  store.failure.set('invalidCredentials');
  await setup(store);

  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByText('Email or password is incorrect.')).toBeTruthy();
});

test('shows a skeleton and no sign-in button while the request runs', async () => {
  const store = fakeStore();
  store.status.set('loading');
  await setup(store);

  expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull();
});

test('toggles the password between hidden and visible', async () => {
  const { user } = await setup();

  await user.press(screen.getByRole('button', { name: 'Show password' }));

  expect(screen.getByRole('button', { name: 'Hide password' })).toBeTruthy();
});

test('takes the user to the main route after a successful sign-in', async () => {
  const store = fakeStore();
  const { router } = await setup(store);

  store.accessToken.set('token');
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(router.navigateByUrl).toHaveBeenCalledWith('/');
});

test('opens the registration page from the link', async () => {
  const { router, user } = await setup();

  await user.press(screen.getByRole('link', { name: 'Create an account' }));

  expect(router.navigateByUrl).toHaveBeenCalledWith('/register');
});

test('shows the email format error and sends no request', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'not-an-email');
  await user.type(screen.getByLabelText('Password'), '123456');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test('shows the required email error for an email with only spaces', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), '   ');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Enter your email.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test('shows the too-long email error and sends no request', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), `${'a'.repeat(243)}@example.com`);
  await user.type(screen.getByLabelText('Password'), '123456');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Email must be at most 254 characters.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test('shows the required password error and sends no request', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Enter your password.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test.each(['12345', '1'.repeat(21)])('shows the password length error for %s and sends no request', async (password) => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), password);
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByText('Password must be 6 to 20 characters.')).toBeTruthy();
  expect(store.signIn).not.toHaveBeenCalled();
});

test('sends a password with no uppercase letter or special character', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'abcdef');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(store.signIn).toHaveBeenCalledWith({ email: 'user@example.com', password: 'abcdef' });
});

test('sends one request per submit', async () => {
  const { store, user } = await setup();

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), '123456');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(store.signIn).toHaveBeenCalledTimes(1);
});

test('marks an invalid email with the danger border', async () => {
  const { user } = await setup();

  await user.press(screen.getByRole('button', { name: 'Sign in' }));

  expect(screen.getByLabelText('Email').props['borderColor']).toBe(colors.light.danger);
});

test('keeps the space for the email and password errors before they are shown', async () => {
  await setup();

  expect(screen.getByTestId('email-error')).toBeTruthy();
  expect(screen.getByTestId('password-error')).toBeTruthy();
});

test('shows the network message from the store', async () => {
  const store = fakeStore();
  store.failure.set('network');
  await setup(store);

  expect(screen.getByText('No connection. Check your network and try again.')).toBeTruthy();
});

test('shows the too-many-attempts message from the store', async () => {
  const store = fakeStore();
  store.failure.set('tooManyAttempts');
  await setup(store);

  expect(screen.getByText('Too many attempts. Wait a few minutes and try again.')).toBeTruthy();
});

test('shows the unknown failure message from the store', async () => {
  const store = fakeStore();
  store.failure.set('unknown');
  await setup(store);

  expect(screen.getByText('Something went wrong. Try again.')).toBeTruthy();
});

test('keeps the typed email and password after a failed sign-in', async () => {
  const store = fakeStore();
  const { user } = await setup(store);

  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), '123456');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));
  store.failure.set('invalidCredentials');

  expect(screen.getByLabelText('Email').props['text']).toBe('user@example.com');
  expect(screen.getByLabelText('Password').props['text']).toBe('123456');
});

test('hides the divider label from assistive technologies', async () => {
  await setup();

  expect(screen.queryByText('or')).toBeNull();
  expect(screen.getByText('or', { includeHiddenElements: true })).toBeTruthy();
});

test('shows the coming-soon text on the social buttons', async () => {
  await setup();

  for (const name of ['Google', 'Facebook', 'Apple']) {
    expect(screen.getByRole('button', { name }).props['accessibilityHint']).toBe('Coming soon');
  }
});

test('every control on the sign-in page has an accessible name, and no unnamed control appears', async () => {
  await setup();

  expect(screen.getByLabelText(en.login.signIn.emailLabel)).toBeTruthy();
  expect(screen.getByLabelText(en.login.signIn.passwordLabel)).toBeTruthy();
  for (const name of ['languages', 'Sign in', 'Google', 'Facebook', 'Apple']) {
    expect(screen.getByRole('button', { name })).toBeTruthy();
  }
  expect(screen.getByRole('link', { name: 'Create an account' })).toBeTruthy();
  expect(screen.getAllByRole('button')).toHaveLength(6);
  expect(screen.getAllByRole('link')).toHaveLength(1);
});
