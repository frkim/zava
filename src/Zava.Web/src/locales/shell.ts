// Header, navigation, footer translations. Merged into i18n.ts; keys must stay unique across modules.
const shell = {
  'shell.searchLabel': { fr: 'Rechercher dans le catalogue', en: 'Search the catalogue' },
  'shell.searchSubmit': { fr: 'Lancer la recherche', en: 'Submit search' },
  'shell.suggestionsLabel': { fr: 'Suggestions de recherche', en: 'Search suggestions' },
  'shell.profileLabel': { fr: 'Ouvrir mon profil', en: 'Open my profile' },
  'shell.primaryNavLabel': { fr: 'Navigation principale', en: 'Primary navigation' },
  'shell.drawerNavLabel': { fr: 'Menu de navigation', en: 'Navigation menu' },
  'shell.buyGroup': { fr: 'Acheter', en: 'Shop' },
  'shell.demoToolsGroup': { fr: 'Outils de démonstration', en: 'Demo tools' },
  'shell.languageGroup': { fr: 'Langue', en: 'Language' },
  'shell.footerNavLabel': { fr: 'Services Zava', en: 'Zava services' },
  'shell.legalNavLabel': { fr: 'Liens légaux', en: 'Legal links' },
} as const satisfies Record<string, { fr: string; en: string }>;

export default shell;
