Je souhaite créer un site internet qui serait un site pour réaliser mes tests et qui serait un facsimilé d'un site de e-commerce.

Ce site e-commerce est polymorphique dans le sens où en changeant un paramètre (via une combox dans le paramétrage général) les types de produits et catégories sont différents: 
 - Site de vente de produit électronique/livres (comme https://www.FNAC.com), 
 - site de vente de produit électroménager (https://www.boulanger.fr, https://www.darty.fr), 
 - site de vente de maquillage/parfum (https://www.sephora.fr https://www.loreal.fr), 
 - Site de vente de matériel électrique (https://www.rexel.fr, https://www.sonepar.fr), 
 - site de vente de bricolage (https://www.leroymerlinfr)
 - site de vente de produit alimentaire (https://www.carrefour.fr/, https://fd3-courses.leclercdrive.fr/, Drive, Courses en ligne et Livraison à Domicile Super U, Hyper U, U express - www.coursesu.com, https://www.auchan.fr/)

Le site doit proposer les fonctionnalités suivante:
    • Homepage avec :
        ○ Sélection pour vous, Meilleures ventes, Nouveautés, les produits en avant, les promo, la sélection du moment
        ○ Les Top categories
        ○ Nos marques
        ○ Nos avantages / Abonnement Premium
        ○ Un footer avec des icones qui pointent vers des pages informatives :
            § Livraison offerte* - Partout en France
            § L'abonnement Premium - Tous les avantages
            § Retours sous 15 jours - 15 jours pour changer d'avis
            § Service après-vente - Les réponses à vos questions
            § Meilleurs prix garantis - Nous vous remboursons la différence
            § Le Drive - Gagner du temps
            § Conditions Générales
    • Une barre de recherche qui affiche la liste des résultats des produits
    • Une page produit qui détaille le produit
    • Une page qui permet d'afficher le panier
    • Une page qui permet d'afficher le profil
    •  de l'utilisateur et changer ses informations personnelles, adresse livraison/facturation, son email/mot de passe, ses informations de paiement, son abonnement premium
    • Un ensemble de pages qui simule le tunnel de commande (livraison, paiement, récapitulatif
    • Une page de configuration du site dans les paramètres (type de site e-commerce, réinitialisation des données)
    • Le site doit proposer une page back-office démo / analytics (vente en cours, meilleurs ventes, etc.)

Fonctionnalités essentielles à simuler
    • Recherche full‑text + suggestions et filtres dynamiques.
    • Responsive / mobile first et performance (chargement rapide).
    • Panier persistant et checkout en 1–3 étapes.
    • Gestion des variantes (taille, couleur), stock et prix promo.
    • Avis clients (étoiles, commentaires), recommandations produits et cross‑sell / up‑sell.
    • Multi‑moyens de paiement (CB, PayPal, Apple/Google Pay) et simulation d’erreurs de paiement.

Contenu de démo:
    • Jeu de données : 100 produits répartis en 10 catégories, 2–3 variantes par produit, des commentaires pour chaque produits (entre 10 et 50)
    • Les données doivent être réalistes (des vrais produits existants) et correspondre au type du site
    • Pour la création de ce site, n'utilise pas d'images pour le moment

Le site doit avoir un Look&Feel professionnel, utilise Material UI
Les données sont générées en mémoire, pas de base données
Utilise la dernière version de .NET (recherche en ligne pour savoir laquelle)

Scénarios de démo et tests
    • Parcours client : recherche → filtre → ajout variante → checkout → erreur paiement → succès.
Admin : basculer type de site → réinitialiser données → créer produit → voir analytics.