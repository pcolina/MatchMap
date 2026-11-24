import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerPlus, tablerUser, tablerUsers } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { MapTopControls } from './map-top-controls';

const create = (avatarLoading: boolean, pendingCount = 0) => {
  TestBed.configureTestingModule({
    imports: [MapTopControls],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerPlus, tablerUser, tablerUsers })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(MapTopControls);
  fixture.componentRef.setInput('avatarLoading', avatarLoading);
  fixture.componentRef.setInput('pendingCount', pendingCount);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
};

describe('MapTopControls', () => {
  it('shows the add-place button above the friends button in one column', () => {
    const root = create(false);
    const column = root.querySelector('[data-column="top-left"]') as HTMLElement;
    const names = Array.from(column.querySelectorAll('button')).map((button) => button.getAttribute('aria-label'));

    expect(names).toEqual(['Add place', 'Friends']);
  });

  it('shows the account button as the only control at the top right', () => {
    const root = create(false);
    const right = root.querySelector('[data-column="top-right"]') as HTMLElement;

    expect(Array.from(right.querySelectorAll('button')).map((button) => button.getAttribute('aria-label'))).toEqual(['Account']);
  });

  it('shows the account icon when the user information is ready', () => {
    const root = create(false);

    expect(root.querySelector('[data-icon="tablerUser"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="avatar-skeleton"]')).toBeNull();
  });

  it('shows a grey placeholder circle while the user information loads', () => {
    const root = create(true);

    expect(root.querySelector('[data-testid="avatar-skeleton"]')).not.toBeNull();
    expect(root.querySelector('[data-icon="tablerUser"]')).toBeNull();
  });

  it('shows a red dot on the avatar while notifications are pending', () => {
    const root = create(false, 3);
    const dot = root.querySelector('[data-testid="notification-dot"]') as HTMLElement;

    expect(dot).not.toBeNull();
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });

  it('names the avatar with the number of pending notifications', () => {
    const root = create(false, 3);
    const account = root.querySelector('[data-column="top-right"] button') as HTMLButtonElement;

    expect(account.getAttribute('aria-label')).toBe('Account, 3 unread notifications');
  });

  it('shows no dot and the plain account name when nothing is pending', () => {
    const root = create(false, 0);
    const account = root.querySelector('[data-column="top-right"] button') as HTMLButtonElement;

    expect(root.querySelector('[data-testid="notification-dot"]')).toBeNull();
    expect(account.getAttribute('aria-label')).toBe('Account');
  });
});
