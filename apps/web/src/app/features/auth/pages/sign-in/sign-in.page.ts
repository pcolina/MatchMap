import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, submit, validate } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';
import { Router, RouterLink } from '@angular/router';
import { validateSignInEmail, validateSignInPassword } from '@matchmap/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonComponent, type SkeletonShape } from '../../../../shared/skeleton/skeleton';
import { LanguageSwitcherComponent } from '../../ui/language-switcher/language-switcher';
import { AuthStore } from '../../state/auth.store';

const toError = (key: string | null) => (key === null ? undefined : { kind: key });

@Component({
  selector: 'app-sign-in-page',
  imports: [FormField, LanguageSwitcherComponent, NgIcon, RouterLink, SkeletonComponent, TranslatePipe],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  private readonly router = inject(Router);
  protected readonly store = inject(AuthStore);
  protected readonly shapes: readonly SkeletonShape[] = ['field', 'field', 'button'];
  protected readonly showPassword = signal(false);

  private readonly credentials = signal({ email: '', password: '' });
  protected readonly form = form(this.credentials, (path) => {
    validate(path.email, ({ value }) => toError(validateSignInEmail(value())));
    validate(path.password, ({ value }) => toError(validateSignInPassword(value())));
  });

  protected readonly failureMessage = computed(() => {
    switch (this.store.failure()) {
      case 'invalidCredentials':
        return 'login.signIn.errorInvalidCredentials';
      case 'tooManyAttempts':
        return 'login.signIn.errorTooManyAttempts';
      case 'signInAfterRegister':
        return 'login.register.errorSignInAfterRegister';
      case 'network':
        return 'login.common.errorNetwork';
      case 'unknown':
        return 'login.common.errorUnknown';
      default:
        return null;
    }
  });

  constructor() {
    effect(() => {
      if (this.store.accessToken() !== null) {
        this.router.navigateByUrl('/');
      }
    });
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.store.signIn(this.credentials());
    });
  }
}
