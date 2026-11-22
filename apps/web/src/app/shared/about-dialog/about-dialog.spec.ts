import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { appVersion } from '../../core/app-version';
import { AboutDialog } from './about-dialog';

type NodeProcess = {
  cwd(): string;
  getBuiltinModule(id: 'node:fs'): { readFileSync(path: string, encoding: 'utf8'): string };
  getBuiltinModule(id: 'node:path'): { resolve(...paths: string[]): string };
};

const nodeProcess = (globalThis as unknown as { process: NodeProcess }).process;
const { readFileSync } = nodeProcess.getBuiltinModule('node:fs');
const { resolve } = nodeProcess.getBuiltinModule('node:path');
const css = () => readFileSync(resolve(nodeProcess.cwd(), 'src', 'app', 'shared', 'about-dialog', 'about-dialog.css'), 'utf8');

@Component({
  imports: [AboutDialog],
  template: `<app-about-dialog [open]="open()" [version]="version" (closed)="closes = closes + 1" />`,
})
class Host {
  readonly open = signal(true);
  readonly version = appVersion;
  closes = 0;
}

const create = () => {
  TestBed.configureTestingModule({
    imports: [Host],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerX })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return { root: fixture.nativeElement as HTMLElement, host: fixture.componentInstance };
};

describe('AboutDialog', () => {
  it('is a modal dialog named matchMap', () => {
    const { root } = create();
    const dialog = root.querySelector('dialog') as HTMLDialogElement;
    const labelId = dialog.getAttribute('aria-labelledby');

    expect(dialog.open).toBe(true);
    expect(root.querySelector(`#${labelId}`)?.textContent?.trim()).toBe('matchMap');
  });

  it('shows the version in the accent colour', () => {
    const { root } = create();

    expect(root.querySelector('[data-testid="version"]')?.textContent).toContain('1.0.0');
    expect(css()).toMatch(/\.version\s*\{[^}]*color:\s*var\(--mm-color-accent\)/);
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
});
