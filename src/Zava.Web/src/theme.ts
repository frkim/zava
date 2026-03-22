import { createTheme, type Theme } from '@mui/material/styles';
import type { SiteType } from './types';

const baseThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
};

// Electronics & Books — Black and Gold
const electronicsTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#1a1a1a', light: '#424242', dark: '#000000' },
    secondary: { main: '#d4a017', light: '#f0c040', dark: '#a67c00' },
    background: { default: '#fafafa' },
  },
});

// Appliances — Orange
const appliancesTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#e65100', light: '#ff833a', dark: '#ac1900' },
    secondary: { main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
    background: { default: '#fff8f0' },
  },
});

// Beauty & Fragrances — Black and Gold
const cosmeticsTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#212121', light: '#484848', dark: '#000000' },
    secondary: { main: '#c9a84c', light: '#e0c068', dark: '#9e7b2a' },
    background: { default: '#fdf9f3' },
  },
});

// Electrical Equipment — Blue
const electricalTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#1565c0', light: '#5e92f3', dark: '#003c8f' },
    secondary: { main: '#42a5f5', light: '#80d6ff', dark: '#0077c2' },
    background: { default: '#f0f6ff' },
  },
});

// DIY — Green
const diyTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#2e7d32', light: '#60ad5e', dark: '#005005' },
    secondary: { main: '#66bb6a', light: '#98ee99', dark: '#338a3e' },
    background: { default: '#f1f8e9' },
  },
});

// Grocery — Blue & Red
const groceryTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    primary: { main: '#1565c0', light: '#5e92f3', dark: '#003c8f' },
    secondary: { main: '#d32f2f', light: '#ff6659', dark: '#9a0007' },
    background: { default: '#fafbff' },
  },
});

export const siteThemes: Record<SiteType, Theme> = {
  Electronics: electronicsTheme,
  Appliances: appliancesTheme,
  Cosmetics: cosmeticsTheme,
  Electrical: electricalTheme,
  DIY: diyTheme,
  Grocery: groceryTheme,
};

// Default fallback theme
const theme = electronicsTheme;
export default theme;
