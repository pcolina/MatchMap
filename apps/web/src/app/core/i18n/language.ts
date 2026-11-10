import { TranslateService } from '@ngx-translate/core';
import en from '../../../../../../packages/shared/i18n/en.json';
import es from '../../../../../../packages/shared/i18n/es.json';

export type Language = 'en' | 'es';

export const resolveLanguage = (browserLanguage: string | undefined): Language =>
  browserLanguage?.toLowerCase().split('-')[0] === 'es' ? 'es' : 'en';

export const setupTranslations = (translate: TranslateService, browserLanguage: string | undefined): void => {
  translate.setTranslation('en', en);
  translate.setTranslation('es', es);
  translate.use(resolveLanguage(browserLanguage));
};
