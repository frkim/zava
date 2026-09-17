# Zava — E-commerce Simulation

Site e-commerce polymorphique de démonstration. Changez le type de boutique en un clic et obtenez un catalogue complet avec 100 produits (187 en alimentaire), 10 catégories, des avis clients et un tunnel d'achat fonctionnel.

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
- **Panier recette (alimentaire)** — Suggestions de plats, recette libre, 1 à 20 convives et choix grandes marques nationales / marques distributeurs / économique / mix. Deux agents Microsoft Foundry préparent un aperçu des ingrédients et produits ; la confirmation ajoute la sélection au panier.
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
| `GET` | `/api/recipe-basket/options` | Disponibilité du panier recette et suggestions |
| `POST` | `/api/recipe-basket/plan` | Préparer un aperçu sans modifier le panier (`recipe`, `servings`, `brandPreference`) |
| `POST` | `/api/recipe-basket/commit` | Confirmer un aperçu serveur (`planId`), sans doublon lors d'une nouvelle tentative |
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

### Panier recette

1. Dans **Paramètres**, sélectionner **Alimentaire**, puis ouvrir **Panier recette** depuis la navigation, l'accueil ou le panier.
2. Choisir une suggestion (lasagnes, blanquette de veau, hachis parmentier, bœuf bourguignon) ou saisir un autre plat, le nombre de personnes et la gamme.
3. Générer la sélection, vérifier les produits, les paquets entiers, le total et les ingrédients manquants, puis confirmer l'ajout groupé. Une sélection incomplète est signalée ; elle n'est pas présentée comme une recette complète.

Les valeurs API des gammes sont `National`, `PrivateLabel`, `Economy` et `Mix`. Les trois premières filtrent le catalogue **côté serveur** grâce aux tags `brand:national`, `brand:private-label` et `brand:economy`. Les références Zava et Zava Essentiel et leurs prix sont des données de démonstration. Les 29 ingrédients de base disposent chacun de trois gammes ; une recette libre peut nécessiter des ingrédients non commercialisés.

Le premier agent décompose la recette en ingrédients et quantités ; le second associe ces ingrédients aux références réellement disponibles et à leurs conditionnements. Les réponses sont structurées et validées : aucun identifiant, prix ou stock inventé par le modèle n'est accepté. Les agents n'ont pas d'outil de paiement ni d'accès direct au panier.

Un aperçu expire après dix minutes et devient invalide après réinitialisation ou changement de boutique. La confirmation revérifie le catalogue et les stocks, conserve les variantes et ajoute tout ou rien. Réessayer la même confirmation pendant sa validité ne double pas les quantités. Les estimations culinaires restent des suggestions : vérifier les portions, les substitutions et les allergènes sur les emballages.

Sans configuration Foundry, l'interface explique l'indisponibilité de l'assistant et le panier classique reste utilisable. Il n'existe pas de simulation IA cachée ni de repli vers un modèle local.

#### Microsoft Foundry et monitoring

L'infrastructure utilise un compte **Microsoft Foundry** (`AIServices`, projets activés), un projet et un déploiement **GPT-5 mini**, pas un hub Foundry classique. Deux agents prompt persistants, `recipe-planner` et `recipe-shopper`, sont déployés dans Agent Service. L'API les sélectionne via `agent_reference` sur l'API Responses du projet :

```text
https://<compte>.services.ai.azure.com/api/projects/<projet>/openai/responses?api-version=2025-11-15-preview
```

L'authentification utilise Microsoft Entra ID et l'identité managée de Container Apps, sans clé de modèle dans le navigateur. Application Insights, lié à Log Analytics, reçoit la télémétrie de l'API. Les événements applicatifs `RecipeBasketPlan` et `RecipeBasketCommit` décrivent le résultat et, pour la génération, la durée ; ils n'enregistrent pas le texte de la recette.

Pour un développement local avec un projet et des agents déjà déployés :

