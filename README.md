# Zava — E-commerce Simulation

Site e-commerce polymorphique de démonstration. Changez le type de boutique en un clic et obtenez un catalogue complet avec 100 produits, 10 catégories, des avis clients et un tunnel d'achat fonctionnel.

## 6 types de boutique

| Type | Inspiration | Exemple |
|------|-------------|---------|
| Électronique & Livres | Fnac | Smartphones, laptops, livres |
| Électroménager | Boulanger / Darty | Lave-linge, réfrigérateurs |
| Beauté & Parfums | Sephora / L'Oréal | Maquillage, soins, parfums |
| Matériel Électrique | Rexel / Sonepar | Câbles, disjoncteurs, outillage |
| Bricolage | Leroy Merlin | Perceuses, peinture, plomberie |
| Alimentaire | Carrefour / Leclerc | Épicerie, frais, boissons |

## Fonctionnalités

- **Homepage** — Sélection, meilleures ventes, nouveautés, promos, marques, avantages premium
- **Recherche** — Full-text avec suggestions, filtres (catégorie, marque, prix, note, stock), tri, pagination, facettes
- **Fiche produit** — Variantes (taille, couleur) avec ajustement de prix, stock, notes et avis clients, produits associés
- **Panier** — Ajout/suppression, quantités, vidé automatiquement au changement de site
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
| `POST` | `/api/cart` | Ajouter au panier |
| `PUT` | `/api/cart/{productId}` | Modifier la quantité |
| `DELETE` | `/api/cart/{productId}` | Supprimer du panier |
| `DELETE` | `/api/cart` | Vider le panier |
| `POST` | `/api/checkout` | Passer commande |
| `GET` | `/api/orders` | Historique des commandes |
| `GET` | `/api/orders/{id}` | Détail d'une commande |
| `GET` | `/api/user` | Profil utilisateur |
| `PUT` | `/api/user` | Mettre à jour le profil |
| `GET` | `/api/products/{id}/reviews` | Avis d'un produit |
| `GET` | `/api/analytics` | Tableau de bord analytics |

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
