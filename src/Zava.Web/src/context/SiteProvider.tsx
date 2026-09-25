import { useState, useEffect, useCallback, useRef } from 'react';
import { changeSiteType, getConfig } from '../api';
import type { SiteConfig } from '../types';
import { getDefaultThemeId, isThemeIdForSite } from '../theme';
import { useLanguage } from './LanguageContext';
import { SiteContext, type SiteSelection } from './SiteContext';

const DEFAULT_SITE_KEY = 'zava-default-site';

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState(getDefaultThemeId('Electronics'));
  const [defaultSelection, setDefaultSelection] = useState<SiteSelection | null>(null);
  const [siteVersion, setSiteVersion] = useState(0);
  const initializationStarted = useRef(false);
  const { lang } = useLanguage();

  const refreshConfig = useCallback(async () => {
    try {
      const c = await getConfig();
      setConfig(c);
      setConfigError(null);
      setSiteVersion((v) => v + 1);
    } catch (error) {
      console.error('Unable to refresh the storefront configuration.', error);
      setConfigError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  const selectSiteType = useCallback(async (selection: SiteSelection, makeDefault: boolean) => {
    if (!isThemeIdForSite(selection.siteType, selection.themeId)) {
      throw new Error('The selected theme is not available for this storefront.');
    }

    // Only a real storefront change goes to the server: it rebuilds the catalogue and resets
    // cart, orders and profile. A theme or default-preference change stays local.
    const storeReset = !config || config.currentSiteType !== selection.siteType;
    const updated = storeReset ? await changeSiteType(selection.siteType) : config;
    if (storeReset) {
      setConfig(updated);
      setSiteVersion((v) => v + 1);
    }
    setSelectedThemeId(selection.themeId);

    try {
      if (makeDefault) {
        window.localStorage.setItem(DEFAULT_SITE_KEY, JSON.stringify(selection));
        setDefaultSelection(selection);
      } else if (
        defaultSelection?.siteType === selection.siteType
        && defaultSelection.themeId === selection.themeId
      ) {
        window.localStorage.removeItem(DEFAULT_SITE_KEY);
        setDefaultSelection(null);
      }
    } catch (error) {
      console.warn('Unable to update the default storefront.', error);
    }

    return { config: updated, storeReset };
  }, [config, defaultSelection]);

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;

    const initialize = async () => {
      try {
        const current = await getConfig();
        let restored = current;
        let selection: SiteSelection | null = null;
        let savedSelection: SiteSelection | null = null;

        try {
          const saved = window.localStorage.getItem(DEFAULT_SITE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<SiteSelection>;
            const savedSite = current.availableSiteTypes.find(({ type }) => type === parsed.siteType);
            if (savedSite && parsed.themeId && isThemeIdForSite(savedSite.type, parsed.themeId)) {
              savedSelection = { siteType: savedSite.type, themeId: parsed.themeId };
            }
          }
        } catch (error) {
          console.warn('Unable to read the default storefront.', error);
        }

        const params = new URLSearchParams(window.location.search);
        const requestedType = params.get('site');
        const requestedSite = current.availableSiteTypes.find(({ type }) => type === requestedType);
        const requestedTheme = params.get('theme');
        if (requestedSite) {
          selection = {
            siteType: requestedSite.type,
            themeId: requestedTheme && isThemeIdForSite(requestedSite.type, requestedTheme)
              ? requestedTheme
              : getDefaultThemeId(requestedSite.type),
          };
        } else {
          selection = savedSelection;
        }

        if (selection && selection.siteType !== current.currentSiteType) {
          try {
            restored = await changeSiteType(selection.siteType);
          } catch (error) {
            console.error('Unable to restore the selected storefront.', error);
          }
        }

        if (selection) {
          setSelectedThemeId(selection.themeId);
          if (!requestedSite && window.location.pathname === '/') {
            const destination = new URL(window.location.href);
            destination.search = '';
            destination.searchParams.set('site', selection.siteType);
            destination.searchParams.set('theme', selection.themeId);
            window.history.replaceState(null, '', destination);
          }
        } else {
          setSelectedThemeId(getDefaultThemeId(restored.currentSiteType));
        }

        setDefaultSelection(savedSelection);
        setConfig(restored);
        setConfigError(null);
        setSiteVersion((v) => v + 1);
      } catch (error) {
        console.error('Unable to initialize the storefront configuration.', error);
        setConfigError(error instanceof Error ? error.message : String(error));
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
    <SiteContext.Provider value={{
      config,
      configError,
      siteName,
      selectedThemeId,
      defaultSelection,
      refreshConfig,
      selectSiteType,
      siteVersion,
    }}>
      {children}
    </SiteContext.Provider>
  );
}
