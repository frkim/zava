import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { changeSiteType, getConfig } from '../api';
import type { SiteConfig, SiteType } from '../types';
import { useLanguage } from './LanguageContext';

const LAST_SITE_TYPE_KEY = 'zava-last-site-type';

interface SiteContextValue {
  config: SiteConfig | null;
  siteName: string;
  refreshConfig: () => Promise<void>;
  selectSiteType: (siteType: SiteType) => Promise<SiteConfig>;
  /** Incremented on every site change so components can react */
  siteVersion: number;
}

const SiteContext = createContext<SiteContextValue>({
  config: null,
  siteName: 'Zava',
  refreshConfig: async () => {},
  selectSiteType: async () => { throw new Error('SiteProvider is not available'); },
  siteVersion: 0,
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [siteVersion, setSiteVersion] = useState(0);
  const initializationStarted = useRef(false);
  const { lang } = useLanguage();

  const refreshConfig = useCallback(async () => {
    try {
      const c = await getConfig();
      setConfig(c);
      setSiteVersion((v) => v + 1);
    } catch (error) {
      console.error('Unable to refresh the storefront configuration.', error);
    }
  }, []);

  const selectSiteType = useCallback(async (siteType: SiteType) => {
    const updated = await changeSiteType(siteType);
    setConfig(updated);
    setSiteVersion((v) => v + 1);
    try {
      window.localStorage.setItem(LAST_SITE_TYPE_KEY, siteType);
    } catch (error) {
      console.warn('Unable to remember the selected storefront.', error);
    }
    return updated;
  }, []);

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;

    const initialize = async () => {
      try {
        const current = await getConfig();
        let restored = current;
        let savedSiteType: string | null = null;
        try {
          savedSiteType = window.localStorage.getItem(LAST_SITE_TYPE_KEY);
        } catch (error) {
          console.warn('Unable to read the previously selected storefront.', error);
        }

        const savedSite = current.availableSiteTypes.find(({ type }) => type === savedSiteType);
        if (savedSite && savedSite.type !== current.currentSiteType) {
          try {
            restored = await changeSiteType(savedSite.type);
          } catch (error) {
            console.error('Unable to restore the previously selected storefront.', error);
          }
        }

        setConfig(restored);
        setSiteVersion((v) => v + 1);
      } catch (error) {
        console.error('Unable to initialize the storefront configuration.', error);
      }
    };

    void initialize();
  }, []);

  const siteInfo = config
    ? config.availableSiteTypes.find((s) => s.type === config.currentSiteType)
    : null;
  const siteName = siteInfo
    ? (lang === 'en' && siteInfo.nameEn ? siteInfo.nameEn : siteInfo.name)
    : 'Zava';

  return (
    <SiteContext.Provider value={{ config, siteName, refreshConfig, selectSiteType, siteVersion }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
