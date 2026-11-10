import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../../../packages/shared/i18n/es.json';
import { AuthStore, SIGN_IN_GATEWAY, type SignInGateway } from '../../state/auth.store';
import { RegisterPage } from './register.page';

type Gateway = { register: ReturnType<typeof vi.fn>; signIn: ReturnType<typeof vi.fn> };

const setup = (gateway: Gateway) => {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
  TestBed.configureTestingModule({
    providers: [
      provideIcons({ tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
      provideRouter([]),
      provideTranslateService({ fallbackLang: 'en' }),
      { provide: SIGN_IN_GATEWAY, useValue: { refresh: () => throwError(() => 'invalidRefreshToken'), ...gateway } as unknown as SignInGateway },
    ],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use('en');
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(RegisterPage);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, navigate, translate, store: TestBed.inject(AuthStore) };
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

const passwordMessage = 'Use 6 to 20 characters, with a lowercase letter, an uppercase letter and a special character.';

const successGateway = (): Gateway => ({
  register: vi.fn(() => of(undefined)),
  signIn: vi.fn(() => of({ accessToken: 'token' })),
});

describe('RegisterPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('centres its content horizontally, starting under the header', () => {
    const { element } = setup(successGateway());
    const content = element.querySelector<HTMLElement>('.content')!;

    expect(getComputedStyle(content).getPropertyValue('align-items')).toBe('center');
    expect(getComputedStyle(content).getPropertyValue('justify-content')).toBe('flex-start');
  });

  it('shows the logo and the tagline in the header', () => {
    const { element } = setup(successGateway());
    const header = element.querySelector<HTMLElement>('header.hero')!;

    expect(header.querySelector<HTMLImageElement>('img')?.getAttribute('alt')).toBe('MatchMap');
    expect(header.querySelector('.tagline')?.textContent?.trim()).toBe('Compare, plan, discover.');
  });

  it('shows the language switcher in the top-right corner', () => {
    const { element } = setup(successGateway());
    const topBar = element.querySelector<HTMLElement>('.top-bar')!;

    expect(topBar.querySelector('app-language-switcher')).not.toBeNull();
    expect(getComputedStyle(topBar).getPropertyValue('justify-content')).toBe('flex-end');
    expect(getComputedStyle(topBar).getPropertyValue('position')).toBe('absolute');
  });

  it('shows the email and password fields, the create account button and the link back to sign-in', () => {
    const { element } = setup(successGateway());

    expect(element.querySelector('label[for="email"]')?.textContent?.trim()).toBe('Email');
    expect(element.querySelector('label[for="password"]')?.textContent?.trim()).toBe('Password');
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).toBe('Create account');
    expect(element.querySelector<HTMLAnchorElement>('a.login-link')?.textContent?.trim()).toBe('Already have an account? Sign in');
    expect(element.querySelector<HTMLAnchorElement>('a.login-link')?.getAttribute('href')).toBe('/login');
  });

  it('shows no social buttons and no divider', () => {
    const { element } = setup(successGateway());

    expect(element.querySelector('.social')).toBeNull();
    expect(element.querySelector('.divider')).toBeNull();
  });

  it('shows a user icon inside the email field and a lock icon inside the password field', () => {
    const { element } = setup(successGateway());

    expect(field(element, 'email').parentElement?.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerUser');
    expect(field(element, 'password').parentElement?.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerLock');
  });

  it('toggles the password between hidden and visible with the eye button', () => {
    const { fixture, element } = setup(successGateway());
    const toggle = element.querySelector<HTMLButtonElement>('.password-toggle')!;

    expect(field(element, 'password').type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');

    toggle.click();
    fixture.detectChanges();

    expect(field(element, 'password').type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
  });

  it('shows the required email message and sends no request', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await submit(element, fixture);

    expect(errorText(element)).toContain('Enter your email.');
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('shows the email format message and sends no request', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Enter a valid email address.');
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('shows the email length message when the email is longer than 254 characters', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', `${'a'.repeat(243)}@example.com`);
    await submit(element, fixture);

    expect(errorText(element)).toContain('Email must be at most 254 characters.');
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('shows the password message when the password is empty and sends no request', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await submit(element, fixture);

    expect(errorText(element)).toContain(passwordMessage);
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('shows the password message when the password is shorter than 6 characters', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Ab!1');
    await submit(element, fixture);

    expect(errorText(element)).toContain(passwordMessage);
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('shows the password message when the password has no special character and sends no request', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc123');
    await submit(element, fixture);

    expect(errorText(element)).toContain(passwordMessage);
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('marks an invalid field with the danger border and a message below it', async () => {
    const { fixture, element } = setup(successGateway());

    await submit(element, fixture);

    const input = field(element, 'email');
    expect(input.classList).toContain('field--invalid');
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));
    expect(rules.some((text) => text.includes('.field--invalid') && text.includes('border-color: var(--mm-color-danger)'))).toBe(true);
    expect(input.nextElementSibling?.getAttribute('data-error')).not.toBeNull();
  });

  it('sends exactly one register request with the normalised email and the password for a valid submit', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', ' User@Example.com ');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(gateway.register).toHaveBeenCalledTimes(1);
    expect(gateway.register).toHaveBeenCalledWith('user@example.com', 'Abc!12');
  });

  it('blocks a second submit and shows a skeleton while the request runs', async () => {
    const response = new Subject<void>();
    const gateway = { register: vi.fn((): Observable<void> => response), signIn: vi.fn(() => of({ accessToken: 'token' })) };
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(element.querySelector('app-skeleton')).not.toBeNull();
    expect(element.querySelector('#email')).toBeNull();
    expect(gateway.register).toHaveBeenCalledTimes(1);

    response.next();
    response.complete();
  });

  it('takes the user to the main route after the registration and the sign-in succeed', async () => {
    const { fixture, element, navigate } = setup(successGateway());

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('shows the email taken message and keeps the typed values', async () => {
    const { fixture, element, navigate } = setup({ ...successGateway(), register: vi.fn(() => throwError(() => 'emailTaken')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(errorText(element)).toContain('An account with this email already exists.');
    expect(field(element, 'email').value).toBe('user@example.com');
    expect(field(element, 'password').value).toBe('Abc!12');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('shows the network message after a network failure and keeps the typed values', async () => {
    const { fixture, element } = setup({ ...successGateway(), register: vi.fn(() => throwError(() => 'network')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(errorText(element)).toContain('No connection. Check your network and try again.');
    expect(field(element, 'email').value).toBe('user@example.com');
  });

  it('takes the user to the sign-in page when the sign-in after registration fails with invalid credentials', async () => {
    const { fixture, element, navigate } = setup({ ...successGateway(), signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await submit(element, fixture);

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('shows the texts of the active language', async () => {
    const { fixture, element, translate } = setup(successGateway());

    translate.use('es');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).toBe('Crear cuenta');
    expect(element.querySelector<HTMLAnchorElement>('a.login-link')?.textContent?.trim()).toBe('¿Ya tienes cuenta? Iniciar sesión');
  });

  it('shows the repeat password field with its label', () => {
    const { element } = setup(successGateway());

    expect(element.querySelector('label[for="repeat-password"]')?.textContent?.trim()).toBe('Repeat password');
    expect(field(element, 'repeat-password').type).toBe('password');
  });

  it('shows the mismatch message on the repeat field and sends no request when the passwords differ', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!13');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Passwords do not match.');
    expect(field(element, 'repeat-password').nextElementSibling?.getAttribute('data-error')).not.toBeNull();
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('compares the passwords exactly, without changing case or trimming spaces', async () => {
    const gateway = successGateway();
    const { fixture, element } = setup(gateway);

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'Abc!12');
    await typeInto(element, fixture, 'repeat-password', 'abc!12');
    await submit(element, fixture);

    expect(errorText(element)).toContain('Passwords do not match.');
    expect(gateway.register).not.toHaveBeenCalled();
  });

  it('gives every interactive element an accessible name', () => {
    const { element } = setup(successGateway());

    expect(element.querySelector('label[for="email"]')).not.toBeNull();
    expect(element.querySelector('label[for="password"]')).not.toBeNull();
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).not.toBe('');
    expect(element.querySelector('app-language-switcher button')?.getAttribute('aria-label')).toBe('languages');
    expect(element.querySelector<HTMLAnchorElement>('a.login-link')?.textContent?.trim()).not.toBe('');
  });
});
