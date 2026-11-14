import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-native/icons';
import { normalizeEmail, validateRegisterPassword, validateSignInEmail } from '@matchmap/shared';
import { TranslateService } from '@ngx-translate/core';
import { Image, Pressable, SafeAreaView, Text, TextInput, View } from '@ng-native/components';
import { ColorScheme } from '@ng-native/device';
import { logoSize, logoSource } from '../../../../core/brand/logo.ts';
import { fontFamilyFor, textStyle } from '../../../../core/fonts/fonts.ts';
import { colors, radius, size, space, typography } from '../../../../core/theme/tokens.ts';
import { SkeletonComponent, type SkeletonShape } from '../../../../shared/skeleton/skeleton.ts';
import { LanguageSwitcherComponent } from '../../ui/language-switcher/language-switcher.ts';
import { AuthStore } from '../../state/auth.store.ts';
import type { AuthFailure } from '../../state/auth.model.ts';

const toError = (key: string | null) => (key === null ? undefined : { kind: key });

const signInFailures: ReadonlySet<AuthFailure> = new Set<AuthFailure>(['invalidCredentials', 'tooManyAttempts', 'signInAfterRegister']);

@Component({
  selector: 'app-register-page',
  imports: [FormField, Image, LanguageSwitcherComponent, NgIcon, Pressable, SafeAreaView, SkeletonComponent, Text, TextInput, View],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <safe-area-view class="screen" [style.backgroundColor]="palette().bg">
      <view class="top-bar">
        <app-language-switcher />
      </view>

      <view class="hero">
        <image [source]="logo.source" resizeMode="contain" accessibilityLabel="MatchMap" [style.width]="logo.width" [style.height]="logo.height" />
        <text class="tagline" [style]="tagline" [style.color]="palette().text">{{ t('login.brand.tagline') }}</text>
      </view>

      <view class="content">
        @if (store.isLoading()) {
          <app-skeleton [shapes]="shapes" />
        } @else {
          <view class="form">
            <text [style]="ts('label')" [style.color]="palette().text">{{ t('login.register.emailLabel') }}</text>
            <view class="field">
              <ng-icon name="tablerUser" [color]="palette().textSecondary" />
              <text-input
                class="input"
                [accessibilityLabel]="t('login.register.emailLabel')"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                [formField]="form.email"
                [style.color]="palette().text"
                [style.borderColor]="form.email().touched() && form.email().invalid() ? palette().danger : palette().borderStrong"
                [style.backgroundColor]="palette().surface"
              />
            </view>
            <text testID="email-error" [style]="ts('caption')" [style.color]="palette().danger">{{ form.email().touched() && form.email().invalid() ? t(form.email().errors()[0]?.kind ?? '') : '' }}</text>

            <text [style]="ts('label')" [style.color]="palette().text">{{ t('login.register.passwordLabel') }}</text>
            <view class="field">
              <ng-icon name="tablerLock" [color]="palette().textSecondary" />
              <text-input
                class="input"
                [accessibilityLabel]="t('login.register.passwordLabel')"
                [secureTextEntry]="!showPassword()"
                autoCapitalize="none"
                autoComplete="new-password"
                [formField]="form.password"
                [style.color]="palette().text"
                [style.borderColor]="form.password().touched() && form.password().invalid() ? palette().danger : palette().borderStrong"
                [style.backgroundColor]="palette().surface"
              />
              <pressable
                accessibilityRole="button"
                [accessibilityLabel]="t(showPassword() ? 'login.signIn.hidePassword' : 'login.signIn.showPassword')"
                (press)="togglePassword()"
              >
                <ng-icon [name]="showPassword() ? 'tablerEye' : 'tablerEyeOff'" [color]="palette().textSecondary" />
              </pressable>
            </view>
            <text testID="password-error" [style]="ts('caption')" [style.color]="palette().danger">{{ form.password().touched() && form.password().invalid() ? t(form.password().errors()[0]?.kind ?? '') : '' }}</text>

            <text [style]="ts('label')" [style.color]="palette().text">{{ t('login.register.repeatPasswordLabel') }}</text>
            <view class="field">
              <ng-icon name="tablerLock" [color]="palette().textSecondary" />
              <text-input
                class="input"
                [accessibilityLabel]="t('login.register.repeatPasswordLabel')"
                [secureTextEntry]="true"
                autoCapitalize="none"
                autoComplete="new-password"
                [formField]="form.repeatPassword"
                [style.color]="palette().text"
                [style.borderColor]="form.repeatPassword().touched() && form.repeatPassword().invalid() ? palette().danger : palette().borderStrong"
                [style.backgroundColor]="palette().surface"
              />
            </view>
            <text testID="repeat-password-error" [style]="ts('caption')" [style.color]="palette().danger">{{ form.repeatPassword().touched() && form.repeatPassword().invalid() ? t(form.repeatPassword().errors()[0]?.kind ?? '') : '' }}</text>

            <text testID="failure" accessibilityRole="alert" [style]="ts('caption')" [style.color]="palette().danger">{{ failureText() }}</text>

            <pressable
              accessibilityRole="button"
              [disabled]="store.isLoading()"
              [style.height]="size.buttonHeight"
              [style.borderRadius]="radius.md"
              [style.backgroundColor]="palette().accent"
              [style.alignItems]="'center'"
              [style.justifyContent]="'center'"
              (press)="onSubmit()"
            >
              <text [style]="ts('button')" [style.color]="palette().onAccent">{{ t('login.register.submit') }}</text>
            </pressable>
          </view>
        }

        <pressable accessibilityRole="link" [style.padding]="space[2]" (press)="openSignIn()">
          <text [style]="ts('bodyStrong')" [style.color]="palette().accent">{{ t('login.register.goToSignIn') }}</text>
        </pressable>
      </view>
    </safe-area-view>
  `,
  styles: `
    :host {
      flex: 1;
    }
    .screen {
      flex: 1;
    }
    .top-bar {
      flex-direction: row;
      justify-content: flex-end;
      padding: 16px;
    }
    .hero {
      flex: 1;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .tagline {
      text-align: center;
    }
    .content {
      align-items: center;
      padding: 16px;
    }
    .form {
      width: 100%;
      max-width: 360px;
    }
    .field {
      flex-direction: row;
      align-items: center;
    }
    .input {
      flex: 1;
      height: 48px;
      border-width: 1px;
      border-radius: 12px;
      padding-left: 12px;
    }
  `,
})
export class RegisterPage {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  protected readonly store = inject(AuthStore);
  private readonly scheme = inject(ColorScheme);
  protected readonly palette = computed(() => colors[this.scheme.current()]);
  protected readonly logo = { source: logoSource, width: logoSize.width, height: logoSize.height };
  protected readonly tagline = { fontFamily: fontFamilyFor('Caveat', 600), fontSize: 36, lineHeight: 43 };
  protected readonly radius = radius;
  protected readonly size = size;
  protected readonly space = space;
  protected readonly shapes: readonly SkeletonShape[] = ['field', 'field', 'button'];
  protected readonly showPassword = signal(false);

  private readonly credentials = signal({ email: '', password: '', repeatPassword: '' });
  protected readonly form = form(this.credentials, (path) => {
    validate(path.email, ({ value }) => toError(validateSignInEmail(value())));
    validate(path.password, ({ value }) => toError(validateRegisterPassword(value())));
    validate(path.repeatPassword, ({ value, valueOf }) =>
      toError(value() === valueOf(path.password) ? null : 'login.register.errorPasswordMismatch'),
    );
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
        void this.router.navigateByUrl('/');
      }
    });
    effect(() => {
      const failure = this.store.failure();
      if (failure !== null && signInFailures.has(failure)) {
        void this.router.navigateByUrl('/login');
      }
    });
  }

  protected failureText(): string {
    const key = this.failureMessage();
    return key === null ? '' : this.t(key);
  }

  protected t(key: string): string {
    return this.translate.instant(key);
  }

  protected ts(name: keyof typeof typography) {
    return textStyle(name);
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected onSubmit(): void {
    void submit(this.form, async () => {
      const { email, password } = this.credentials();
      this.store.register({ email: normalizeEmail(email), password });
    });
  }

  protected openSignIn(): void {
    void this.router.navigateByUrl('/login');
  }
}
