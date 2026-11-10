import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, submit, validate } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';
import { Router, RouterLink } from '@angular/router';
import { normalizeEmail, validateRegisterPassword, validateSignInEmail } from '@matchmap/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonComponent, type SkeletonShape } from '../../../../shared/skeleton/skeleton';
import { LanguageSwitcherComponent } from '../../ui/language-switcher/language-switcher';
import { AuthStore, type AuthFailure } from '../../state/auth.store';

const toError = (key: string | null) => (key === null ? undefined : { kind: key });

const signInFailures: ReadonlySet<AuthFailure> = new Set(['invalidCredentials', 'tooManyAttempts', 'signInAfterRegister']);

@Component({
  selector: 'app-register-page',
  imports: [FormField, LanguageSwitcherComponent, NgIcon, RouterLink, SkeletonComponent, TranslatePipe],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly router = inject(Router);
  protected readonly store = inject(AuthStore);
  protected readonly shapes: readonly SkeletonShape[] = ['field', 'field', 'button'];
  protected readonly showPassword = signal(false);

  private readonly credentials = signal({ email: '', password: '' });
  protected readonly form = form(this.credentials, (path) => {
    validate(path.email, ({ value }) => toError(validateSignInEmail(value())));
    validate(path.password, ({ value }) => toError(validateRegisterPassword(value())));
  });

  protected readonly failureMessage = computed(() => {
    switch (this.store.failure()) {
      case 'emailTaken':
        return 'login.register.errorEmailTaken';
      case 'passwordInvalid':
        return 'login.register.errorPasswordInvalid';
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
    effect(() => {
      const failure = this.store.failure();
      if (failure !== null && signInFailures.has(failure)) {
        this.router.navigateByUrl('/login');
      }
    });
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const { email, password } = this.credentials();
      this.store.register({ email: normalizeEmail(email), password });
    });
  }
}
