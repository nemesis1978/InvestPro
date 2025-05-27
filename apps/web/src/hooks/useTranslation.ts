import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKey } from '../lib/i18n/translations';

export const useTranslation = () => {
  const { t, language } = useLanguage();
  
  return {
    t,
    language,
  };
};