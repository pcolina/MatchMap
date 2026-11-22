import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { hideDialog, showDialog } from '../native-dialog';

@Component({
  selector: 'app-about-dialog',
  imports: [NgIcon, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<dialog
    #dialog
    class="about"
    aria-labelledby="about-dialog-title"
    (cancel)="onCancel($event)"
    (click)="onBackdropClick($event)"
  >
    <header class="about__header">
      <h2 id="about-dialog-title" class="title">matchMap</h2>
      <button type="button" class="close" [attr.aria-label]="'account.about.close' | translate" (click)="closed.emit()">
        <ng-icon name="tablerX" />
      </button>
    </header>
    <p class="about__version">
      <span>{{ 'account.about.version' | translate }}</span>
      <span class="version" data-testid="version">{{ version() }}</span>
    </p>
  </dialog>`,
  styleUrl: './about-dialog.css',
})
export class AboutDialog {
  readonly open = input(false);
  readonly version = input.required<string>();
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
