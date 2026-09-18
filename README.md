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
2. Choisir une suggestion (lasagnes, blanquette de veau, carbonade, bœuf bourguignon, BBQ, repas végétarien, pizza) ou saisir un autre plat, le nombre de personnes et la gamme.
3. Générer la sélection, vérifier les produits, les paquets entiers, le total et les ingrédients manquants, puis confirmer l'ajout groupé. Une sélection incomplète est signalée ; elle n'est pas présentée comme une recette complète.

Les valeurs API des gammes sont `National`, `PrivateLabel`, `Economy` et `Mix`. Les trois premières filtrent le catalogue **côté serveur** grâce aux tags `brand:national`, `brand:private-label` et `brand:economy`. Les références Zava et Zava Essentiel et leurs prix sont des données de démonstration. Les 53 ingrédients de base disposent chacun de trois gammes ; une recette libre peut nécessiter des ingrédients non commercialisés. Les photos de ces ingrédients proviennent de Wikimedia Commons sous licence libre : l'attribution complète (fichier, licence, auteur) est listée dans [`Docs/image-credits.md`](Docs/image-credits.md).

Le premier agent décompose la recette en ingrédients et quantités ; le second associe ces ingrédients aux références réellement disponibles et à leurs conditionnements. Les réponses sont structurées et validées : aucun identifiant, prix ou stock inventé par le modèle n'est accepté. Les agents n'ont pas d'outil de paiement ni d'accès direct au panier.

Les schémas JSON stricts et l'effort de raisonnement sont enregistrés dans les **définitions des agents**. Une requête Responses utilisant `agent_reference` ne doit pas redéfinir `text` ni `reasoning` : Foundry rejette ces paramètres avec HTTP 400. Les tests vérifient ce contrat côté déploiement et côté client API.

Un aperçu expire après dix minutes et devient invalide après réinitialisation ou changement de boutique. La confirmation revérifie le catalogue et les stocks, conserve les variantes et ajoute tout ou rien. Réessayer la même confirmation pendant sa validité ne double pas les quantités. Les estimations culinaires restent des suggestions : vérifier les portions, les substitutions et les allergènes sur les emballages.

Sans configuration Foundry, l'interface explique l'indisponibilité de l'assistant et le panier classique reste utilisable. Il n'existe pas de simulation IA cachée ni de repli vers un modèle local.

#### Microsoft Foundry et monitoring

L'infrastructure utilise un compte **Microsoft Foundry** (`AIServices`, projets activés), un projet et un déploiement **GPT-5 mini**, pas un hub Foundry classique. Deux agents prompt persistants, `recipe-planner` et `recipe-shopper`, sont déployés dans Agent Service. L'API les sélectionne via `agent_reference` sur l'API Responses du projet :

```text
https://<compte>.services.ai.azure.com/api/projects/<projet>/openai/v1/responses
```

L'authentification utilise Microsoft Entra ID et l'identité managée de Container Apps, sans clé de modèle dans le navigateur. Application Insights, lié à Log Analytics, reçoit la télémétrie de l'API. Les événements applicatifs `RecipeBasketPlan` et `RecipeBasketCommit` décrivent le résultat et, pour la génération, la durée ; ils n'enregistrent pas le texte de la recette.

