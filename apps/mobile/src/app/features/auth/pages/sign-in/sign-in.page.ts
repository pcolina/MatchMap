import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, form, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-native/icons';
import { validateSignInEmail, validateSignInPassword } from '@matchmap/shared';
import { TranslateService } from '@ngx-translate/core';
import { Image, Pressable, SafeAreaView, Text, TextInput, View } from '@ng-native/components';
import { ColorScheme } from '@ng-native/device';
import { logoSize, logoSource } from '../../../../core/brand/logo.ts';
import { fontFamilyFor, textStyle } from '../../../../core/fonts/fonts.ts';
import { colors, radius, size, space, typography } from '../../../../core/theme/tokens.ts';
import { SkeletonComponent, type SkeletonShape } from '../../../../shared/skeleton/skeleton.ts';
import { LanguageSwitcherComponent } from '../../ui/language-switcher/language-switcher.ts';
import { AuthStore } from '../../state/auth.store.ts';

const toError = (key: string | null) => (key === null ? undefined : { kind: key });

@Component({
  selector: 'app-sign-in-page',
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
            <text [style]="ts('label')" [style.color]="palette().text">{{ t('login.signIn.emailLabel') }}</text>
            <view class="field">
              <ng-icon name="tablerUser" [color]="palette().textSecondary" />
              <text-input
                class="input"
                [accessibilityLabel]="t('login.signIn.emailLabel')"
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

            <text [style]="ts('label')" [style.color]="palette().text">{{ t('login.signIn.passwordLabel') }}</text>
            <view class="field">
              <ng-icon name="tablerLock" [color]="palette().textSecondary" />
              <text-input
                class="input"
                [accessibilityLabel]="t('login.signIn.passwordLabel')"
                [secureTextEntry]="!showPassword()"
                autoCapitalize="none"
                autoComplete="current-password"
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
              <text [style]="ts('button')" [style.color]="palette().onAccent">{{ t('login.signIn.submit') }}</text>
            </pressable>
          </view>

          <view class="divider" [style.borderTopColor]="palette().border">
            <text class="divider-label" [style]="ts('label')" aria-hidden="true" [style.color]="palette().textSecondary" [style.backgroundColor]="palette().bg">{{ t('login.signIn.or') }}</text>
          </view>

          <view class="social">
            @for (name of socialNames; track name) {
              <pressable
                accessibilityRole="button"
                [accessibilityLabel]="name"
                [accessibilityHint]="t('login.signIn.googleComingSoon')"
                [accessibilityState]="{ disabled: true }"
                [disabled]="true"
                [style.width]="size.touchTargetMin"
                [style.height]="size.touchTargetMin"
                [style.borderRadius]="radius.pill"
                [style.borderWidth]="1"
                [style.borderColor]="palette().border"
                [style.backgroundColor]="palette().surface"
                [style.alignItems]="'center'"
                [style.justifyContent]="'center'"
              >
                <text [style.color]="palette().textSecondary">{{ name.charAt(0) }}</text>
              </pressable>
            }
          </view>
        }

        <pressable accessibilityRole="link" [style.padding]="space[2]" (press)="openRegister()">
          <text [style]="ts('bodyStrong')" [style.color]="palette().accent">{{ t('login.signIn.goToRegister') }}</text>
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
    .divider {
      width: 100%;
      max-width: 360px;
      margin-top: 12px;
      border-top-width: 1px;
      align-items: center;
    }
    .divider-label {
      margin-top: -10px;
      padding: 0 12px;
    }
    .social {
      flex-direction: row;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }
  `,
})
export class SignInPage {
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
  protected readonly socialNames = ['Google', 'Facebook', 'Apple'];
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
      this.store.signIn(this.credentials());
    });
  }

  protected openRegister(): void {
    void this.router.navigateByUrl('/register');
  }
}
