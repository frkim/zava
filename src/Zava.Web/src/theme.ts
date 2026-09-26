import { createTheme, darken, getContrastRatio, type Theme } from '@mui/material/styles';
import type { SiteType } from './types';

/** WCAG AA contrast for body text; every palette text/background pairing is derived to meet it. */
export const MIN_TEXT_CONTRAST = 4.5;

/** Darkens a brand colour until white text on it reaches the requested contrast ratio. */
export function surfaceForWhiteText(color: string, minimum = MIN_TEXT_CONTRAST) {
  let surface = color;
  for (let i = 0; i < 20 && getContrastRatio(surface, '#ffffff') < minimum; i += 1) {
    surface = darken(surface, 0.08);
  }
  return surface;
}

const baseThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':focus-visible': {
          outline: '3px solid #1565c0',
          outlineOffset: 2,
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          minHeight: 40,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 44, minHeight: 44 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
          '&:focus-within': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
};
export interface SiteThemeChoice {
  id: string;
  name: string;
  nameEn: string;
  primary: string;
  secondary: string;
  background: string;
}

export const siteThemeChoices: Record<SiteType, readonly SiteThemeChoice[]> = {
  Electronics: [
    { id: 'midnight-gold', name: 'Minuit doré', nameEn: 'Midnight gold', primary: '#1a1a1a', secondary: '#d4a017', background: '#fafafa' },
    { id: 'ocean-cyan', name: 'Océan cyan', nameEn: 'Cyan ocean', primary: '#006064', secondary: '#00acc1', background: '#f0fbfc' },
    { id: 'royal-blue', name: 'Bleu royal', nameEn: 'Royal blue', primary: '#0d47a1', secondary: '#1976d2', background: '#f2f7ff' },
    { id: 'plum-coral', name: 'Prune corail', nameEn: 'Plum coral', primary: '#6a1b4d', secondary: '#ef6c57', background: '#fff7f8' },
    { id: 'graphite-lime', name: 'Graphite citron', nameEn: 'Graphite lime', primary: '#263238', secondary: '#9eaf18', background: '#f7f9f2' },
    { id: 'indigo-amber', name: 'Indigo ambre', nameEn: 'Indigo amber', primary: '#303f9f', secondary: '#ff8f00', background: '#f6f6ff' },
  ],
  Appliances: [
    { id: 'orange-slate', name: 'Orange ardoise', nameEn: 'Orange slate', primary: '#e65100', secondary: '#455a64', background: '#fff8f0' },
    { id: 'red-charcoal', name: 'Rouge charbon', nameEn: 'Red charcoal', primary: '#c62828', secondary: '#37474f', background: '#fff5f5' },
    { id: 'blue-lemon', name: 'Bleu citron', nameEn: 'Blue lemon', primary: '#1565c0', secondary: '#f9a825', background: '#f4f8ff' },
    { id: 'violet-silver', name: 'Violet argent', nameEn: 'Violet silver', primary: '#6a1b9a', secondary: '#78909c', background: '#fbf5ff' },
    { id: 'teal-copper', name: 'Sarcelle cuivre', nameEn: 'Teal copper', primary: '#00695c', secondary: '#b45f35', background: '#f2faf8' },
    { id: 'navy-rose', name: 'Marine rosé', nameEn: 'Navy rose', primary: '#1a237e', secondary: '#d45d79', background: '#f6f6ff' },
  ],
  Cosmetics: [
    { id: 'black-gold', name: 'Noir précieux', nameEn: 'Precious black', primary: '#212121', secondary: '#c9a84c', background: '#fdf9f3' },
    { id: 'rose-burgundy', name: 'Rose bordeaux', nameEn: 'Rose burgundy', primary: '#8e244d', secondary: '#d98aa3', background: '#fff5f8' },
    { id: 'sage-cream', name: 'Sauge crème', nameEn: 'Sage cream', primary: '#526b58', secondary: '#b58b54', background: '#faf8f0' },
    { id: 'violet-pearl', name: 'Violet nacré', nameEn: 'Pearl violet', primary: '#5e3577', secondary: '#b99acb', background: '#fbf7fd' },
    { id: 'terracotta-sand', name: 'Terracotta sable', nameEn: 'Terracotta sand', primary: '#9b4d3d', secondary: '#d4a373', background: '#fff8f2' },
    { id: 'navy-blush', name: 'Marine poudré', nameEn: 'Navy blush', primary: '#24324a', secondary: '#d994a7', background: '#faf6f8' },
  ],
  Electrical: [
    { id: 'blue-sky', name: 'Bleu électrique', nameEn: 'Electric blue', primary: '#1565c0', secondary: '#42a5f5', background: '#f0f6ff' },
    { id: 'navy-orange', name: 'Marine orange', nameEn: 'Navy orange', primary: '#0d326f', secondary: '#ef6c00', background: '#f5f8fc' },
    { id: 'teal-yellow', name: 'Sarcelle jaune', nameEn: 'Teal yellow', primary: '#00695c', secondary: '#f9a825', background: '#f3faf8' },
    { id: 'charcoal-cyan', name: 'Charbon cyan', nameEn: 'Charcoal cyan', primary: '#263238', secondary: '#00acc1', background: '#f3f7f8' },
    { id: 'indigo-green', name: 'Indigo vert', nameEn: 'Indigo green', primary: '#3949ab', secondary: '#43a047', background: '#f5f7ff' },
    { id: 'red-steel', name: 'Rouge acier', nameEn: 'Red steel', primary: '#b71c1c', secondary: '#607d8b', background: '#fff5f5' },
  ],
  DIY: [
    { id: 'forest-lime', name: 'Forêt citron', nameEn: 'Forest lime', primary: '#2e7d32', secondary: '#8ca817', background: '#f1f8e9' },
    { id: 'orange-navy', name: 'Orange marine', nameEn: 'Orange navy', primary: '#e65100', secondary: '#1a237e', background: '#fff7f0' },
    { id: 'blue-yellow', name: 'Bleu chantier', nameEn: 'Builder blue', primary: '#0d47a1', secondary: '#f9a825', background: '#f2f7ff' },
    { id: 'red-graphite', name: 'Rouge graphite', nameEn: 'Red graphite', primary: '#b71c1c', secondary: '#37474f', background: '#fff4f4' },
    { id: 'teal-sand', name: 'Sarcelle sable', nameEn: 'Teal sand', primary: '#00695c', secondary: '#b58b54', background: '#f4faf7' },
    { id: 'brown-leaf', name: 'Terre feuillage', nameEn: 'Earth leaf', primary: '#6d4c41', secondary: '#558b2f', background: '#faf7f2' },
  ],
  Grocery: [
    { id: 'blue-red', name: 'Bleu rubis', nameEn: 'Ruby blue', primary: '#1565c0', secondary: '#d32f2f', background: '#fafbff' },
    { id: 'red-black', name: 'Rouge ébène', nameEn: 'Ebony red', primary: '#c62828', secondary: '#212121', background: '#fff7f7' },
    { id: 'blue-orange', name: 'Bleu mandarine', nameEn: 'Tangerine blue', primary: '#0d47a1', secondary: '#ef6c00', background: '#f5f8ff' },
    { id: 'green-yellow', name: 'Vert soleil', nameEn: 'Sunny green', primary: '#2e7d32', secondary: '#f9a825', background: '#f5faef' },
    { id: 'burgundy-cream', name: 'Bordeaux crème', nameEn: 'Burgundy cream', primary: '#7f1734', secondary: '#c89b3c', background: '#fffaf2' },
    { id: 'teal-coral', name: 'Sarcelle corail', nameEn: 'Teal coral', primary: '#00695c', secondary: '#e05d4f', background: '#f3faf8' },
  ],
  Clothing: [
    { id: 'navy-camel', name: 'Marine camel', nameEn: 'Navy camel', primary: '#1f2a44', secondary: '#c08a4b', background: '#faf8f4' },
    { id: 'denim-rose', name: 'Denim rose', nameEn: 'Denim rose', primary: '#31517a', secondary: '#d98aa3', background: '#f7f9fd' },
    { id: 'black-ecru', name: 'Noir écru', nameEn: 'Black ecru', primary: '#1c1c1c', secondary: '#b09a7d', background: '#fbf9f6' },
    { id: 'plum-gold', name: 'Prune doré', nameEn: 'Plum gold', primary: '#5e2750', secondary: '#c9a84c', background: '#fdf7fb' },
    { id: 'olive-sand', name: 'Olive sable', nameEn: 'Olive sand', primary: '#4f5b3a', secondary: '#c2a878', background: '#f8f9f3' },
    { id: 'bordeaux-blush', name: 'Bordeaux poudré', nameEn: 'Bordeaux blush', primary: '#7b263c', secondary: '#e0a9a9', background: '#fff6f6' },
  ],
  Sports: [
    { id: 'blue-lime', name: 'Bleu citron', nameEn: 'Lime blue', primary: '#0a4f8f', secondary: '#7cb518', background: '#f3f8fd' },
    { id: 'navy-orange', name: 'Marine orange', nameEn: 'Navy orange', primary: '#12284c', secondary: '#f26522', background: '#f5f7fb' },
    { id: 'green-graphite', name: 'Vert graphite', nameEn: 'Graphite green', primary: '#1b7a43', secondary: '#37474f', background: '#f3faf5' },
    { id: 'cyan-magenta', name: 'Cyan magenta', nameEn: 'Cyan magenta', primary: '#00727f', secondary: '#c2185b', background: '#f1fafb' },
    { id: 'red-steel', name: 'Rouge acier', nameEn: 'Red steel', primary: '#c62828', secondary: '#546e7a', background: '#fff5f5' },
    { id: 'violet-lime', name: 'Violet citron', nameEn: 'Violet lime', primary: '#4527a0', secondary: '#9ccc65', background: '#f7f5ff' },
  ],
};

const themes = Object.fromEntries(
  Object.entries(siteThemeChoices).flatMap(([siteType, choices]) =>
    choices.map((choice) => [
      `${siteType}:${choice.id}`,
      createTheme({
        ...baseThemeOptions,
        palette: {
          // contrastThreshold 4.5 makes MUI choose white or dark text per colour at AA level.
          contrastThreshold: MIN_TEXT_CONTRAST,
          primary: { main: choice.primary },
          secondary: { main: choice.secondary },
          background: { default: choice.background },
        },
      }),
    ]),
  ),
) as Record<string, Theme>;

export function getDefaultThemeId(siteType: SiteType) {
  return siteThemeChoices[siteType][0].id;
}

export function isThemeIdForSite(siteType: SiteType, themeId: string) {
  return siteThemeChoices[siteType].some(({ id }) => id === themeId);
}

export function getSiteTheme(siteType: SiteType, themeId: string) {
  return themes[`${siteType}:${themeId}`] ?? themes[`${siteType}:${getDefaultThemeId(siteType)}`];
}

const theme = getSiteTheme('Electronics', getDefaultThemeId('Electronics'));
export default theme;