Les traces natives des agents Foundry sont facultatives (`AZURE_AI_ENABLE_TRACING=false` par défaut). Activer cette option crée une connexion du projet à Application Insights ; ces traces peuvent enregistrer les prompts et réponses. Ne l'activer qu'après avoir défini les règles de confidentialité, d'accès et de rétention appropriées.

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
azd up
```

Sweden Central est la région par défaut pour l'application **et** pour Foundry. Si le modèle, sa version ou son SKU n'y sont pas disponibles pour votre abonnement, déporter uniquement Foundry avec `azd env set AZURE_AI_LOCATION <région>` ; le reste des ressources demeure dans `AZURE_LOCATION`.

Les paramètres `AZURE_AI_MODEL_NAME`, `AZURE_AI_MODEL_VERSION`, `AZURE_AI_MODEL_SKU` et `AZURE_AI_MODEL_CAPACITY` permettent d'adapter le modèle au quota disponible. L'agent `recipe-shopper` envoie l'intégralité du catalogue alimentaire dans une seule invite : une capacité trop faible (10 unités, soit 10 000 jetons par minute) provoque une réponse `429` et l'assistant recettes renvoie alors une erreur 503. La valeur par défaut est donc `100` ; la réduire uniquement si le quota de l'abonnement l'impose. Le runtime utilise un effort de raisonnement `low` : le modèle choisi doit prendre en charge ce paramètre et les sorties JSON structurées. Les hooks `postprovision` et `predeploy` créent les versions des deux agents ; une définition inchangée ne crée pas de version supplémentaire. Un échec du hook interrompt le déploiement. Le hook `postdeploy` vérifie uniquement les endpoints de lecture : il ne prouve pas qu'une génération IA complète fonctionne.

Le hook `preprovision` conserve les images en cours dans `SERVICE_API_IMAGE_NAME` et `SERVICE_WEB_IMAGE_NAME` : une mise à jour d'infrastructure ne remplace ainsi pas une application existante par l'image d'accueil Azure. Avec un déploiement Bicep direct, renseigner les paramètres `apiContainerImage` et `webContainerImage` à partir des applications existantes. L'API reste sur **une instance toujours active** (`minReplicas=maxReplicas=1`) : plusieurs instances ne peuvent pas partager les paniers et aperçus conservés en mémoire. Un redéploiement ou redémarrage perd toujours cet état ; obtenir l'accord des utilisateurs avant l'opération.

Les Dockerfiles utilisent .NET 10 stable, `NuGet.Config` et `.npmrc`, avec les flux CFS protégés. Le frontend utilise `npm ci` et un lockfile dont toutes les URL de paquets pointent vers CFS. Ne pas activer `replace-registry-host=always` avec ces URL déjà réécrites : npm peut doubler le segment `/npm/`. Les contrôles de déploiement vérifient ce contrat en CI.

Sous Windows, les hooks utilisent PowerShell et `python`. Pour employer explicitement l'identité Azure CLI plutôt que celle d'`azd`, définir `RECIPE_TOKEN_PROVIDER=az` et `AZURE_SUBSCRIPTION_ID` dans le processus qui lance le script. Cela évite de sélectionner une identité d'un autre tenant lorsque les deux CLI sont connectés à des comptes différents.

Le workflow `.github/workflows/deploy.yml` s'authentifie avec des secrets de dépôt, selon deux modes exclusifs :

| Mode | Secrets requis | Remarques |
|------|----------------|-----------|
| Identité fédérée OIDC (recommandé) | `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` | Aucun secret client stocké ; nécessite une *federated credential* sur l'application Entra, limitée à ce dépôt et à sa branche |
| Secret client | `AZURE_CREDENTIALS` (JSON `clientId`/`clientSecret`/`tenantId`), `AZURE_SUBSCRIPTION_ID` | Utilisé seulement si `AZURE_CLIENT_ID` est absent ; le secret expire et doit être renouvelé |

L'identité doit pouvoir créer les ressources et gérer les attributions **Azure AI User sur le projet Foundry**. Le rôle Contributor seul ne permet pas ces attributions. Un administrateur peut amorcer l'infrastructure, puis appliquer séparément `infra/bootstrap-ci-access.bicep` au groupe existant avec `accountName` et `ciPrincipalId` (ID objet du principal GitHub). Ce fichier accorde une délégation RBAC limitée au projet ; sa condition restreint la création et la suppression d'attributions au seul rôle Azure AI User. Ne pas donner Owner sur l'abonnement pour résoudre cette erreur. Cette opération d'administration nécessite une approbation explicite et n'est pas exécutée par le workflow CI.

`azd` résout lui-même `AZURE_PRINCIPAL_ID` à partir de l'identité connectée, afin de lui accorder le rôle Foundry nécessaire à la création des agents. Les paramètres de modèle et de région sont exposés comme variables de dépôt (`AZURE_LOCATION`, `AZURE_AI_LOCATION`, `AZURE_AI_MODEL_*`) et conservent leurs valeurs par défaut si elles ne sont pas définies.

Après déploiement, ouvrir l'URL `WEB_URI`, sélectionner **Alimentaire**, générer puis confirmer une recette et vérifier les événements Application Insights. Ce parcours en ligne nécessite les permissions Foundry et un quota réellement disponibles ; les tests avec réponses simulées ne le remplacent pas.

Pour un contrôle reproductible avec les vrais agents, exécuter `python scripts/check-recipe-basket.py --api-uri https://<URL-du-site> --recipe Lasagnes --brand Mix`. Il vérifie les prix du catalogue, les quantités entières, le total et l'absence de mutation du panier pendant l'aperçu. Ajouter `--commit` uniquement après accord du propriétaire du démonstrateur : il ajoute réellement les produits, puis confirme à nouveau le même aperçu pour vérifier l'absence de doublon. Il ne change pas de boutique, ne réinitialise aucune donnée et ne passe aucune commande.

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

