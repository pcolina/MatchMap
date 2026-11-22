import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';

const showDialog = (element: HTMLDialogElement): void => {
  if (typeof element.showModal === 'function') {
    element.showModal();
  } else {
    element.setAttribute('open', '');
  }
};

const hideDialog = (element: HTMLDialogElement): void => {
  if (typeof element.close === 'function') {
    element.close();
  } else {
    element.removeAttribute('open');
  }
};

@Component({
  selector: 'app-account-sheet',
  imports: [NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog
    #dialog
    class="sheet"
    aria-labelledby="account-sheet-title"
    (cancel)="onCancel($event)"
    (click)="onBackdropClick($event)"
  >
    <header class="sheet__header">
      <span class="avatar" data-testid="avatar" aria-hidden="true"><ng-icon name="tablerUser" /></span>
      <div class="identity">
        @if (displayName() === null) {
          <span class="name-skeleton" data-testid="name-skeleton" aria-hidden="true"></span>
        } @else {
          <h2 id="account-sheet-title" class="name">{{ displayName() }}</h2>
          @if (email()) {
            <p class="email" data-testid="email">{{ email() }}</p>
          }
        }
      </div>
      <button type="button" class="close" [attr.aria-label]="'account.sheet.close' | translate" (click)="closed.emit()">
        <ng-icon name="tablerX" />
      </button>
    </header>

    <hr class="divider" />
    <button type="button" class="row" data-row><ng-icon name="tablerUser" />{{ 'account.sheet.profile' | translate }}</button>
    <button type="button" class="row" data-row><ng-icon name="tablerLanguage" />{{ 'account.sheet.language' | translate }}</button>
    <button type="button" class="row" data-row role="switch" [attr.aria-checked]="darkMode()"><ng-icon name="tablerSunMoon" />{{ 'account.sheet.theme' | translate }}<span class="track" aria-hidden="true"></span></button>
    <button type="button" class="row" data-row><ng-icon name="tablerInfoCircle" />{{ 'account.sheet.aboutItem' | translate }}</button>
    <hr class="divider" />
    <button type="button" class="row" data-row><ng-icon name="tablerLogout" />{{ 'account.sheet.signOut' | translate }}</button>
  </dialog>`,
  styleUrl: './account-sheet.css',
})
export class AccountSheet {
  readonly open = input(false);
  readonly displayName = input<string | null>(null);
  readonly email = input<string | null>(null);
  readonly darkMode = input(false);
  readonly closed = output<void>();

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const element = this.dialog()?.nativeElement;
      if (!element) {
        return;
      }
      if (this.open() && !element.open) {
        showDialog(element);
      } else if (!this.open() && element.open) {
        hideDialog(element);
      }
    });
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog()?.nativeElement) {
      this.closed.emit();
    }
  }
}
