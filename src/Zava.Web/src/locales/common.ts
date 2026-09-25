// Shared translations used by cross-cutting components (page states, feedback, 404).
const common = {
  'common.retry': { fr: 'Réessayer', en: 'Try again' },
  'common.errorTitle': { fr: 'Ce contenu n’a pas pu être chargé', en: 'This content could not be loaded' },
  'common.errorHint': { fr: 'Vérifiez votre connexion ou réessayez dans un instant. Rien n’a été modifié.', en: 'Check your connection or try again in a moment. Nothing was changed.' },
  'common.skipToContent': { fr: 'Aller au contenu principal', en: 'Skip to main content' },
  'common.viewCart': { fr: 'Voir le panier', en: 'View cart' },
  'common.adding': { fr: 'Ajout…', en: 'Adding…' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.close': { fr: 'Fermer', en: 'Close' },
  'common.demoData': { fr: 'Données fictives de démonstration', en: 'Fictitious demo data' },
  'feedback.addedToCart': { fr: 'ajouté au panier', en: 'added to your cart' },
  'feedback.addToCartFailed': { fr: 'Le produit n’a pas été ajouté au panier', en: 'The product was not added to your cart' },
  'notFound.title': { fr: 'Page introuvable', en: 'Page not found' },
  'notFound.desc': { fr: 'Cette adresse ne correspond à aucune page de la boutique. Elle a peut-être été déplacée ou mal saisie.', en: 'This address does not match any page of the store. It may have moved or been mistyped.' },
  'notFound.home': { fr: 'Retour à l’accueil', en: 'Back to home' },
  'notFound.catalog': { fr: 'Parcourir le catalogue', en: 'Browse the catalogue' },
} as const satisfies Record<string, { fr: string; en: string }>;

export default common;
