import { createContext, useContext, useMemo } from 'react';
import type { Lang, TranslationKey } from '../i18n';
import { t as translate } from '../i18n';
import { formatDate, formatPrice } from '../format';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => translate(key, 'fr'),
});

export const useLanguage = () => useContext(LanguageContext);

/** Locale-aware formatters bound to the active interface language. */
export function useFormatters() {
  const { lang } = useLanguage();
  return useMemo(() => ({
    price: (amount: number) => formatPrice(amount, lang),
    date: (value: string | Date, options?: Intl.DateTimeFormatOptions) => formatDate(value, lang, options),
  }), [lang]);
}
