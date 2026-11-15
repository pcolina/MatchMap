import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { tablerAlertCircle, tablerBrandApple, tablerBrandFacebook, tablerBrandGoogle, tablerEye, tablerEyeOff, tablerLanguage, tablerLock, tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import en from '../../../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../../../packages/shared/i18n/es.json';
import { AuthStore, SIGN_IN_GATEWAY, type SignInGateway } from '../../state/auth.store';
import { SignInPage } from './sign-in.page';

type Gateway = { signIn: ReturnType<typeof vi.fn> };

const setup = (gateway: Gateway) => {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as MediaQueryList;
  TestBed.configureTestingModule({
    providers: [
      provideIcons({ tablerAlertCircle, tablerLanguage, tablerBrandGoogle, tablerBrandFacebook, tablerBrandApple, tablerUser, tablerLock, tablerEye, tablerEyeOff }),
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

  it('centres its content horizontally, starting under the header', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const content = element.querySelector<HTMLElement>('.content')!;

    expect(getComputedStyle(content).getPropertyValue('align-items')).toBe('center');
    expect(getComputedStyle(content).getPropertyValue('justify-content')).toBe('flex-start');
  });

  it('shows the logo on a gradient header built from the accent and background tokens', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const header = element.querySelector<HTMLElement>('header.hero')!;

    expect(header.querySelector<HTMLImageElement>('img')?.getAttribute('alt')).toBe('MatchMap');
    expect(header.querySelector<HTMLImageElement>('img')?.getAttribute('src')).toBe('brand/matchmap-stacked-light.png');
    expect(header.querySelector('.tagline')?.textContent?.trim()).toBe('Compare, plan, discover.');
    expect(getComputedStyle(header).getPropertyValue('background-image')).toContain('var(--mm-color-accentSubtle)');
    expect(getComputedStyle(header).getPropertyValue('background-image')).toContain('var(--mm-color-bg)');
  });

  it('spaces the form components wider and takes that space from the header above the form', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const form = element.querySelector<HTMLElement>('form')!;
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));

    expect(getComputedStyle(form).getPropertyValue('gap')).toBe('var(--mm-space-5)');
    expect(rules.some((text) => text.includes('.hero') && text.includes('var(--mm-space-12)'))).toBe(true);
  });

  it('pulls each label slightly closer to its input', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const label = element.querySelector<HTMLElement>('label[for="email"]')!;

    expect(getComputedStyle(label).getPropertyValue('margin-bottom')).toBe('calc(-1 * var(--mm-space-2))');
  });

  it('adds more space between the password field and the sign-in button', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const submit = element.querySelector<HTMLElement>('button[type="submit"]')!;

    expect(getComputedStyle(submit).getPropertyValue('margin-top')).toBe('var(--mm-space-3)');
  });

  it('sits each field error 5 px under its input and keeps the rest of the layout still', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    for (const id of ['#email-error', '#password-error']) {
      const error = element.querySelector<HTMLElement>(id)!;

      expect(getComputedStyle(error).getPropertyValue('margin-top')).toBe('5px');
      expect(getComputedStyle(error).getPropertyValue('margin-bottom')).toBe('calc(var(--mm-space-4) - 5px)');
    }
  });

  it('uses the input border token for the inputs and the social button outlines', () => {
    setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));

    expect(rules.some((text) => text.startsWith('input') && text.includes('border-color: var(--mm-color-borderInput)'))).toBe(true);
    expect(rules.some((text) => text.includes('.social-button') && text.includes('var(--mm-color-borderInput)'))).toBe(true);
  });

  it('sets the tagline in the handwritten font and slants it upwards', () => {
    setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));

    expect(rules.some((text) => text.includes('.tagline') && text.includes('font-family: var(--mm-font-handwritten)'))).toBe(true);
    expect(rules.some((text) => text.includes('.tagline') && text.includes('skewX(var(--mm-skew-tagline))'))).toBe(true);
  });

  it('reserves the error space under each field so that errors do not move the layout', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    const emailError = element.querySelector<HTMLElement>('#email-error')!;
    const passwordError = element.querySelector<HTMLElement>('#password-error')!;

    expect(emailError).not.toBeNull();
    expect(passwordError).not.toBeNull();
    expect(emailError.textContent?.trim()).toBe('');
    expect(passwordError.textContent?.trim()).toBe('');
    expect(getComputedStyle(emailError).getPropertyValue('min-height')).toBe('max(var(--mm-type-caption-line-height), var(--mm-size-icon-md))');
  });

  it('keeps the space of the sign-in failure reserved so that showing it does not move the layout', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    const alert = element.querySelector<HTMLElement>('[role="alert"]')!;

    expect(alert).not.toBeNull();
    expect(alert.textContent?.trim()).toBe('');
    expect(getComputedStyle(alert).getPropertyValue('min-height')).toBe('max(var(--mm-type-caption-line-height), var(--mm-size-icon-md))');
  });

  it('shows every sign-in failure text inside the password field group', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'unknown')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    const alert = element.querySelector<HTMLElement>('[role="alert"]')!;
    expect(field(element, 'password').parentElement!.contains(alert)).toBe(true);
    expect(alert.textContent?.trim()).toBe('Something went wrong. Try again.');
  });

  it('hides the sign-in failure when the user edits the email and keeps the typed values', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Email or password is incorrect.');

    await typeInto(element, fixture, 'email', 'other@example.com');

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    expect(field(element, 'email').value).toBe('other@example.com');
    expect(field(element, 'password').value).toBe('123456');
  });

  it('hides the sign-in failure when the user edits the password', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    await typeInto(element, fixture, 'password', '654321');

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    expect(field(element, 'password').value).toBe('654321');
  });

  it('shows only the password field error after an edit to a value that is too short', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    await typeInto(element, fixture, 'password', '123');

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    expect(element.querySelector('#password-error')?.textContent?.trim()).toBe('Password must be 6 to 20 characters.');
  });

  it('shows the sign-in failure again after a new failed submit', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'invalidCredentials')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);
    await typeInto(element, fixture, 'email', 'other@example.com');
    await submit(element, fixture);

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Email or password is incorrect.');
  });

  it('hides the sign-in failure and sends no request when the user submits an empty email', async () => {
    const signIn = vi.fn(() => throwError(() => 'invalidCredentials'));
    const { fixture, element } = setup({ signIn });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);
    await typeInto(element, fixture, 'email', '');
    await submit(element, fixture);

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
    expect(errorText(element)).toContain('Enter your email.');
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it('centres the sign-in failure between the password input and the sign-in button', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));

    expect(rules.some((text) => text.includes('[role=alert]') && text.includes('margin-top: calc(-1 * var(--mm-space-1))'))).toBe(true);
    expect(rules.some((text) => text.includes('button[type=submit]') && text.includes('margin-top: var(--mm-space-3)'))).toBe(true);
  });

  it('shows a decorative alert icon before the failure message', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => 'unknown')) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    const icon = element.querySelector('[role="alert"] ng-icon')!;
    expect(icon.getAttribute('name')).toBe('tablerAlertCircle');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows the alert icon before a field error message', async () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    await submit(element, fixture);

    const icon = element.querySelector('#email-error ng-icon')!;
    expect(icon.getAttribute('name')).toBe('tablerAlertCircle');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('colours the error icon with the danger token and sizes it with the icon token', () => {
    setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));

    expect(rules.some((text) => text.includes('.error-icon') && text.includes('color: var(--mm-color-danger)') && text.includes('width: var(--mm-size-icon-md)'))).toBe(true);


    expect(rules.some((text) => text.includes('.error-icon') && text.includes('top: 3px'))).toBe(true);
  });

  it('shows no alert icon in an empty error space', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    expect(element.querySelector('#email-error ng-icon')).toBeNull();
    expect(element.querySelector('#password-error ng-icon')).toBeNull();
    expect(element.querySelector('[role="alert"] ng-icon')).toBeNull();
  });

  it('shows the sign-in failure directly below the password field and above the submit button', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    const alert = element.querySelector<HTMLElement>('[role="alert"]')!;
    const passwordField = field(element, 'password').parentElement!;
    const passwordError = element.querySelector<HTMLElement>('#password-error')!;
    const submitButton = element.querySelector<HTMLElement>('button[type="submit"]')!;

    expect(passwordField.contains(alert)).toBe(true);
    expect(passwordError.compareDocumentPosition(alert) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(alert.compareDocumentPosition(submitButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shows a user icon inside the email field and a lock icon inside the password field', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    expect(field(element, 'email').parentElement?.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerUser');
    expect(field(element, 'password').parentElement?.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerLock');
  });

  it('toggles the password between hidden and visible with the eye button', () => {
    const { fixture, element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const toggle = element.querySelector<HTMLButtonElement>('.password-toggle')!;

    expect(field(element, 'password').type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerEyeOff');

    toggle.click();
    fixture.detectChanges();

    expect(field(element, 'password').type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(toggle.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerEye');
  });

  it('shows the language switcher in the top-right corner', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const topBar = element.querySelector<HTMLElement>('.top-bar')!;

    expect(topBar.querySelector('app-language-switcher')).not.toBeNull();
    expect(getComputedStyle(topBar).getPropertyValue('justify-content')).toBe('flex-end');
    expect(getComputedStyle(topBar).getPropertyValue('position')).toBe('absolute');
  });

  it('shows three social buttons marked as unavailable but still focusable with their brand icons and the coming-soon title', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>('.social button'));

    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Google', 'Facebook', 'Apple']);
    expect(buttons.every((button) => button.getAttribute('aria-disabled') === 'true' && !button.disabled)).toBe(true);
    expect(buttons.map((button) => button.querySelector('ng-icon')?.getAttribute('name'))).toEqual([
      'tablerBrandGoogle',
      'tablerBrandFacebook',
      'tablerBrandApple',
    ]);
    expect(buttons.every((button) => button.title === 'Coming soon')).toBe(true);
  });

  it('shows a grey divider with the "or" text between the sign-in button and the social buttons', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });
    const divider = element.querySelector<HTMLElement>('.divider')!;
    const submitButton = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const social = element.querySelector<HTMLElement>('.social')!;
    const label = divider.querySelector<HTMLElement>('.divider-label')!;

    expect(submitButton.compareDocumentPosition(divider) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(divider.compareDocumentPosition(social) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(label.textContent?.trim()).toBe('or');
    expect(label.getAttribute('aria-hidden')).toBe('true');
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText));
    expect(rules.some((text) => text.includes('.divider') && text.includes('border-top: 1px solid var(--mm-color-border)'))).toBe(true);
  });

  it('shows the Spanish divider text in Spanish', async () => {
    const { fixture, element, translate } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    translate.use('es');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector<HTMLElement>('.divider-label')?.textContent?.trim()).toBe('o');
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

  it.each([
    ['invalidEmail', 'email', 'Enter a valid email address.'],
    ['emailTooLong', 'email', 'Email must be at most 254 characters.'],
    ['invalidPassword', 'password', 'Password must be 6 to 20 characters.'],
  ])('shows the %s failure in the %s field and keeps the typed values', async (failure, id, message) => {
    const { fixture, element } = setup({ signIn: vi.fn(() => throwError(() => failure)) });

    await typeInto(element, fixture, 'email', 'user@example.com');
    await typeInto(element, fixture, 'password', '123456');
    await submit(element, fixture);

    expect(element.querySelector(`#${id}-error`)?.textContent?.trim()).toBe(message);
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');
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

  it('shows the sign-in after registration message when the automatic sign-in could not reach the server', async () => {
    const { fixture, element } = setup({
      signIn: vi.fn(() => throwError(() => 'network')),
      register: vi.fn(() => of(undefined)),
    } as Gateway);

    TestBed.inject(AuthStore).register({ email: 'user@example.com', password: '123456' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(errorText(element)).toContain('Your account was created, but we could not sign you in. Sign in again.');
  });

  it('gives every interactive element an accessible name', () => {
    const { element } = setup({ signIn: vi.fn(() => of({ accessToken: 'token' })) });

    expect(element.querySelector('label[for="email"]')).not.toBeNull();
    expect(element.querySelector('label[for="password"]')).not.toBeNull();
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.textContent?.trim()).not.toBe('');
    expect(Array.from(element.querySelectorAll<HTMLButtonElement>('.social button')).every((button) => button.getAttribute('aria-label'))).toBe(true);
    expect(element.querySelector('app-language-switcher button')?.getAttribute('aria-label')).toBe('languages');
    expect(element.querySelector<HTMLAnchorElement>('a.register')?.textContent?.trim()).not.toBe('');
  });
});
