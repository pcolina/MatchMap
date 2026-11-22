import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerInfoCircle, tablerLanguage, tablerLogout, tablerSunMoon, tablerUser, tablerX } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const css = () => readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'account-sheet', 'account-sheet.css'), 'utf8');
import en from '../../../../../../packages/shared/i18n/en.json';
import { AccountSheet } from './account-sheet';

@Component({
  imports: [AccountSheet],
  template: `<app-account-sheet [open]="open()" [displayName]="name()" [darkMode]="dark()" (closed)="closes = closes + 1" />`,
})
class Host {
  readonly open = signal(true);
  readonly name = signal<string | null>('Ana');
  readonly dark = signal(false);
  closes = 0;
}

const create = (name: string | null = 'Ana') => {
  TestBed.configureTestingModule({
    imports: [Host],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerInfoCircle, tablerLanguage, tablerLogout, tablerSunMoon, tablerUser, tablerX })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.name.set(name);
  fixture.detectChanges();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
};

describe('AccountSheet', () => {
  it('is a modal dialog named after the display name', () => {
    const { root } = create('Ana');
    const dialog = root.querySelector('dialog') as HTMLDialogElement;
    const labelId = dialog.getAttribute('aria-labelledby');

    expect(dialog.open).toBe(true);
    expect(labelId).toBeTruthy();
    expect(root.querySelector(`#${labelId}`)?.textContent?.trim()).toBe('Ana');
  });

  it('shows the rows as one list with no group headings', () => {
    const { root } = create();

    expect(root.querySelectorAll('h3').length).toBe(0);
  });

  it('shows sign out last, after a divider', () => {
    const { root } = create();
    const rows = Array.from(root.querySelectorAll('button[data-row]'));
    const signOut = rows[rows.length - 1] as HTMLElement;

    expect(signOut.textContent?.trim()).toBe('Sign out');
    expect(signOut.previousElementSibling?.tagName).toBe('HR');
  });

  it('shows the rows in order: profile, language, day or night mode, about, sign out', () => {
    const { root } = create();
    const names = Array.from(root.querySelectorAll('button[data-row]')).map((button) => button.textContent?.trim());

    expect(names).toEqual(['View profile', 'Language', 'Light or dark mode', 'About matchMap', 'Sign out']);
  });

  it('makes day or night mode a switch that shows whether dark mode is on', () => {
    const { fixture, root, host } = create();
    const toggle = root.querySelector('button[role="switch"]') as HTMLButtonElement;

    expect(toggle.textContent?.trim()).toBe('Light or dark mode');
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    host.dark.set(true);
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('gives every row a button with its accessible name', () => {
    const { root } = create();
    const names = Array.from(root.querySelectorAll('button[data-row]')).map((button) => button.textContent?.trim());

    expect(names).toEqual(['View profile', 'Language', 'Light or dark mode', 'About matchMap', 'Sign out']);
  });

  it('emits closed when the close control is activated', () => {
    const { root, host } = create();
    (root.querySelector('button[aria-label="Close"]') as HTMLButtonElement).click();

    expect(host.closes).toBe(1);
  });

  it('emits closed when Escape is pressed', () => {
    const { root, host } = create();
    (root.querySelector('dialog') as HTMLDialogElement).dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(host.closes).toBe(1);
  });

  it('emits closed when the backdrop is tapped', () => {
    const { root, host } = create();
    (root.querySelector('dialog') as HTMLDialogElement).click();

    expect(host.closes).toBe(1);
  });

  it('shows the user circle with the same icon as the account control on the map', () => {
    const { root } = create();
    const avatar = root.querySelector('[data-testid="avatar"]');

    expect(avatar?.querySelector('ng-icon')?.getAttribute('name')).toBe('tablerUser');
    expect(avatar?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows a loading line instead of the name while the display name is unknown', () => {
    const { root } = create(null);

    expect(root.querySelector('[data-testid="name-skeleton"]')).not.toBeNull();
  });

  it('never shows an email address', () => {
    const { root } = create('Ana');

    expect(root.textContent).not.toContain('@');
  });

  it('gives every row an icon before its label', () => {
    const { root } = create();
    const rows = Array.from(root.querySelectorAll('button[data-row]'));

    expect(rows.length).toBe(5);
    expect(rows.every((row) => row.querySelector('ng-icon') !== null)).toBe(true);
  });

  it('changes the row background on hover only for a mouse with a fine pointer', () => {
    expect(css()).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[\s\S]*\.row:hover\s*\{[^}]*background(-color)?:\s*var\(--mm-color-accentSubtle\)/);
  });

  it('caps the dialog width at 320 px', () => {
    expect(css()).toMatch(/\.sheet\s*\{[^}]*max-width:\s*320px/);
  });

  it('fades the dialog and its backdrop over 200 ms', () => {
    expect(css()).toMatch(/\.sheet\s*\{[^}]*transition:[^;]*opacity\s+200ms/);
    expect(css()).toMatch(/\.sheet::backdrop\s*\{[^}]*transition:[^;]*200ms/);
  });

  it('removes the transition when reduced motion is requested', () => {
    expect(css()).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*\.sheet[\s\S]*transition:\s*none/);
  });
});
