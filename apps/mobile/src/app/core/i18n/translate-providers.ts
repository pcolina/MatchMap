import { DefaultMissingTranslationHandler, provideTranslateService, TranslateDefaultParser, TranslateNoOpCompiler, TranslateNoOpLoader, TranslateService } from '@ngx-translate/core';
import en from '../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../packages/shared/i18n/es.json';
import { resolveLanguage } from './language.ts';

export const translateProviders = () =>
  provideTranslateService({
    fallbackLang: 'en',
    loader: () => new TranslateNoOpLoader(),
    compiler: () => new TranslateNoOpCompiler(),
    parser: () => new TranslateDefaultParser(),
    missingTranslationHandler: () => new DefaultMissingTranslationHandler(),
  });

export const initializeTranslations = (translate: TranslateService, deviceLocale: string | undefined): void => {
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use(resolveLanguage(deviceLocale));
};
