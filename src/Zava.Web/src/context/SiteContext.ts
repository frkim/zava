import { createContext, useContext } from 'react';
import type { SiteConfig, SiteType } from '../types';
import { getDefaultThemeId } from '../theme';

export interface SiteSelection {
  siteType: SiteType;
  themeId: string;
}

export interface SiteSelectionResult {
  config: SiteConfig;
  /** True when the storefront type changed, which resets the demo data on the server. */
  storeReset: boolean;
}

export interface SiteContextValue {
  config: SiteConfig | null;
  /** Set when the storefront configuration could not be loaded. */
  configError: string | null;
  siteName: string;
  selectedThemeId: string;
  defaultSelection: SiteSelection | null;
  refreshConfig: () => Promise<void>;
  selectSiteType: (selection: SiteSelection, makeDefault: boolean) => Promise<SiteSelectionResult>;
  /** Incremented on every storefront change so components can react */
  siteVersion: number;
}

export const SiteContext = createContext<SiteContextValue>({
  config: null,
  configError: null,
  siteName: 'Zava',
  selectedThemeId: getDefaultThemeId('Electronics'),
  defaultSelection: null,
  refreshConfig: async () => {},
  selectSiteType: async () => { throw new Error('SiteProvider is not available'); },
  siteVersion: 0,
});

export const useSite = () => useContext(SiteContext);
