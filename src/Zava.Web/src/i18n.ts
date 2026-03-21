export type Lang = 'fr' | 'en';

const translations = {
  // ─── Navigation ────────────────────────────────────────────────────────────
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.categories': { fr: 'Catégories', en: 'Categories' },
  'nav.allProducts': { fr: 'Tous les produits', en: 'All products' },
  'nav.profile': { fr: 'Mon profil', en: 'My profile' },
  'nav.analytics': { fr: 'Analytics', en: 'Analytics' },
  'nav.settings': { fr: 'Paramètres', en: 'Settings' },
  'nav.menu': { fr: 'Menu', en: 'Menu' },

  // ─── Search ────────────────────────────────────────────────────────────────
  'search.placeholder': { fr: 'Rechercher un produit...', en: 'Search for a product...' },
  'search.resultsFor': { fr: 'Résultats pour', en: 'Results for' },
  'search.allProducts': { fr: 'Tous les produits', en: 'All products' },
  'search.results': { fr: 'résultats', en: 'results' },
  'search.filters': { fr: 'Filtres', en: 'Filters' },
  'search.sortBy': { fr: 'Trier par', en: 'Sort by' },
  'search.relevance': { fr: 'Pertinence', en: 'Relevance' },
  'search.priceAsc': { fr: 'Prix croissant', en: 'Price: low to high' },
  'search.bestRated': { fr: 'Meilleures notes', en: 'Best rated' },
  'search.newest': { fr: 'Nouveautés', en: 'Newest' },
  'search.nameAZ': { fr: 'Nom A-Z', en: 'Name A-Z' },
  'search.inStockOnly': { fr: 'En stock uniquement', en: 'In stock only' },
  'search.noResults': { fr: 'Aucun produit trouvé', en: 'No products found' },

  // ─── Product ───────────────────────────────────────────────────────────────
  'product.new': { fr: 'Nouveau', en: 'New' },
  'product.bestSeller': { fr: 'Best-seller', en: 'Best seller' },
  'product.outOfStock': { fr: 'Rupture de stock', en: 'Out of stock' },
  'product.addToCart': { fr: 'Ajouter au panier', en: 'Add to cart' },
  'product.back': { fr: 'Retour', en: 'Back' },
  'product.variant': { fr: 'Variante', en: 'Variant' },
  'product.inStock': { fr: 'En stock', en: 'In stock' },
  'product.available': { fr: 'disponibles', en: 'available' },
  'product.reviews': { fr: 'avis', en: 'reviews' },
  'product.customerReviews': { fr: 'Avis clients', en: 'Customer reviews' },
  'product.basedOn': { fr: 'Basé sur', en: 'Based on' },
  'product.reviewsCount': { fr: 'avis', en: 'reviews' },
  'product.verifiedPurchase': { fr: 'Achat vérifié', en: 'Verified purchase' },
  'product.helpfulCount': { fr: 'personnes ont trouvé cet avis utile', en: 'people found this review helpful' },
  'product.relatedProducts': { fr: 'Produits similaires', en: 'Related products' },
  'product.viewMoreReviews': { fr: 'Voir plus d\'avis', en: 'View more reviews' },
  'product.addedToCart': { fr: 'Produit ajouté au panier', en: 'Product added to cart' },
  'product.addError': { fr: "Erreur lors de l'ajout", en: 'Error adding to cart' },
  'product.notFound': { fr: 'Produit introuvable', en: 'Product not found' },
  'product.photos': { fr: 'Photos', en: 'Photos' },
  'product.close': { fr: 'Fermer', en: 'Close' },
  'product.previousImage': { fr: 'Image précédente', en: 'Previous image' },
  'product.nextImage': { fr: 'Image suivante', en: 'Next image' },

  // ─── Home ──────────────────────────────────────────────────────────────────
  'home.welcome': { fr: 'Bienvenue sur Zava', en: 'Welcome to Zava' },
  'home.intro': {
    fr: 'Découvrez nos sélections, meilleures ventes et nouveautés. Profitez de la livraison offerte et de nos prix garantis.',
    en: 'Discover our selections, best sellers and new arrivals. Enjoy free delivery and our guaranteed prices.',
  },
  'home.topCategories': { fr: 'Top Catégories', en: 'Top Categories' },
  'home.selection': { fr: '⭐ Sélection pour vous', en: '⭐ Selected for you' },
  'home.bestSellers': { fr: '🏆 Meilleures ventes', en: '🏆 Best sellers' },
  'home.newArrivals': { fr: '🆕 Nouveautés', en: '🆕 New arrivals' },
  'home.promotions': { fr: '🔥 Promotions', en: '🔥 Deals' },
  'home.featured': { fr: '💎 Produits en avant', en: '💎 Featured products' },
  'home.brands': { fr: 'Nos Marques', en: 'Our Brands' },
  'home.premium': { fr: '⭐ Abonnement Premium', en: '⭐ Premium Subscription' },
  'home.premiumDesc': {
    fr: 'Livraison express gratuite, accès aux ventes privées, retours étendus à 30 jours, et bien plus encore.',
    en: 'Free express delivery, access to private sales, 30-day extended returns, and much more.',
  },

  // ─── Cart ──────────────────────────────────────────────────────────────────
  'cart.title': { fr: 'Mon panier', en: 'My cart' },
  'cart.empty': { fr: 'Votre panier est vide', en: 'Your cart is empty' },
  'cart.emptyDesc': { fr: 'Parcourez notre catalogue et ajoutez des produits', en: 'Browse our catalogue and add products' },
  'cart.continueShopping': { fr: 'Continuer mes achats', en: 'Continue shopping' },
  'cart.article': { fr: 'article', en: 'item' },
  'cart.articles': { fr: 'articles', en: 'items' },
  'cart.product': { fr: 'Produit', en: 'Product' },
  'cart.unitPrice': { fr: 'Prix unitaire', en: 'Unit price' },
  'cart.quantity': { fr: 'Quantité', en: 'Quantity' },
  'cart.subtotal': { fr: 'Sous-total', en: 'Subtotal' },
  'cart.orderSummary': { fr: 'Résumé de la commande', en: 'Order summary' },
  'cart.delivery': { fr: 'Livraison', en: 'Delivery' },
  'cart.free': { fr: 'Gratuite', en: 'Free' },
  'cart.total': { fr: 'Total', en: 'Total' },
  'cart.checkout': { fr: 'Passer la commande', en: 'Proceed to checkout' },
  'cart.clear': { fr: 'Vider le panier', en: 'Clear cart' },

  // ─── Checkout ──────────────────────────────────────────────────────────────
  'checkout.title': { fr: 'Commande', en: 'Checkout' },
  'checkout.shipping': { fr: 'Livraison', en: 'Shipping' },
  'checkout.payment': { fr: 'Paiement', en: 'Payment' },
  'checkout.confirmation': { fr: 'Confirmation', en: 'Confirmation' },
  'checkout.shippingAddress': { fr: 'Adresse de livraison', en: 'Shipping address' },
  'checkout.street': { fr: 'Rue', en: 'Street' },
  'checkout.city': { fr: 'Ville', en: 'City' },
  'checkout.postalCode': { fr: 'Code postal', en: 'Postal code' },
  'checkout.country': { fr: 'Pays', en: 'Country' },
  'checkout.backToCart': { fr: 'Retour au panier', en: 'Back to cart' },
  'checkout.continue': { fr: 'Continuer', en: 'Continue' },
  'checkout.paymentMethod': { fr: 'Moyen de paiement', en: 'Payment method' },
  'checkout.creditCard': { fr: '💳 Carte bancaire', en: '💳 Credit card' },
  'checkout.cardNumber': { fr: 'Numéro de carte', en: 'Card number' },
  'checkout.cardNumberHint': { fr: 'Terminez par 0000 pour simuler un échec de paiement', en: 'End with 0000 to simulate a payment failure' },
  'checkout.cardHolder': { fr: 'Titulaire', en: 'Cardholder' },
  'checkout.cardExpiry': { fr: 'Expiration', en: 'Expiry' },
  'checkout.totalToPay': { fr: 'Total à payer', en: 'Total to pay' },
  'checkout.back': { fr: 'Retour', en: 'Back' },
  'checkout.pay': { fr: 'Payer', en: 'Pay' },
  'checkout.processing': { fr: 'Traitement...', en: 'Processing...' },
  'checkout.confirmed': { fr: 'Commande confirmée !', en: 'Order confirmed!' },
  'checkout.orderNumber': { fr: 'Numéro de commande', en: 'Order number' },
  'checkout.transaction': { fr: 'Transaction', en: 'Transaction' },
  'checkout.viewOrders': { fr: 'Voir mes commandes', en: 'View my orders' },
  'checkout.backToHome': { fr: "Retour à l'accueil", en: 'Back to home' },
  'checkout.paymentFailed': { fr: 'Paiement échoué', en: 'Payment failed' },
  'checkout.retry': { fr: 'Réessayer', en: 'Retry' },

  // ─── Profile ───────────────────────────────────────────────────────────────
  'profile.title': { fr: 'Mon profil', en: 'My profile' },
  'profile.personalInfo': { fr: 'Informations personnelles', en: 'Personal information' },
  'profile.firstName': { fr: 'Prénom', en: 'First name' },
  'profile.lastName': { fr: 'Nom', en: 'Last name' },
  'profile.email': { fr: 'Email', en: 'Email' },
  'profile.phone': { fr: 'Téléphone', en: 'Phone' },
  'profile.premium': { fr: 'Abonnement Premium', en: 'Premium subscription' },
  'profile.shippingAddress': { fr: 'Adresse de livraison', en: 'Shipping address' },
  'profile.paymentInfo': { fr: 'Informations de paiement', en: 'Payment information' },
  'profile.cardType': { fr: 'Type de carte', en: 'Card type' },
  'profile.lastDigits': { fr: '4 derniers chiffres', en: 'Last 4 digits' },
  'profile.save': { fr: 'Enregistrer', en: 'Save' },
  'profile.saved': { fr: 'Profil mis à jour', en: 'Profile updated' },
  'profile.saveError': { fr: 'Erreur lors de la mise à jour', en: 'Error updating profile' },
  'profile.userNotFound': { fr: 'Utilisateur introuvable', en: 'User not found' },
  'profile.orders': { fr: 'Mes commandes', en: 'My orders' },
  'profile.noOrders': { fr: 'Aucune commande', en: 'No orders' },
  'profile.tab.personal': { fr: 'Informations personnelles', en: 'Personal information' },
  'profile.tab.delivery': { fr: 'Adresse de livraison', en: 'Shipping address' },
  'profile.tab.payment': { fr: 'Informations de paiement', en: 'Payment information' },
  'profile.deliveryMethod': { fr: 'Mode de livraison préféré', en: 'Preferred delivery method' },
  'profile.delivery.home': { fr: '🏠 Livraison à domicile', en: '🏠 Home delivery' },
  'profile.delivery.relay': { fr: '📦 Point relais', en: '📦 Pickup point' },
  'profile.delivery.locker': { fr: '🔐 Consigne automatique', en: '🔐 Parcel locker' },
  'profile.delivery.store': { fr: '🏬 Retrait en magasin', en: '🏬 In-store pickup' },
  'profile.delivery.drive': { fr: '🚗 Drive', en: '🚗 Drive' },
  'profile.delivery.express': { fr: '⚡ Livraison express', en: '⚡ Express delivery' },
  'profile.paymentMethod': { fr: 'Moyen de paiement préféré', en: 'Preferred payment method' },
  'profile.payment.creditCard': { fr: '💳 Carte bancaire', en: '💳 Credit card' },
  'profile.payment.paypal': { fr: '🅿️ PayPal', en: '🅿️ PayPal' },
  'profile.payment.applePay': { fr: ' Apple Pay', en: ' Apple Pay' },
  'profile.payment.googlePay': { fr: '📱 Google Pay', en: '📱 Google Pay' },
  'profile.payment.bankTransfer': { fr: '🏦 Virement bancaire', en: '🏦 Bank transfer' },
  'profile.payment.giftCard': { fr: '🎁 Carte cadeau', en: '🎁 Gift card' },

  // ─── Orders ────────────────────────────────────────────────────────────────
  'order.date': { fr: 'Date', en: 'Date' },
  'order.items': { fr: 'Articles', en: 'Items' },
  'order.total': { fr: 'Total', en: 'Total' },
  'order.status': { fr: 'Statut', en: 'Status' },
  'order.tracking': { fr: 'Suivi', en: 'Tracking' },
  'order.payment': { fr: 'Paiement', en: 'Payment' },
  'order.orderedOn': { fr: 'Passée le', en: 'Ordered on' },
  'order.notFound': { fr: 'Commande introuvable', en: 'Order not found' },

  // ─── Order status ──────────────────────────────────────────────────────────
  'status.Pending': { fr: 'En attente', en: 'Pending' },
  'status.Processing': { fr: 'En cours', en: 'Processing' },
  'status.Shipped': { fr: 'Expédié', en: 'Shipped' },
  'status.Delivered': { fr: 'Livré', en: 'Delivered' },
  'status.Cancelled': { fr: 'Annulé', en: 'Cancelled' },

  // ─── Categories page ──────────────────────────────────────────────────────
  'categories.title': { fr: 'Catégories', en: 'Categories' },
  'categories.product': { fr: 'produit', en: 'product' },
  'categories.products': { fr: 'produits', en: 'products' },

  // ─── Analytics ─────────────────────────────────────────────────────────────
  'analytics.title': { fr: '📊 Analytics — Back-office', en: '📊 Analytics — Back-office' },
  'analytics.revenue': { fr: "Chiffre d'affaires", en: 'Revenue' },
  'analytics.orders': { fr: 'Commandes', en: 'Orders' },
  'analytics.avgCart': { fr: 'Panier moyen', en: 'Average cart' },
  'analytics.products': { fr: 'Produits', en: 'Products' },
  'analytics.customers': { fr: 'Clients', en: 'Customers' },
  'analytics.revenueByCategory': { fr: 'CA par catégorie', en: 'Revenue by category' },
  'analytics.ordersByStatus': { fr: 'Commandes par statut', en: 'Orders by status' },
  'analytics.recentSales': { fr: 'Ventes récentes (30 derniers jours)', en: 'Recent sales (last 30 days)' },
  'analytics.topProducts': { fr: 'Top 10 produits', en: 'Top 10 products' },
  'analytics.product': { fr: 'Produit', en: 'Product' },
  'analytics.brand': { fr: 'Marque', en: 'Brand' },
  'analytics.qtySold': { fr: 'Qté vendue', en: 'Qty sold' },
  'analytics.revenueCol': { fr: 'CA', en: 'Revenue' },
  'analytics.caLabel': { fr: 'CA (€)', en: 'Revenue (€)' },
  'analytics.ordersLabel': { fr: 'Commandes', en: 'Orders' },

  // ─── Settings ──────────────────────────────────────────────────────────────
  'settings.title': { fr: '⚙️ Paramètres', en: '⚙️ Settings' },
  'settings.siteType': { fr: 'Type de site e-commerce', en: 'E-commerce site type' },
  'settings.siteTypeDesc': {
    fr: 'Changez le type de site pour charger un catalogue de produits différent. Toutes les données (panier, commandes) seront réinitialisées.',
    en: 'Change the site type to load a different product catalogue. All data (cart, orders) will be reset.',
  },
  'settings.dataManagement': { fr: 'Gestion des données', en: 'Data management' },
  'settings.resetAll': { fr: 'Réinitialiser toutes les données', en: 'Reset all data' },
  'settings.createProduct': { fr: 'Créer un produit', en: 'Create a product' },
  'settings.createProductDesc': {
    fr: 'Ajoutez un produit personnalisé au catalogue actuel.',
    en: 'Add a custom product to the current catalogue.',
  },
  'settings.newProduct': { fr: 'Nouveau produit', en: 'New product' },
  'settings.siteChanged': { fr: 'Site changé en', en: 'Site changed to' },
  'settings.changeError': { fr: 'Erreur lors du changement', en: 'Error changing site' },
  'settings.dataReset': { fr: 'Données réinitialisées', en: 'Data reset' },
  'settings.resetError': { fr: 'Erreur lors de la réinitialisation', en: 'Error resetting data' },
  'settings.productCreated': { fr: 'Produit créé', en: 'Product created' },
  'settings.createError': { fr: 'Erreur lors de la création', en: 'Error creating product' },
  'settings.productName': { fr: 'Nom du produit', en: 'Product name' },
  'settings.description': { fr: 'Description', en: 'Description' },
  'settings.price': { fr: 'Prix', en: 'Price' },
  'settings.stock': { fr: 'Stock', en: 'Stock' },
  'settings.brand': { fr: 'Marque', en: 'Brand' },
  'settings.category': { fr: 'Catégorie', en: 'Category' },
  'settings.cancel': { fr: 'Annuler', en: 'Cancel' },
  'settings.create': { fr: 'Créer', en: 'Create' },

  // ─── Footer ────────────────────────────────────────────────────────────────
  'footer.freeDelivery': { fr: '🚚 Livraison offerte* — Partout en France', en: '🚚 Free delivery* — Nationwide' },
  'footer.premium': { fr: '⭐ Abonnement Premium — Tous les avantages', en: '⭐ Premium Subscription — All benefits' },
  'footer.returns': { fr: '↩️ Retours sous 15 jours', en: '↩️ Returns within 15 days' },
  'footer.support': { fr: '🛠️ Service après-vente', en: '🛠️ After-sales service' },
  'footer.bestPrices': { fr: '💰 Meilleurs prix garantis', en: '💰 Best prices guaranteed' },
  'footer.drive': { fr: '🚗 Le Drive — Gagner du temps', en: '🚗 Drive — Save time' },
  'footer.demo': { fr: 'Site de démonstration e-commerce', en: 'E-commerce demo site' },
  'footer.legal': {
    fr: 'Conditions Générales · Mentions Légales · Politique de Confidentialité',
    en: 'Terms of Service · Legal Notice · Privacy Policy',
  },
  'footer.terms': { fr: 'Conditions Générales', en: 'Terms of Service' },
  'footer.legalNotice': { fr: 'Mentions Légales', en: 'Legal Notice' },
  'footer.privacy': { fr: 'Politique de Confidentialité', en: 'Privacy Policy' },
  // ─── Info pages ─────────────────────────────────────────────────────────
  'info.backToHome': { fr: "Retour à l'accueil", en: 'Back to home' },

  // Free delivery
  'info.delivery.title': { fr: '🚚 Livraison offerte', en: '🚚 Free Delivery' },
  'info.delivery.heroTitle': { fr: 'Livraison gratuite partout en France', en: 'Free delivery nationwide' },
  'info.delivery.heroSubtitle': {
    fr: 'Profitez de la livraison offerte dès 25 € d\'achat sur tous nos produits, sans exception.',
    en: 'Enjoy free delivery on all orders over €25, on every product, no exceptions.',
  },
  'info.delivery.standardTitle': { fr: 'Livraison standard', en: 'Standard delivery' },
  'info.delivery.standardDesc': {
    fr: 'Recevez votre commande en 3 à 5 jours ouvrés. Gratuite dès 25 € d\'achat, 4,99 € en dessous.',
    en: 'Receive your order in 3 to 5 business days. Free from €25, otherwise €4.99.',
  },
  'info.delivery.expressTitle': { fr: 'Livraison express', en: 'Express delivery' },
  'info.delivery.expressDesc': {
    fr: 'Recevez votre commande en 24h. Disponible pour 9,99 €, gratuite pour les abonnés Premium.',
    en: 'Receive your order within 24 hours. Available for €9.99, free for Premium subscribers.',
  },
  'info.delivery.relayTitle': { fr: 'Livraison en point relais', en: 'Pickup point delivery' },
  'info.delivery.relayDesc': {
    fr: 'Plus de 15 000 points relais en France. Gratuite dès 25 € d\'achat, 2,99 € en dessous.',
    en: 'Over 15,000 pickup points nationwide. Free from €25, otherwise €2.99.',
  },
  'info.delivery.trackingTitle': { fr: 'Suivi en temps réel', en: 'Real-time tracking' },
  'info.delivery.trackingDesc': {
    fr: 'Suivez votre colis en temps réel depuis votre espace client. Notifications par e-mail et SMS à chaque étape.',
    en: 'Track your parcel in real-time from your account. Email and SMS notifications at every step.',
  },
  'info.delivery.conditionsTitle': { fr: '*Conditions de livraison gratuite', en: '*Free delivery conditions' },
  'info.delivery.conditionsDesc': {
    fr: 'La livraison offerte s\'applique aux commandes de 25 € minimum, hors articles volumineux et livraison en Corse et DOM-TOM. Les délais sont indicatifs et peuvent varier selon la disponibilité et la destination.',
    en: 'Free delivery applies to orders of €25 or more, excluding bulky items and deliveries to overseas territories. Delivery times are estimates and may vary depending on availability and destination.',
  },

  // Premium subscription
  'info.premium.title': { fr: '⭐ Abonnement Premium', en: '⭐ Premium Subscription' },
  'info.premium.heroTitle': { fr: 'Rejoignez le programme Premium', en: 'Join the Premium program' },
  'info.premium.heroSubtitle': {
    fr: 'Profitez d\'avantages exclusifs pour seulement 49 €/an.',
    en: 'Enjoy exclusive benefits for just €49/year.',
  },
  'info.premium.freeExpressTitle': { fr: 'Livraison express gratuite', en: 'Free express delivery' },
  'info.premium.freeExpressDesc': {
    fr: 'Recevez toutes vos commandes en 24h sans frais supplémentaires, sans minimum d\'achat.',
    en: 'Get all your orders within 24 hours at no extra cost, with no minimum purchase.',
  },
  'info.premium.privateSalesTitle': { fr: 'Accès ventes privées', en: 'Private sales access' },
  'info.premium.privateSalesDesc': {
    fr: 'Accédez en avant-première à nos ventes privées avec des réductions allant jusqu\'à -50 % sur une sélection de produits.',
    en: 'Get early access to our private sales with discounts of up to 50% on selected products.',
  },
  'info.premium.extendedReturnsTitle': { fr: 'Retours étendus à 30 jours', en: '30-day extended returns' },
  'info.premium.extendedReturnsDesc': {
    fr: 'Bénéficiez de 30 jours au lieu de 15 pour retourner vos articles. Retours gratuits inclus.',
    en: 'Enjoy 30 days instead of 15 to return your items. Free returns included.',
  },
  'info.premium.supportTitle': { fr: 'Support prioritaire', en: 'Priority support' },
  'info.premium.supportDesc': {
    fr: 'Un conseiller dédié disponible par téléphone et chat, 7j/7 avec temps d\'attente réduit.',
    en: 'A dedicated advisor available by phone and chat, 7 days a week with reduced waiting times.',
  },
  'info.premium.cashbackTitle': { fr: '5 % de cashback', en: '5% cashback' },
  'info.premium.cashbackDesc': {
    fr: 'Cumulez 5 % de cashback sur tous vos achats, utilisable dès votre prochaine commande.',
    en: 'Earn 5% cashback on all purchases, redeemable on your next order.',
  },
  'info.premium.priceLabel': { fr: '49 €/an', en: '€49/year' },
  'info.premium.subscribe': { fr: 'S\'abonner maintenant', en: 'Subscribe now' },

  // Returns
  'info.returns.title': { fr: '↩️ Retours sous 15 jours', en: '↩️ Returns within 15 days' },
  'info.returns.heroTitle': { fr: 'Politique de retour simple et rapide', en: 'Simple and fast return policy' },
  'info.returns.heroSubtitle': {
    fr: 'Non satisfait ? Retournez vos articles sous 15 jours pour un remboursement complet.',
    en: 'Not satisfied? Return your items within 15 days for a full refund.',
  },
  'info.returns.eligibilityTitle': { fr: 'Conditions d\'éligibilité', en: 'Eligibility conditions' },
  'info.returns.eligibilityDesc': {
    fr: 'Tout produit non utilisé, dans son emballage d\'origine et accompagné de sa facture peut être retourné dans les 15 jours suivant la livraison (30 jours pour les abonnés Premium).',
    en: 'Any unused product, in its original packaging and accompanied by its invoice, can be returned within 15 days of delivery (30 days for Premium subscribers).',
  },
  'info.returns.step1Title': { fr: 'Étape 1 : Demande de retour', en: 'Step 1: Return request' },
  'info.returns.step1Desc': {
    fr: 'Connectez-vous à votre espace client, accédez à votre commande et cliquez sur "Demander un retour". Sélectionnez les articles et le motif.',
    en: 'Log into your account, go to your order and click "Request a return". Select the items and the reason.',
  },
  'info.returns.step2Title': { fr: 'Étape 2 : Préparation du colis', en: 'Step 2: Package preparation' },
  'info.returns.step2Desc': {
    fr: 'Imprimez l\'étiquette de retour prépayée fournie par e-mail. Emballez soigneusement les articles dans leur emballage d\'origine.',
    en: 'Print the prepaid return label sent by email. Carefully package the items in their original packaging.',
  },
  'info.returns.step3Title': { fr: 'Étape 3 : Expédition', en: 'Step 3: Shipping' },
  'info.returns.step3Desc': {
    fr: 'Déposez votre colis dans un point relais ou un bureau de poste. Vous pouvez suivre le retour depuis votre espace client.',
    en: 'Drop your package at a pickup point or post office. You can track the return from your account.',
  },
  'info.returns.refundTitle': { fr: 'Remboursement', en: 'Refund' },
  'info.returns.refundDesc': {
    fr: 'Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification de l\'article. Le montant est crédité sur le moyen de paiement d\'origine.',
    en: 'The refund is processed within 5 to 10 business days after receipt and verification of the item. The amount is credited to the original payment method.',
  },

  // After-sales service
  'info.aftersales.title': { fr: '🛠️ Service après-vente', en: '🛠️ After-sales Service' },
  'info.aftersales.heroTitle': { fr: 'Un service après-vente à votre écoute', en: 'Customer service at your service' },
  'info.aftersales.heroSubtitle': {
    fr: 'Notre équipe est disponible pour vous accompagner après votre achat.',
    en: 'Our team is available to support you after your purchase.',
  },
  'info.aftersales.phoneTitle': { fr: 'Par téléphone', en: 'By phone' },
  'info.aftersales.phoneDesc': {
    fr: 'Appelez le 01 23 45 67 89 (prix d\'un appel local), du lundi au samedi, de 8h à 20h.',
    en: 'Call 01 23 45 67 89 (local rate), Monday to Saturday, 8am to 8pm.',
  },
  'info.aftersales.emailTitle': { fr: 'Par e-mail', en: 'By email' },
  'info.aftersales.emailDesc': {
    fr: 'Envoyez-nous un e-mail à sav@zava.fr. Nous vous répondons sous 24h ouvrées.',
    en: 'Send us an email at support@zava.com. We respond within 24 business hours.',
  },
  'info.aftersales.chatTitle': { fr: 'Chat en ligne', en: 'Live chat' },
  'info.aftersales.chatDesc': {
    fr: 'Discutez en direct avec un conseiller depuis votre espace client, 7j/7 de 9h à 22h.',
    en: 'Chat live with an advisor from your account, 7 days a week from 9am to 10pm.',
  },
  'info.aftersales.warrantyTitle': { fr: 'Garantie', en: 'Warranty' },
  'info.aftersales.warrantyDesc': {
    fr: 'Tous nos produits bénéficient de la garantie légale de conformité de 2 ans. Pour les produits électroniques, une extension de garantie à 3 ans est disponible.',
    en: 'All our products benefit from the 2-year legal conformity guarantee. For electronic products, a 3-year warranty extension is available.',
  },
  'info.aftersales.repairTitle': { fr: 'Réparation', en: 'Repair' },
  'info.aftersales.repairDesc': {
    fr: 'En cas de panne, nous proposons un service de réparation. Envoyez votre produit en atelier et suivez l\'avancement depuis votre compte.',
    en: 'In case of malfunction, we offer a repair service. Send your product to our workshop and track progress from your account.',
  },

  // Best prices
  'info.bestprices.title': { fr: '💰 Meilleurs prix garantis', en: '💰 Best Prices Guaranteed' },
  'info.bestprices.heroTitle': { fr: 'Notre engagement prix', en: 'Our price commitment' },
  'info.bestprices.heroSubtitle': {
    fr: 'Nous vous garantissons les meilleurs prix sur l\'ensemble de notre catalogue.',
    en: 'We guarantee the best prices across our entire catalogue.',
  },
  'info.bestprices.matchTitle': { fr: 'Alignement de prix', en: 'Price matching' },
  'info.bestprices.matchDesc': {
    fr: 'Vous trouvez moins cher ailleurs ? Nous nous alignons sur le prix du concurrent et vous offrons en plus 5 % de réduction supplémentaire.',
    en: 'Found it cheaper elsewhere? We\'ll match the competitor\'s price and give you an additional 5% discount.',
  },
  'info.bestprices.alertsTitle': { fr: 'Alertes de prix', en: 'Price alerts' },
  'info.bestprices.alertsDesc': {
    fr: 'Activez les alertes prix sur vos produits favoris et soyez notifié dès qu\'une baisse de prix intervient.',
    en: 'Set price alerts on your favorite products and get notified as soon as a price drop occurs.',
  },
  'info.bestprices.promosTitle': { fr: 'Promotions permanentes', en: 'Ongoing promotions' },
  'info.bestprices.promosDesc': {
    fr: 'Retrouvez chaque semaine des centaines de produits en promotion. Nos acheteurs négocient les meilleurs tarifs directement auprès des fournisseurs.',
    en: 'Discover hundreds of discounted products every week. Our buyers negotiate the best rates directly with suppliers.',
  },
  'info.bestprices.transparencyTitle': { fr: 'Transparence des prix', en: 'Price transparency' },
  'info.bestprices.transparencyDesc': {
    fr: 'Tous nos prix affichés sont TTC et incluent l\'éco-participation le cas échéant. Pas de frais cachés.',
    en: 'All displayed prices include taxes and eco-fees where applicable. No hidden charges.',
  },

  // Drive
  'info.drive.title': { fr: '🚗 Le Drive — Gagner du temps', en: '🚗 Drive — Save Time' },
  'info.drive.heroTitle': { fr: 'Commandez en ligne, récupérez en magasin', en: 'Order online, pick up in store' },
  'info.drive.heroSubtitle': {
    fr: 'Votre commande prête en 2 heures. Faites vos courses en quelques clics et passez les récupérer sans descendre de voiture.',
    en: 'Your order ready in 2 hours. Shop in a few clicks and pick up your order without leaving your car.',
  },
  'info.drive.howItWorksTitle': { fr: 'Comment ça marche ?', en: 'How does it work?' },
  'info.drive.step1': {
    fr: '1. Ajoutez vos articles au panier et choisissez l\'option "Drive" au moment de la commande.',
    en: '1. Add your items to cart and select the "Drive" option at checkout.',
  },
  'info.drive.step2': {
    fr: '2. Sélectionnez le magasin et le créneau horaire qui vous conviennent.',
    en: '2. Select the store and time slot that suits you.',
  },
  'info.drive.step3': {
    fr: '3. Rendez-vous au point de retrait à l\'heure convenue. Nos équipiers chargent vos courses dans votre coffre.',
    en: '3. Go to the pickup point at the scheduled time. Our team loads your groceries into your trunk.',
  },
  'info.drive.freeTitle': { fr: 'Service gratuit', en: 'Free service' },
  'info.drive.freeDesc': {
    fr: 'Le service Drive est entièrement gratuit, sans minimum d\'achat. Les mêmes prix qu\'en ligne sont appliqués.',
    en: 'The Drive service is completely free, with no minimum purchase. Same prices as online apply.',
  },
  'info.drive.storesTitle': { fr: 'Magasins disponibles', en: 'Available stores' },
  'info.drive.storesDesc': {
    fr: 'Plus de 200 points de retrait Drive à travers la France. Trouvez le plus proche dans votre espace client.',
    en: 'Over 200 Drive pickup points across the country. Find the nearest one in your account.',
  },

  // Terms of service
  'info.terms.title': { fr: 'Conditions Générales de Vente', en: 'Terms of Service' },
  'info.terms.lastUpdate': { fr: 'Dernière mise à jour : 1er janvier 2026', en: 'Last updated: January 1, 2026' },
  'info.terms.s1Title': { fr: 'Article 1 — Objet', en: 'Article 1 — Purpose' },
  'info.terms.s1Desc': {
    fr: 'Les présentes conditions générales de vente régissent l\'ensemble des ventes réalisées sur le site zava.fr, exploité par la société Zava SAS, au capital de 100 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789.',
    en: 'These terms of service govern all sales made on the zava.com website, operated by Zava Inc., a company registered in Delaware with registration number 123 456 789.',
  },
  'info.terms.s2Title': { fr: 'Article 2 — Prix', en: 'Article 2 — Pricing' },
  'info.terms.s2Desc': {
    fr: 'Les prix sont indiqués en euros toutes taxes comprises (TTC). Zava se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la validation de la commande.',
    en: 'Prices are displayed in euros and include all applicable taxes. Zava reserves the right to modify its prices at any time; the applicable price is the one in effect at the time of order confirmation.',
  },
  'info.terms.s3Title': { fr: 'Article 3 — Commande', en: 'Article 3 — Orders' },
  'info.terms.s3Desc': {
    fr: 'Toute commande implique l\'acceptation des présentes CGV. La commande est confirmée par l\'envoi d\'un e-mail de confirmation. Zava se réserve le droit de refuser ou d\'annuler toute commande en cas de litige ou de non-paiement.',
    en: 'Any order implies acceptance of these terms. The order is confirmed by sending a confirmation email. Zava reserves the right to refuse or cancel any order in case of dispute or non-payment.',
  },
  'info.terms.s4Title': { fr: 'Article 4 — Livraison', en: 'Article 4 — Delivery' },
  'info.terms.s4Desc': {
    fr: 'Les délais de livraison sont indicatifs. Zava ne saurait être tenue responsable des retards imputables au transporteur. En cas de produit endommagé, le client dispose de 48h pour émettre des réserves.',
    en: 'Delivery times are estimates. Zava cannot be held responsible for delays attributable to the carrier. In case of a damaged product, the customer has 48 hours to file a claim.',
  },
  'info.terms.s5Title': { fr: 'Article 5 — Droit de rétractation', en: 'Article 5 — Right of withdrawal' },
  'info.terms.s5Desc': {
    fr: 'Conformément à la législation en vigueur, le client dispose d\'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.',
    en: 'In accordance with applicable law, the customer has 14 days from receipt to exercise their right of withdrawal, without providing reasons or paying penalties.',
  },
  'info.terms.s6Title': { fr: 'Article 6 — Garanties', en: 'Article 6 — Warranties' },
  'info.terms.s6Desc': {
    fr: 'Tous les produits bénéficient de la garantie légale de conformité (articles L.217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).',
    en: 'All products benefit from the legal conformity guarantee and the guarantee against hidden defects, in accordance with applicable consumer protection laws.',
  },

  // Legal notice
  'info.legal.title': { fr: 'Mentions Légales', en: 'Legal Notice' },
  'info.legal.editorTitle': { fr: 'Éditeur du site', en: 'Website publisher' },
  'info.legal.editorDesc': {
    fr: 'Zava SAS au capital de 100 000 €\nSiège social : 42 rue du Commerce, 75015 Paris, France\nRCS Paris 123 456 789\nN° TVA : FR 12 345678901\nDirecteur de la publication : Jean Dupont',
    en: 'Zava Inc.\nRegistered office: 42 Commerce Street, 75015 Paris, France\nRegistration: 123 456 789\nVAT: FR 12 345678901\nPublication director: Jean Dupont',
  },
  'info.legal.hostingTitle': { fr: 'Hébergement', en: 'Hosting' },
  'info.legal.hostingDesc': {
    fr: 'Ce site est hébergé par Microsoft Azure, Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, États-Unis.',
    en: 'This website is hosted by Microsoft Azure, Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, USA.',
  },
  'info.legal.ipTitle': { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
  'info.legal.ipDesc': {
    fr: 'L\'ensemble des contenus présents sur le site (textes, images, logos, illustrations) sont protégés par le droit d\'auteur. Toute reproduction totale ou partielle est interdite sans autorisation préalable.',
    en: 'All content on this website (texts, images, logos, illustrations) is protected by copyright. Any total or partial reproduction is prohibited without prior authorization.',
  },
  'info.legal.contactTitle': { fr: 'Contact', en: 'Contact' },
  'info.legal.contactDesc': {
    fr: 'E-mail : contact@zava.fr\nTéléphone : 01 23 45 67 89\nFormulaire de contact disponible dans votre espace client.',
    en: 'Email: contact@zava.com\nPhone: 01 23 45 67 89\nContact form available in your account.',
  },

  // Privacy policy
  'info.privacy.title': { fr: 'Politique de Confidentialité', en: 'Privacy Policy' },
  'info.privacy.lastUpdate': { fr: 'Dernière mise à jour : 1er janvier 2026', en: 'Last updated: January 1, 2026' },
  'info.privacy.introTitle': { fr: 'Introduction', en: 'Introduction' },
  'info.privacy.introDesc': {
    fr: 'Zava SAS s\'engage à protéger la vie privée de ses utilisateurs. Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.',
    en: 'Zava Inc. is committed to protecting the privacy of its users. This policy describes how we collect, use and protect your personal data in accordance with GDPR.',
  },
  'info.privacy.collectionTitle': { fr: 'Données collectées', en: 'Data collected' },
  'info.privacy.collectionDesc': {
    fr: 'Nous collectons les données suivantes : nom, prénom, adresse e-mail, adresse postale, numéro de téléphone, historique de commandes et données de navigation (cookies).',
    en: 'We collect the following data: first name, last name, email address, postal address, phone number, order history, and browsing data (cookies).',
  },
  'info.privacy.purposeTitle': { fr: 'Finalités du traitement', en: 'Purpose of processing' },
  'info.privacy.purposeDesc': {
    fr: 'Vos données sont utilisées pour : le traitement de vos commandes, la gestion de votre compte client, l\'envoi de communications commerciales (avec votre consentement), l\'amélioration de nos services et la prévention de la fraude.',
    en: 'Your data is used for: processing your orders, managing your customer account, sending marketing communications (with your consent), improving our services, and fraud prevention.',
  },
  'info.privacy.retentionTitle': { fr: 'Durée de conservation', en: 'Data retention' },
  'info.privacy.retentionDesc': {
    fr: 'Vos données personnelles sont conservées pendant la durée de la relation commerciale et jusqu\'à 3 ans après votre dernier achat à des fins de prospection. Les données de facturation sont conservées 10 ans.',
    en: 'Your personal data is retained for the duration of the commercial relationship and up to 3 years after your last purchase for prospecting purposes. Billing data is retained for 10 years.',
  },
  'info.privacy.rightsTitle': { fr: 'Vos droits', en: 'Your rights' },
  'info.privacy.rightsDesc': {
    fr: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de suppression, de portabilité de vos données et d\'un droit d\'opposition au traitement. Pour exercer ces droits, contactez-nous à dpo@zava.fr.',
    en: 'Under GDPR, you have the right to access, rectify, delete, port your data, and the right to object to processing. To exercise these rights, contact us at dpo@zava.com.',
  },
  'info.privacy.cookiesTitle': { fr: 'Cookies', en: 'Cookies' },
  'info.privacy.cookiesDesc': {
    fr: 'Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies à tout moment depuis les paramètres de votre navigateur.',
    en: 'This website uses cookies to improve your experience. You can manage your cookie preferences at any time from your browser settings.',
  },
  // ─── Common ────────────────────────────────────────────────────────────────
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.error': { fr: 'Erreur de chargement', en: 'Loading error' },
  'common.postalCodeShort': { fr: 'CP', en: 'ZIP' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}

export default translations;