```bash
az login
export Foundry__ProjectEndpoint="https://<compte>.services.ai.azure.com/api/projects/<projet>"
export Foundry__PlannerAgentName="recipe-planner"
export Foundry__ShopperAgentName="recipe-shopper"
dotnet run --project src/Zava.Api
```

Le compte local doit avoir le rôle d'invocation Foundry sur le projet. La variable `APPLICATIONINSIGHTS_CONNECTION_STRING`, facultative en local, active l'export de télémétrie ; ne pas publier sa valeur ni des jetons dans les logs ou dans Git.

Dans les journaux Application Insights, vérifier les résultats et les durées après avoir généré puis confirmé un panier :

```kusto
customEvents
| where name in ("RecipeBasketPlan", "RecipeBasketCommit")
| summarize appels=count(), dureeMoyenneMs=avg(todouble(customMeasurements.durationMs))
    by name, resultat=tostring(customDimensions.outcome), bin(timestamp, 15m)
```

La génération est bornée (deux requêtes simultanées, six par minute, quarante par heure, cent par jour par processus). Ces limites protègent le démonstrateur mais ne remplacent ni authentification, ni quotas persistants, ni budget Azure. Les paniers, aperçus et limites sont perdus au redémarrage. Avant toute exposition à des utilisateurs réels, ajouter une identité utilisateur, une persistance et une gouvernance des données envoyées au modèle.

