# Zava — E-commerce Simulation

Site e-commerce polymorphique de démonstration. Changez le type de boutique en un clic et obtenez un catalogue complet avec 100 produits, 10 catégories, des avis clients et un tunnel d'achat fonctionnel.

## 6 types de boutique

| Type | Exemple |
|------|---------|
| Électronique | Smartphones, laptops, livres |
| Électroménager | Lave-linge, réfrigérateurs |
| Beauté & Parfums | Maquillage, soins, parfums |
| Matériel Électrique | Câbles, disjoncteurs, outillage |
| Bricolage | Perceuses, peinture, plomberie |
| Alimentaire | Épicerie, frais, boissons |

## Fonctionnalités

- **Homepage** — Sélection, meilleures ventes, nouveautés, promos, marques, avantages premium
- **Recherche** — Full-text avec suggestions, filtres (catégorie, marque, prix, note, stock), tri, pagination, facettes
- **Fiche produit** — Variantes (taille, couleur) avec ajustement de prix, stock, notes et avis clients, produits associés
- **Panier** — Ajout/suppression par variante, contrôle des quantités et du stock, erreurs visibles avec possibilité de réessayer, vidé automatiquement au changement de site
- **Checkout** — Tunnel en 3 étapes (adresse → paiement → confirmation), 4 moyens de paiement (CB, PayPal, Apple Pay, Google Pay), simulation d'erreurs (carte finissant par `0000`)
- **Profil** — Infos personnelles, adresse, paiement, historique des commandes
- **Analytics** — KPIs, graphiques (revenus par catégorie, commandes par statut, ventes journalières), top produits
- **Paramètres** — Changement de type de site, réinitialisation des données, création de produit

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | .NET 10 — Minimal API |
| Frontend | React 19 + TypeScript + Vite |
| UI | Material UI 7 |
| Graphiques | ECharts |
| Routing | React Router DOM |
| Données | In-memory (seed déterministe `Random(42)`) |

## Prérequis

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) ≥ 18

## Lancement rapide

### PowerShell (recommandé)

```powershell
.\start.ps1
```

### Windows (cmd)

```cmd
start.bat
```

### Linux / macOS

```bash
chmod +x start.sh
./start.sh
```

### Démarrage manuel

