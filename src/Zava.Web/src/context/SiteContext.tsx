import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getConfig } from '../api';
import type { SiteConfig } from '../types';
import { useLanguage } from './LanguageContext';

interface SiteContextValue {
  config: SiteConfig | null;
  siteName: string;
  refreshConfig: () => Promise<void>;
  /** Incremented on every site change so components can react */
  siteVersion: number;
}

const SiteContext = createContext<SiteContextValue>({
  config: null,
  siteName: 'Zava',
  refreshConfig: async () => {},
  siteVersion: 0,
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [siteVersion, setSiteVersion] = useState(0);
  const { lang } = useLanguage();

  const refreshConfig = useCallback(async () => {
    try {
      const c = await getConfig();
      setConfig(c);
      setSiteVersion((v) => v + 1);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const siteInfo = config
    ? config.availableSiteTypes.find((s) => s.type === config.currentSiteType)
    : null;
  const siteName = siteInfo
    ? (lang === 'en' && siteInfo.nameEn ? siteInfo.nameEn : siteInfo.name)
    : 'Zava';

  return (
    <SiteContext.Provider value={{ config, siteName, refreshConfig, siteVersion }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