Références Microsoft : [agents prompt](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-agent), [endpoints et versions d'agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/configure-agent), [rôles Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry), [régions et quotas](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions).

#### Déploiement Azure

Prérequis supplémentaires : Azure Developer CLI (`azd`), Azure CLI, Python 3, Docker, un abonnement avec quota pour le modèle et une identité autorisée à créer les ressources **et les attributions de rôles**. Le déploiement crée des ressources facturables. Ne pas réutiliser le nom d'un environnement de production pour un essai.

```bash
azd auth login
azd env new zava-recipes-dev
azd env set AZURE_LOCATION swedencentral
azd env set AZURE_AI_LOCATION eastus2
azd up
```

Les paramètres `AZURE_AI_MODEL_NAME`, `AZURE_AI_MODEL_VERSION`, `AZURE_AI_MODEL_SKU` et `AZURE_AI_MODEL_CAPACITY` permettent d'adapter le modèle au quota disponible. Le hook `postprovision` crée les versions des deux agents ; une définition inchangée ne crée pas de version supplémentaire. Un échec du hook interrompt le déploiement. Le hook `postdeploy` vérifie uniquement les endpoints de lecture : il ne prouve pas qu'une génération IA complète fonctionne.

Le workflow `.github/workflows/deploy.yml` utilise les secrets Azure existants et expose les mêmes paramètres de modèle comme variables de dépôt. Après déploiement, ouvrir l'URL `WEB_URI`, sélectionner **Alimentaire**, générer puis confirmer une recette et vérifier les événements Application Insights. Ce parcours en ligne nécessite les permissions Foundry et un quota réellement disponibles ; les tests avec réponses simulées ne le remplacent pas.

## Évaluation qualité et priorités

Le projet convient à une **démonstration de parcours e-commerce**, pas à une boutique réelle : panier et profil partagés, données en mémoire, absence d'authentification et paiement simulé. N'y saisissez ni données personnelles réelles ni coordonnées bancaires réelles.

Les corrections de cette évaluation ciblent la confiance dans le panier : modifier la bonne variante, éviter les quantités invalides, calculer les garanties côté serveur et rendre les échecs visibles plutôt que silencieux. Elles réduisent les erreurs de commande et les écarts de prix sur les garanties sans changer l'architecture du démonstrateur.

| Priorité | Suite recommandée | Valeur technique et métier |
|----------|-------------------|----------------------------|
| Haute, avant usage réel | Isoler les paniers par utilisateur, ajouter authentification/autorisation et persistance | Éviter le partage involontaire des commandes et la perte des données au redémarrage |
| Haute | Rendre les mutations et le checkout transactionnels, réserver/décrémenter le stock, rendre le paiement idempotent | Le verrou partagé sérialise les requêtes dans un processus, sans réservation persistante ni coordination entre instances ; prévenir survente et commandes en double |
| Haute | Aligner la remise complémentaire annoncée avec le prix facturé | L'offre cross-sell affiche actuellement une remise de 10 %, mais l'ajout standard utilise le prix catalogue/promotion ; éviter une promesse commerciale non tenue |
| Haute | Traiter les avis de sécurité des dépendances et exécuter les tests sur les PR | Les audits initiaux signalent des dépendances vulnérables ; les contrôles locaux du panier recette ne couvrent pas encore tous les parcours du site |
| Moyenne | Valider aussi création de produits, adresses et paiement côté serveur ; harmoniser les erreurs FR/EN | Améliorer la qualité des données et la compréhension des refus |
| Moyenne | Charger les pages, notamment les graphiques analytics, à la demande ; mesurer le parcours mobile | Le build initial charge environ 1,82 Mo de JavaScript (573 Ko gzip) dans un seul bundle ; réduire le coût d'entrée dans la boutique |
| Moyenne | Corriger les erreurs ESLint existantes et ajouter un contrôle build/lint avant déploiement | Détecter les régressions avant publication, sans désactiver les règles |

### Vérification

```bash
# Depuis la racine
dotnet build Zava.slnx
dotnet run --no-build --project tests/Zava.Api.RecipeChecks

cd src/Zava.Web
npm ci
npm run build
npm run lint
```

Les deux builds passent lors de l'évaluation. Le lint global signale neuf erreurs préexistantes dans les contextes et plusieurs pages ; les fichiers frontend modifiés passent leur lint ciblé. Le build .NET signale notamment l'avis [GHSA-v5pm-xwqc-g5wc](https://github.com/advisories/GHSA-v5pm-xwqc-g5wc) sur la dépendance transitive `Microsoft.OpenApi`. Les dépendances ne sont pas mises à jour dans cette correction fonctionnelle.

Pour vérifier le panier, démarrer l'API et exécuter dans l'ordre la section **Cart regression checks** de `src/Zava.Api/Zava.Api.http` avec un client HTTP compatible. Les statuts et invariants attendus figurent dans chaque requête. **Cette section réinitialise les données partagées du démonstrateur.**

La section **Recipe basket regression checks** du même fichier couvre les saisies invalides, les gammes, l'aperçu sans mutation, la confirmation répétée et l'invalidation après réinitialisation. Elle réinitialise également les données. Les scénarios positifs IA nécessitent de vrais agents déployés ; sans configuration, vérifier `available: false` et le refus explicite de génération, puis vérifier que l'ajout classique fonctionne toujours.

`tests/Zava.Api.RecipeChecks` exécute les contrôles HTTP locaux sur le port `5097`, avec une identité et des réponses Foundry explicitement simulées : aucun abonnement ni jeton réel n'est nécessaire. Il vérifie également les stocks, les variantes, l'ajout atomique et idempotent, le catalogue des trois gammes, les délais et les quotas.

Les contrôles navigateur existants se trouvent dans `tests/recipe-ui`. Avec Node.js 22+ et Chromium installés, lancer ces commandes dans des terminaux séparés depuis la racine :

```bash
node tests/recipe-ui/mock.mjs
VITE_API_BASE_URL=http://localhost:5185 npm --prefix src/Zava.Web run dev -- --host 127.0.0.1 --port 5186 --strictPort
chromium --headless --disable-gpu --disable-background-networking --remote-debugging-port=5187 --user-data-dir=/tmp/zava-recipe-browser http://localhost:5186
node tests/recipe-ui/check.mjs
```

Ces contrôles utilisent une API simulée sur le port `5185` pour tester les erreurs, les nouvelles tentatives, les confirmations et l'affichage mobile/FR/EN. Les captures sont écrites dans le dossier temporaire du système (`/tmp/zava-recipe-ui` sous Linux), jamais dans le dépôt. Arrêter les trois processus après les tests.

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
