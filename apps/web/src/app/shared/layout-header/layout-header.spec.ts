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
  it('shows the light-background logo in both schemes', () => {
    const { fixture, host, root } = create();
    const logo = root.querySelector('.layout-header img') as HTMLImageElement;

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-light.svg');
    expect(logo.getAttribute('alt')).toBe('matchMap');

    host.dark.set(true);
    fixture.detectChanges();

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-light.svg');
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

  it('draws the hover circle smaller than the 44 px button, behind the icon', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.control::before\s*\{[^}]*width:\s*var\(--mm-space-8\);/);
    expect(css).toMatch(/\.control::before\s*\{[^}]*height:\s*var\(--mm-space-8\);/);
    expect(css).toMatch(/\.control ng-icon\s*\{[^}]*position:\s*relative;/);
  });

  it('uses the accent background and the onAccent text token in the dark scheme', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.layout-header\.dark\s*\{[^}]*background-color:\s*var\(--mm-color-accent\);/);
    expect(css).toMatch(/\.layout-header\.dark\s*\{[^}]*--mm-color-text:\s*var\(--mm-color-onAccent\);/);
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

  it('is 50 px high with the surface background and no scroll', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.layout-header\s*\{[^}]*height:\s*50px;/);
    expect(css).toMatch(/\.layout-header\s*\{[^}]*background-color:\s*var\(--mm-color-surface\);/);
    expect(css).toMatch(/\.layout-header\s*\{[^}]*overflow:\s*hidden;/);
  });

  it('shows the notifications dot as a perfect circle using the danger token', () => {
    const css = cssOf('layout-header/layout-header.css');

    expect(css).toMatch(/\.notification-dot\s*\{[^}]*background:\s*var\(--mm-color-danger\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*border-radius:\s*50%;/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*width:\s*var\(--mm-space-3\);/);
    expect(css).toMatch(/\.notification-dot\s*\{[^}]*height:\s*var\(--mm-space-3\);/);
  });

  it('shows a 2 px accent outline with a 2 px offset on keyboard focus of the header buttons', () => {
    const css = cssOf('layout-header/layout-header.css') + cssOf('account-button/account-button.css');

    expect(css).toMatch(/\.control:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--mm-color-accent\);/);
    expect(css).toMatch(/\.control:focus-visible\s*\{[^}]*outline-offset:\s*2px;/);
  });
});
