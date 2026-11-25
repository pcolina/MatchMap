import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { tablerUser } from '@ng-icons/tabler-icons';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';
import en from '../../../../../../packages/shared/i18n/en.json';
import { AccountButton } from './account-button';

const create = (inputs: { avatarLoading?: boolean; accountOpen?: boolean; pendingCount?: number } = {}) => {
  TestBed.configureTestingModule({
    imports: [AccountButton],
    providers: [provideTranslateService({ fallbackLang: 'en' }), provideIcons({ tablerUser })],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', en);
  translate.use('en');
  const fixture = TestBed.createComponent(AccountButton);
  fixture.componentRef.setInput('avatarLoading', inputs.avatarLoading ?? false);
  fixture.componentRef.setInput('accountOpen', inputs.accountOpen ?? false);
  fixture.componentRef.setInput('pendingCount', inputs.pendingCount ?? 0);
  fixture.detectChanges();
  return { fixture, root: fixture.nativeElement as HTMLElement };
};

describe('AccountButton', () => {
  it('is named Account when no notification is pending', () => {
    const { root } = create();

    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Account');
  });

  it('names the account button with the number of pending notifications', () => {
    const { root } = create({ pendingCount: 2 });

    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Account, 2 unread notifications');
  });

  it('shows a dot hidden from assistive tech while notifications are pending', () => {
    const { root } = create({ pendingCount: 2 });
    const dot = root.querySelector('[data-testid="notification-dot"]') as HTMLElement;

    expect(dot).not.toBeNull();
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows no dot while nothing is pending', () => {
    const { root } = create({ pendingCount: 0 });

    expect(root.querySelector('[data-testid="notification-dot"]')).toBeNull();
  });

  it('shows a skeleton instead of the icon while the user information loads', () => {
    const { root } = create({ avatarLoading: true });

    expect(root.querySelector('[data-testid="avatar-skeleton"]')).not.toBeNull();
    expect(root.querySelector('[data-icon="tablerUser"]')).toBeNull();
  });

  it('reflects the open state of the account sheet in aria-expanded', () => {
    const { root } = create({ accountOpen: true });

    expect(root.querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('emits accountPressed once when clicked', () => {
    const { fixture, root } = create();
    let presses = 0;
    fixture.componentInstance.accountPressed.subscribe(() => presses++);

    (root.querySelector('button') as HTMLButtonElement).click();

    expect(presses).toBe(1);
  });
});
