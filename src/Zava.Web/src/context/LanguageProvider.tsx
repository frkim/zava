import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Lang, TranslationKey } from '../i18n';
import { t as translate } from '../i18n';
import { LanguageContext } from './LanguageContext';

function readSavedLang(): Lang {
  try {
    const saved = localStorage.getItem('zava-lang');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  } catch {
    return 'fr';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readSavedLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('zava-lang', newLang);
    } catch { /* The choice still applies to the current visit. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