```bash
# Terminal 1 — Backend
cd src/Zava.Api
dotnet run

# Terminal 2 — Frontend
cd src/Zava.Web
npm install
npm run dev
```

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5014/api |
| OpenAPI | http://localhost:5014/openapi/v1.json |

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/config` | Configuration du site |
| `PUT` | `/api/config/site-type` | Changer le type de site |
| `POST` | `/api/config/reset` | Réinitialiser les données |
| `GET` | `/api/homepage` | Données de la homepage |
| `GET` | `/api/products` | Tous les produits |
| `GET` | `/api/products/{id}` | Détail d'un produit |
| `POST` | `/api/products` | Créer un produit |
| `GET` | `/api/categories` | Toutes les catégories |
| `GET` | `/api/categories/{id}` | Catégorie avec ses produits |
| `POST` | `/api/search` | Recherche avec filtres |
| `GET` | `/api/search/suggestions?q=` | Suggestions de recherche |
| `GET` | `/api/cart` | Panier |
| `POST` | `/api/cart/items` | Ajouter au panier |
| `PUT` | `/api/cart/items/{productId}` | Modifier la quantité (`variantId` dans le corps JSON) |
| `DELETE` | `/api/cart/items/{productId}?variantId=` | Supprimer une variante du panier |
| `POST` | `/api/cart/warranty` | Ajouter une garantie calculée par le serveur (`productId` uniquement) |
| `DELETE` | `/api/cart` | Vider le panier |
| `POST` | `/api/checkout` | Passer commande |
| `GET` | `/api/orders` | Historique des commandes |
| `GET` | `/api/orders/{id}` | Détail d'une commande |
| `GET` | `/api/user` | Profil utilisateur |
| `PUT` | `/api/user` | Mettre à jour le profil |
| `GET` | `/api/products/{id}/reviews` | Avis d'un produit |
| `GET` | `/api/analytics` | Tableau de bord analytics |

### Contrat du panier

- Une ligne est identifiée par `(productId, variantId)`. Sans `variantId` (ou avec `null`), seule la ligne sans variante est ciblée.
- L'ajout exige une quantité positive et une variante existante si elle est fournie. La somme des quantités d'un produit ne peut pas dépasser son stock ; chaque variante respecte aussi son propre stock.
- Une mise à jour à `0` supprime la ligne ; une quantité négative est refusée. Les validations renvoient `400` avec un champ `message`, sans modifier le panier.
- Les garanties sont disponibles uniquement pour l'électronique et l'électroménager, avec le produit déjà au panier. Leur nom et leur tarif proviennent de la même règle serveur que l'offre affichée ; les anciens champs client `warrantyName` et `warrantyPrice` sont ignorés.
- Une seule garantie est conservée par produit, avec une quantité de `1`. Elle disparaît avec la dernière ligne du produit couvert.

## Évaluation qualité et priorités

Le projet convient à une **démonstration de parcours e-commerce**, pas à une boutique réelle : panier et profil partagés, données en mémoire, absence d'authentification et paiement simulé. N'y saisissez ni données personnelles réelles ni coordonnées bancaires réelles.

Les corrections de cette évaluation ciblent la confiance dans le panier : modifier la bonne variante, éviter les quantités invalides, calculer les garanties côté serveur et rendre les échecs visibles plutôt que silencieux. Elles réduisent les erreurs de commande et les écarts de prix sur les garanties sans changer l'architecture du démonstrateur.

| Priorité | Suite recommandée | Valeur technique et métier |
|----------|-------------------|----------------------------|
| Haute, avant usage réel | Isoler les paniers par utilisateur, ajouter authentification/autorisation et persistance | Éviter le partage involontaire des commandes et la perte des données au redémarrage |
| Haute | Rendre les mutations et le checkout transactionnels, réserver/décrémenter le stock, rendre le paiement idempotent | Les contrôles du panier ne réservent pas le stock et ne protègent pas les requêtes concurrentes ; prévenir survente et commandes en double |
| Haute | Aligner la remise complémentaire annoncée avec le prix facturé | L'offre cross-sell affiche actuellement une remise de 10 %, mais l'ajout standard utilise le prix catalogue/promotion ; éviter une promesse commerciale non tenue |
| Haute | Traiter les avis de sécurité des dépendances et ajouter des tests automatisés exécutés sur les PR | Les audits initiaux signalent des dépendances vulnérables ; les exemples HTTP actuels ne constituent pas une suite automatisée |
| Moyenne | Valider aussi création de produits, adresses et paiement côté serveur ; harmoniser les erreurs FR/EN | Améliorer la qualité des données et la compréhension des refus |
| Moyenne | Charger les pages, notamment les graphiques analytics, à la demande ; mesurer le parcours mobile | Le build initial charge environ 1,82 Mo de JavaScript (573 Ko gzip) dans un seul bundle ; réduire le coût d'entrée dans la boutique |
| Moyenne | Corriger les erreurs ESLint existantes et ajouter un contrôle build/lint avant déploiement | Détecter les régressions avant publication, sans désactiver les règles |

### Vérification

```bash
# Depuis la racine
dotnet build Zava.slnx

cd src/Zava.Web
npm ci
npm run build
npm run lint
```

Les deux builds passent lors de l'évaluation. Le lint global signale neuf erreurs préexistantes dans les contextes et plusieurs pages ; les fichiers frontend modifiés passent leur lint ciblé. Le build .NET signale notamment l'avis [GHSA-v5pm-xwqc-g5wc](https://github.com/advisories/GHSA-v5pm-xwqc-g5wc) sur la dépendance transitive `Microsoft.OpenApi`. Les dépendances ne sont pas mises à jour dans cette correction fonctionnelle.

Pour vérifier le panier, démarrer l'API et exécuter dans l'ordre la section **Cart regression checks** de `src/Zava.Api/Zava.Api.http` avec un client HTTP compatible. Les statuts et invariants attendus figurent dans chaque requête. **Cette section réinitialise les données partagées du démonstrateur.**

Dans le navigateur, ajouter deux variantes du même produit, modifier/supprimer la seconde et vérifier que la première ne change pas. Couper ensuite l'API : une mutation doit afficher une erreur sans effacer le panier ; un chargement initial en échec doit proposer « Réessayer », et non afficher un panier vide. Rétablir l'API puis réessayer.

## Structure du projet

```
zava/
├── src/
│   ├── Zava.Api/                  # Backend .NET 10
│   │   ├── Models/                # Entités et DTOs
│   │   ├── Services/              # DataStore, Search, Analytics
│   │   │   └── Seeders/           # 6 seeders (un par type de site)
│   │   └── Program.cs             # Endpoints Minimal API
│   └── Zava.Web/                  # Frontend React
│       └── src/
│           ├── context/           # SiteContext (état global)
│           ├── components/        # Layout, ProductCard, ProductGrid
│           ├── pages/             # 10 pages
│           ├── api.ts             # Client API
│           ├── types.ts           # Interfaces TypeScript
│           └── theme.ts           # Thème MUI
├── Docs/specifications.md
├── start.ps1                      # Script de lancement PowerShell
├── start.bat                      # Script de lancement Windows
└── start.sh                       # Script de lancement Linux/macOS
```

## Licence

Voir [LICENSE](LICENSE).
