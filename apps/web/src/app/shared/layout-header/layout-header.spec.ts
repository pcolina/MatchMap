import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerBell, tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { LayoutHeader } from './layout-header';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const cssOf = (file: string) => readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', file), 'utf8');

@Component({
  imports: [LayoutHeader],
  template: `<app-layout-header [darkMode]="dark()" [pendingCount]="pending()" (accountPressed)="accounts = accounts + 1" />`,
})
class Host {
  readonly dark = signal(false);
  readonly pending = signal(0);
  accounts = 0;
}

const create = () => {
  TestBed.configureTestingModule({
    imports: [Host],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerBell, tablerUser })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
};

describe('LayoutHeader', () => {
  it('shows the light-background logo in the light scheme and the dark-background logo in the dark scheme', () => {
    const { fixture, host, root } = create();
    const logo = root.querySelector('.layout-header img') as HTMLImageElement;

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-light.svg');
    expect(logo.getAttribute('alt')).toBe('matchMap');

    host.dark.set(true);
    fixture.detectChanges();

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-dark.svg');
  });

  it('marks the header with the dark class in the dark scheme only', () => {
    const { fixture, host, root } = create();
    const header = root.querySelector('.layout-header') as HTMLElement;

    expect(header.classList.contains('dark')).toBe(false);

    host.dark.set(true);
    fixture.detectChanges();

    expect(header.classList.contains('dark')).toBe(true);
  });

  it('draws the header profile button plain, like the notifications button', () => {
    const { root } = create();

    expect(root.querySelector('.layout-header app-account-button')?.classList.contains('plain')).toBe(true);
  });

  it('removes the circle, border and shadow of the account button when it is plain', () => {
    const css = cssOf('account-button/account-button.css');

    expect(css).toMatch(/:host\(\.plain\) \.control\s*\{[^}]*border:\s*0;/);
    expect(css).toMatch(/:host\(:not\(\.plain\)\) \.control\s*\{[^}]*box-shadow:\s*var\(--mm-elevation-card\);/);
    expect(css).toMatch(/:host\(\.plain\) \.control\s*\{[^}]*background:\s*transparent;/);
  });

  it('places the notification count 4 px in from the top right corner, closer to the bell', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.notification-dot\s*\{[^}]*top:\s*var\(--mm-space-1\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*right:\s*var\(--mm-space-1\);/);
  });

  it('draws the hover circle smaller than the 44 px button, behind the icon', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.control::before\s*\{[^}]*width:\s*var\(--mm-space-8\);/);
    expect(css).toMatch(/\.control::before\s*\{[^}]*height:\s*var\(--mm-space-8\);/);
    expect(css).toMatch(/\.control ng-icon\s*\{[^}]*position:\s*relative;/);
  });

  it('draws the hover as an accent disc with the onAccent icon, in the header and on the profile button', () => {
    const header = cssOf('layout-header/layout-header.css');
    const account = cssOf('account-button/account-button.css');

    expect(header).toMatch(/\.control:hover::before\s*\{\s*background:\s*var\(--mm-color-accent\);/);
    expect(header).toMatch(/\.control:hover\s*\{\s*color:\s*var\(--mm-color-onAccent\);/);
    expect(account).toMatch(/:host\(\.plain\) \.control:hover\s*\{[^}]*background:\s*transparent;/);
    expect(account).toMatch(/:host\(\.plain\) \.control:hover\s*\{[^}]*color:\s*var\(--mm-color-onAccent\);/);
    expect(account).toMatch(/:host\(\.plain\) \.control:hover::before\s*\{\s*background:\s*var\(--mm-color-accent\);/);
  });

  it('uses the surfaceRaised background in the dark scheme and keeps the dark theme text colour', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.layout-header\.dark\s*\{[^}]*background-color:\s*var\(--mm-color-surfaceRaised\);/);
    expect(css).not.toMatch(/\.layout-header\.dark\s*\{[^}]*onAccent/);
  });

  it('shows the notifications button before the profile button', () => {
    const { root } = create();
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.layout-header button'));

    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Notifications', 'Account']);
  });

  it('shows the pending count inside the red dot of the notifications button, hidden from assistive tech', () => {
    const { fixture, host, root } = create();
    host.pending.set(2);
    fixture.detectChanges();
    const bell = root.querySelector('.layout-header button') as HTMLButtonElement;
    const dot = bell.querySelector('.notification-dot') as HTMLElement;

    expect(bell.getAttribute('aria-label')).toBe('Notifications, 2 unread');
    expect(dot.textContent?.trim()).toBe('2');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows no dot on the notifications button while nothing is pending', () => {
    const { root } = create();
    const bell = root.querySelector('.layout-header button') as HTMLButtonElement;

    expect(bell.querySelector('.notification-dot')).toBeNull();
  });

  it('does nothing when the notifications button is activated', () => {
    const { host, root } = create();
    (root.querySelector('.layout-header button') as HTMLButtonElement).click();

    expect(host.accounts).toBe(0);
  });

  it('shows no dot and the plain name on the profile button while notifications are pending', () => {
    const { fixture, host, root } = create();
    host.pending.set(3);
    fixture.detectChanges();
    const profile = root.querySelector('.layout-header app-account-button button') as HTMLButtonElement;

    expect(profile.getAttribute('aria-label')).toBe('Account');
    expect(profile.querySelector('[data-testid="notification-dot"]')).toBeNull();
  });

  it('emits accountPressed once when the profile button is activated', () => {
    const { host, root } = create();
    (root.querySelector('.layout-header app-account-button button') as HTMLButtonElement).click();

    expect(host.accounts).toBe(1);
  });

  it('is 50 px high with the login green background and no scroll', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.layout-header\s*\{[^}]*height:\s*50px;/);
    expect(css).toMatch(/\.layout-header\s*\{[^}]*background-color:\s*var\(--mm-color-accentSubtle\);/);
    expect(css).toMatch(/\.layout-header\s*\{[^}]*overflow:\s*hidden;/);
  });

  it('shows the notifications dot with the danger token, a minimum 12 px height and a pill shape that grows for two digits', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.notification-dot\s*\{[^}]*background:\s*var\(--mm-color-danger\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*border-radius:\s*var\(--mm-radius-pill\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*min-width:\s*var\(--mm-space-3\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*height:\s*var\(--mm-space-3\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*padding:\s*1px\s+var\(--mm-space-1\)\s+0;/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*font-variant-numeric:\s*tabular-nums;/);
  });

  it('shows keyboard focus as a 32 px disc with a 2 px accent ring and a soft glow inside the 50 px bar', () => {
    const header = cssOf('layout-header/layout-header.css');
    const account = cssOf('account-button/account-button.css');

    expect(header).toMatch(/\.control:focus-visible\s*\{[^}]*outline:\s*none;/);
    expect(header).toMatch(/\.control:focus-visible::before\s*\{[^}]*outline:\s*var\(--mm-border-width-focus\) solid var\(--mm-color-accent\);/);
    expect(header).toMatch(/\.control:focus-visible::before\s*\{[^}]*outline-offset:\s*0;/);
    expect(header).toMatch(/\.control:focus-visible::before\s*\{[^}]*box-shadow:\s*0 0 var\(--mm-space-2\)/);
    expect(account).toMatch(/:host\(\.plain\) \.control:focus-visible::before\s*\{[^}]*outline:\s*var\(--mm-border-width-focus\) solid var\(--mm-color-accent\);/);
    expect(account).toMatch(/:host\(\.plain\) \.control:focus-visible::before\s*\{[^}]*box-shadow:\s*0 0 var\(--mm-space-2\)/);
  });
});