`tests/Zava.Api.RecipeChecks` exécute les contrôles HTTP locaux sur le port `5097`, avec une identité et des réponses Foundry explicitement simulées : aucun abonnement ni jeton réel n'est nécessaire. Il vérifie également les stocks, les variantes, l'ajout atomique et idempotent, le catalogue des trois gammes, les délais et les quotas, ainsi que la validation des exclusions (`excludedProductIds` au plan, `excludedItems` à la confirmation) et le refus d'une sélection entièrement vidée.

Les contrôles navigateur existants se trouvent dans `tests/recipe-ui`. Avec Node.js 22+ et Chrome installés, utiliser les commandes PowerShell suivantes depuis la racine. Choisir un dossier d'artefacts dédié, hors du dépôt, et un profil de navigateur distinct de votre profil habituel :

```powershell
# Terminal 1 : API simulée uniquement
node tests\recipe-ui\mock.mjs

# Terminal 2 : build de production pointant exclusivement vers l'API simulée
$env:VITE_API_BASE_URL = 'http://localhost:5185'
npm --prefix src\Zava.Web run build
npm --prefix src\Zava.Web run preview -- --host 127.0.0.1 --port 5186 --strictPort

# Terminal 3 : remplacer ce chemin par votre dossier d'artefacts
$env:RECIPE_UI_ARTIFACTS_DIR = 'C:\test-artifacts\zava-recipe-ui'
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless --disable-gpu --disable-background-networking --no-first-run --remote-debugging-port=5187 "--user-data-dir=$env:RECIPE_UI_ARTIFACTS_DIR\browser" about:blank

# Terminal 4 : reprendre le même dossier d'artefacts
$env:RECIPE_UI_ARTIFACTS_DIR = 'C:\test-artifacts\zava-recipe-ui'
node tests\recipe-ui\check.mjs
```

Ces contrôles utilisent une API simulée sur le port `5185` pour tester les erreurs, les nouvelles tentatives, les confirmations et l'affichage mobile/FR/EN. Ils couvrent aussi le retrait d'un produit de la sélection vers le cartouche « Produits non sélectionnés », sa remise dans la sélection, la confirmation partielle (`excludedItems` transmis à l'API), l'option « Ne plus proposer ce produit » dans ses deux portées, session et définitive (`excludedProductIds` transmis à la préparation), ainsi que les offres post-confirmation Carbonade/Instant Pot et BBQ/barbecue avec l'option « Ne plus me proposer ce choix ». L'API simulée accumule ses appels et son panier pour toute la durée du processus : la relancer avant chaque exécution de `check.mjs`. `RECIPE_UI_ARTIFACTS_DIR` est obligatoire : les captures sont écrites uniquement dans le dossier choisi. Le dossier `dist` produit ici cible le mock et ne doit pas être déployé ; reconstruire avec la configuration de l'environnement réel avant publication. Chrome peut être remplacé par Chromium ou Edge en adaptant le chemin de l'exécutable. Arrêter les trois processus après les tests. Sous 600 px, l'en-tête n'affiche que l'icône de l'enseigne (le nom reste disponible pour les lecteurs d'écran) afin d'éviter tout débordement horizontal.

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
