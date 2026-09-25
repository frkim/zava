// Settings and information pages translations. Merged into i18n.ts; keys must stay unique across modules.
const settingsInfo = {
  'si.settings.subtitle': {
    fr: 'Personnalisez l’apparence sans perdre vos données ; seul un changement de boutique réinitialise la démo.',
    en: 'Personalise the look without losing data; only changing the store type resets the demo.',
  },
  'si.settings.loading': { fr: 'Chargement des paramètres…', en: 'Loading settings…' },
  'si.settings.storeTypeLegend': { fr: 'Choisir un type de boutique', en: 'Choose a store type' },
  'si.settings.themeHelp': {
    fr: 'Changer uniquement le thème conserve le panier, les commandes et le profil.',
    en: 'Changing only the theme keeps the cart, orders and profile.',
  },
  'si.settings.themeOnlyNotice': {
    fr: 'Cette modification conserve le panier et les commandes.',
    en: 'This change keeps the cart and orders.',
  },
  'si.settings.storeResetWarning': {
    fr: 'Attention : changer de type de boutique réinitialise le panier, les commandes et le profil de démonstration.',
    en: 'Warning: changing the store type resets the demo cart, orders and profile.',
  },
  'si.settings.apply': { fr: 'Appliquer', en: 'Apply' },
  'si.settings.confirmStoreResetTitle': { fr: 'Changer de boutique ?', en: 'Change store type?' },
  'si.settings.confirmStoreResetBody': {
    fr: 'Cette action charge un autre catalogue et réinitialise le panier, les commandes et le profil de démonstration.',
    en: 'This loads another catalogue and resets the demo cart, orders and profile.',
  },
  'si.settings.confirmStoreResetAction': { fr: 'Changer et réinitialiser', en: 'Change and reset' },
  'si.settings.themeApplied': {
    fr: 'Thème appliqué — panier et commandes conservés',
    en: 'Theme applied — cart and orders kept',
  },
  'si.settings.storeChanged': {
    fr: 'Boutique changée — données de démonstration réinitialisées',
    en: 'Store changed — demo data reset',
  },
  'si.info.premiumDemoNote': {
    fr: 'Offre illustrative — abonnement non disponible dans la démo.',
    en: 'Illustrative offer — subscription is not available in the demo.',
  },
} as const satisfies Record<string, { fr: string; en: string }>;

export default settingsInfo;
