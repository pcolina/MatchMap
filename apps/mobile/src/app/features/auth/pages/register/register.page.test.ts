import '@angular/compiler';
import { computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { TranslateService } from '@ngx-translate/core';
import { Accessibility } from '@ng-native/device';
import { ColorScheme } from '@ng-native/device';
import { render, screen, userEvent } from '@ng-native/testing';
import { beforeEach, expect, test, vi } from 'vitest';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import { colors } from '../../../../core/theme/tokens.ts';
import { AuthStore, type AuthState } from '../../state/auth.store.ts';
import { RegisterPage } from './register.page.ts';

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
    register: vi.fn(),
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

const setup = async (store = fakeStore(), reduceMotion = false) => {
  const router = { navigateByUrl: vi.fn(async () => true) };
  await render(RegisterPage, {
    providers: [
      { provide: AuthStore, useValue: store },
      { provide: Router, useValue: router },
      { provide: TranslateService, useValue: translate },
      { provide: ColorScheme.SOURCE, useValue: { current: () => 'light', subscribe: () => () => undefined } },
      {
        provide: Accessibility.SOURCE,
        useValue: {
          current: async () => ({ screenReader: false, reduceMotion, boldText: false, fontScale: 1 }),
          subscribe: () => () => undefined,
          announce: () => undefined,
        },
      },
      provideIcons({ tablerLanguage, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
    ],
  });
  return { store, router, user: userEvent.setup() };
};

const fillValid = async (
  user: ReturnType<typeof userEvent.setup>,
  email = 'user@example.com',
  password = 'Abc!12',
  repeat = password,
) => {
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.type(screen.getByLabelText('Repeat password'), repeat);
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('shows the email, password and repeat password fields with their labels', async () => {
  await setup();

  expect(screen.getByLabelText('Email')).toBeTruthy();
  expect(screen.getByLabelText('Password')).toBeTruthy();
  expect(screen.getByLabelText('Repeat password')).toBeTruthy();
});

test('shows one primary create account button', async () => {
  await setup();

  expect(screen.getByRole('button', { name: 'Create account' })).toBeTruthy();
});

test('shows the language switcher with the accessible name languages', async () => {
  await setup();

  expect(screen.getByRole('button', { name: 'languages' })).toBeTruthy();
});

test('takes the user back to the sign-in page from the link', async () => {
  const { router, user } = await setup();

  await user.press(screen.getByRole('link', { name: 'Already have an account? Sign in' }));

  expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
});

test('shows the email format error and sends no request', async () => {
  const { store, user } = await setup();

  await fillValid(user, 'not-an-email');
  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
  expect(store.register).not.toHaveBeenCalled();
});

test('sends the normalised email and the password only', async () => {
  const { store, user } = await setup();

  await fillValid(user, ' User@Example.com ', 'Abc!12');
  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(store.register).toHaveBeenCalledTimes(1);
  expect(store.register).toHaveBeenCalledWith({ email: 'user@example.com', password: 'Abc!12' });
});

test('shows the password rule error and sends no request', async () => {
  const { store, user } = await setup();

  await fillValid(user, 'user@example.com', '12345');
  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByText(en.login.register.errorPasswordInvalid)).toBeTruthy();
  expect(store.register).not.toHaveBeenCalled();
});

test('shows the mismatch error when the repeat password differs and sends no request', async () => {
  const { store, user } = await setup();

  await fillValid(user, 'user@example.com', 'Abc!12', 'Abc!13');
  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByText('Passwords do not match.')).toBeTruthy();
  expect(store.register).not.toHaveBeenCalled();
});

test('sends the request when the repeat password matches exactly', async () => {
  const { store, user } = await setup();

  await fillValid(user, 'user@example.com', 'Abc!12', 'Abc!12');
  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(store.register).toHaveBeenCalledTimes(1);
});

test('marks an invalid email with the danger border', async () => {
  const { user } = await setup();

  await user.press(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByLabelText('Email').props['borderColor']).toBe(colors.light.danger);
});

test.each([
  ['emailTaken', en.login.register.errorEmailTaken],
  ['passwordInvalid', en.login.register.errorPasswordInvalid],
  ['network', en.login.common.errorNetwork],
  ['unknown', en.login.common.errorUnknown],
] as const)('shows the message for the %s failure from the store', async (failure, message) => {
  const store = fakeStore();
  store.failure.set(failure);
  await setup(store);

  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByText(message)).toBeTruthy();
});

test('keeps the typed values after a failed registration', async () => {
  const store = fakeStore();
  const { user } = await setup(store);

  await fillValid(user, 'user@example.com', 'Abc!12');
  await user.press(screen.getByRole('button', { name: 'Create account' }));
  store.failure.set('emailTaken');

  expect(screen.getByLabelText('Email').props['text']).toBe('user@example.com');
  expect(screen.getByLabelText('Password').props['text']).toBe('Abc!12');
  expect(screen.getByLabelText('Repeat password').props['text']).toBe('Abc!12');
});

test('shows a skeleton and no create account button while the request runs', async () => {
  const store = fakeStore();
  store.status.set('loading');
  await setup(store);

  expect(screen.getByTestId('skeleton')).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Create account' })).toBeNull();
});

test('the skeleton blocks are static when reduce motion is on', async () => {
  const store = fakeStore();
  store.status.set('loading');
  await setup(store, true);

  for (const field of screen.getAllByTestId('skeleton-field')) {
    expect(field.props['animationName']).toBe('none');
  }
});

test('takes the user to the main route after a successful registration', async () => {
  const store = fakeStore();
  const { router } = await setup(store);

  store.accessToken.set('token');
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(router.navigateByUrl).toHaveBeenCalledWith('/');
});

test.each(['invalidCredentials', 'tooManyAttempts', 'signInAfterRegister'] as const)(
  'takes the user to the sign-in page after the %s sign-in failure',
  async (failure) => {
    const store = fakeStore();
    const { router } = await setup(store);

    store.failure.set(failure);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  },
);

test('every control on the registration page has an accessible name', async () => {
  await setup();

  expect(screen.getByLabelText(en.login.register.emailLabel)).toBeTruthy();
  expect(screen.getByLabelText(en.login.register.passwordLabel)).toBeTruthy();
  expect(screen.getByLabelText(en.login.register.repeatPasswordLabel)).toBeTruthy();
  for (const name of ['languages', 'Create account']) {
    expect(screen.getByRole('button', { name })).toBeTruthy();
  }
  expect(screen.getByRole('link', { name: en.login.register.goToSignIn })).toBeTruthy();
});
