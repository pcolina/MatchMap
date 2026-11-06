import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLanguages } from '@ng-icons/lucide';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../../../packages/shared/i18n/es.json';
import { SIGN_IN_GATEWAY, type SignInGateway } from '../../state/auth.store';
import { SignInPage } from './sign-in.page';

type Gateway = { signIn: ReturnType<typeof vi.fn> };

const setup = (gateway: Gateway) => {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
  TestBed.configureTestingModule({
    providers: [
      provideIcons({ lucideLanguages }),
      provideRouter([]),
      provideTranslateService({ fallbackLang: 'en' }),
      { provide: SIGN_IN_GATEWAY, useValue: gateway as unknown as SignInGateway },
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use('en');
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(SignInPage);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, navigate, translate };
};

const field = (element: HTMLElement, id: string) => element.querySelector<HTMLInputElement>(`#${id}`)!;

const typeInto = async (element: HTMLElement, fixture: { detectChanges(): void; whenStable(): Promise<unknown> }, id: string, value: string) => {
  const input = field(element, id);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

const submit = async (element: HTMLElement, fixture: { detectChanges(): void; whenStable(): Promise<unknown> }) => {
  element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

const errorText = (element: HTMLElement): string[] =>
  Array.from(element.querySelectorAll<HTMLElement>('[data-error]')).map((node) => node.textContent?.trim() ?? '');

describe('SignInPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('centres its content horizontally and vertically', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const content = element.querySelector<HTMLElement>('.content')!;

    expect(getComputedStyle(content).getPropertyValue('justify-content')).toBe('center');
    expect(getComputedStyle(content).getPropertyValue('align-items')).toBe('center');
  });

  it('shows the language switcher in the top-right corner', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const topBar = element.querySelector<HTMLElement>('.top-bar')!;

    expect(topBar.querySelector('app-language-switcher')).not.toBeNull();
    expect(getComputedStyle(topBar).getPropertyValue('justify-content')).toBe('flex-end');
  });

  it('shows the disabled Google button with the coming-soon text', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const google = element.querySelector<HTMLButtonElement>('.google')!;

    expect(google.disabled).toBe(true);
    expect(google.textContent?.trim()).toBe('Coming soon');
  });

  it('shows the email and password fields, the sign-in button and the registration link', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    expect(element.querySelector('label[for="email"]')?.textContent?.trim()).toBe('Email');
    expect(element.querySelector('label[for="password"]')?.textContent?.trim()).toBe('Password');
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).toBe('Sign in');
    expect(element.querySelector<HTMLAnchorElement>('a.register')?.textContent?.trim()).toBe('Create an account');
    expect(element.querySelector<HTMLAnchorElement>('a.register')?.getAttribute('href')).toBe('/register');
  });

  it('shows the required email message and sends no request', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await submit(element, fixture);

    expect(errorText(element)).toContain('Enter your email.');
    expect(gateway.signIn).not.toHaveBeenCalled();
  });

  it('shows the email format message and sends no request', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Enter a valid email address.');
    expect(gateway.signIn).not.toHaveBeenCalled();
  });

  it('shows the email length message when the email is longer than 254 characters', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', `${'a'.repeat(243)}@example.com`);
    await submit(element, fixture);

    expect(errorText(element)).toContain('Email must be at most 254 characters.');
    expect(gateway.signIn).not.toHaveBeenCalled();
  });

  it('shows the password required message and sends no request', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Enter your password.');
    expect(gateway.signIn).not.toHaveBeenCalled();
  });

  it('shows the password length message when the password is out of range', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '12345');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Password must be 6 to 20 characters.');
    expect(gateway.signIn).not.toHaveBeenCalled();
  });

  it('marks an invalid field with the danger border and a message below it', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    await submit(element, fixture);

    const input = field(element, 'email');
    expect(input.classList).toContain('field--invalid');
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));
    expect(rules.some((text) => text.includes('.field--invalid') && text.includes('border-color: var(--mm-color-danger)'))).toBe(true);
    expect(input.nextElementSibling?.getAttribute('data-error')).not.toBeNull();
  });

  it('sends exactly one sign-in request for a valid submit', async () => {
    const gateway = { signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(gateway.signIn).toHaveBeenCalledTimes(1);
    expect(gateway.signIn).toHaveBeenCalledWith('user@example.com', '123456');
  });

  it('blocks a second submit and shows a skeleton while the request runs', async () => {
    const response = new Subject<{ accessToken: string }>();
    const gateway = { signIn: vi.fn((): Observable<{ accessToken: string }> => response) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(element.querySelector('app-skeleton')).not.toBeNull();
    expect(element.querySelector('#email')).toBeNull();
    expect(gateway.signIn).toHaveBeenCalledTimes(1);

    response.next({ accessToken: 'token' });
    response.complete();
  });

  it('takes the user to the main route after a successful sign-in', async () => {
    const { fixture, element, navigate } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('shows the invalid credentials message and keeps the typed values', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Email or password is incorrect.');
    expect(field(element, 'email').value).toBe('user@example.com');
    expect(field(element, 'password').value).toBe('123456');
  });

  it('shows the network message after a network failure', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'network')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(errorText(element)).toContain('No connection. Check your network and try again.');
  });

  it('shows the too many attempts message', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'tooManyAttempts')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Too many attempts. Wait a few minutes and try again.');
  });

  it('shows the generic message for an unknown failure', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'unknown')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Something went wrong. Try again.');
  });

  it('shows the texts of the active language', async () => {
    const { fixture, element, translate } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    translate.use('es');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).toBe('Iniciar sesión');
  });

  it('gives every interactive element an accessible name', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    expect(element.querySelector('label[for="email"]')).not.toBeNull();
    expect(element.querySelector('label[for="password"]')).not.toBeNull();
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).not.toBe('');
    expect(element.querySelector<HTMLButtonElement>('.google')?.textContent?.trim()).not.toBe('');
    expect(element.querySelector('app-language-switcher button')?.getAttribute('aria-label')).toBe('languages');
    expect(element.querySelector<HTMLAnchorElement>('a.register')?.textContent?.trim()).not.toBe('');
  });
});
