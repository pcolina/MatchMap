import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerBell, tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { LayoutHeader } from './layout-header';

@Component({
  imports: [LayoutHeader],
  template: `<app-layout-header [darkMode]="dark()" (accountPressed)="accounts = accounts + 1" />`,
})
class Host {
  readonly dark = signal(false);
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
  it('shows the notifications button before the profile button', () => {
    const { root } = create();
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.layout-header button'));

    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(['Notifications', 'Account']);
  });

  it('shows the light logo in the light scheme and the dark logo in the dark scheme', () => {
    const { fixture, host, root } = create();
    const logo = root.querySelector('.layout-header img') as HTMLImageElement;

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-light.svg');
    expect(logo.getAttribute('alt')).toBe('matchMap');

    host.dark.set(true);
    fixture.detectChanges();

    expect(logo.getAttribute('src')).toBe('/brand/horizontal-on-dark.svg');
  });

  it('paints a red dot on the notifications button, hidden from assistive tech', () => {
    const { root } = create();
    const bell = root.querySelector('.layout-header button') as HTMLButtonElement;
    const dot = bell.querySelector('.notification-dot') as HTMLElement;

    expect(dot).not.toBeNull();
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });

  it('emits accountPressed once when the profile button is activated', () => {
    const { host, root } = create();
    const profile = root.querySelectorAll<HTMLButtonElement>('.layout-header button')[1];

    profile.click();

    expect(host.accounts).toBe(1);
  });

  it('does nothing when the notifications button is activated', () => {
    const { host, root } = create();
    const bell = root.querySelector('.layout-header button') as HTMLButtonElement;

    bell.click();

    expect(host.accounts).toBe(0);
  });

  it('shows no notification dot on the profile button', () => {
    const { root } = create();
    const profile = root.querySelectorAll<HTMLButtonElement>('.layout-header button')[1];

    expect(profile.querySelector('.notification-dot')).toBeNull();
  });
});
