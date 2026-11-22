import '@angular/compiler';
import { Component, inject, runInInjectionContext } from '@angular/core';
import { View } from '@ng-native/components';
import { render } from '@ng-native/testing';
import { TranslateService } from '@ngx-translate/core';
import { initializeTranslations, translateProviders } from './translate-providers.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

@Component({
  selector: 'app-translate-host',
  imports: [View],
  template: '<view />',
})
class TranslateHost {}

const originalToString = Function.prototype.toString;

describe('translation providers on Hermes bytecode', () => {
  beforeEach(() => {
    Function.prototype.toString = function (this: unknown) {
      const text = originalToString.call(this);
      return text.startsWith('class') ? `function ${(this as { name: string }).name}() { [bytecode] }` : text;
    };
  });

  afterEach(() => {
    Function.prototype.toString = originalToString;
  });

  it('injects TranslateService without an error', async () => {
    const { componentRef } = await render(TranslateHost, {
      providers: [translateProviders()],
    });

    expect(() => runInInjectionContext(componentRef.injector, () => inject(TranslateService))).not.toThrow();
  });

  it('selects es for a Spanish device', async () => {
    const { componentRef } = await render(TranslateHost, { providers: [translateProviders()] });
    const translate = runInInjectionContext(componentRef.injector, () => inject(TranslateService));

    initializeTranslations(translate, 'es-ES');

    expect(translate.currentLang()).toBe('es');
  });

  it('selects en for a device language that is not supported', async () => {
    const { componentRef } = await render(TranslateHost, { providers: [translateProviders()] });
    const translate = runInInjectionContext(componentRef.injector, () => inject(TranslateService));

    initializeTranslations(translate, 'fr-FR');

    expect(translate.currentLang()).toBe('en');
  });
});
