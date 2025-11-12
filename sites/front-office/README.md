# Front-Office E-Commerce

## Vue d'ensemble

Application front-end pour les clients de la plateforme e-commerce.

## Architecture

### Communication avec les microservices

L'application front-office communique **directement** avec les microservices via REST API.

**Pas de Gateway API** - Les appels sont faits directement depuis le navigateur vers les services.

### Services utilisés

Le front-office communique avec les services suivants :

#### PROFILING (9001)
- Inscription / Connexion
- Gestion du profil utilisateur
- Gestion des adresses

#### CATALOGING (9002)
- Navigation dans le catalogue
- Recherche de produits
- Détails produit

#### STOCKING (9003)
- Vérification de disponibilité
- Affichage du stock disponible

#### CARTING (9004)
- Gestion du panier
- Ajout/Retrait d'articles
- Calcul des totaux

#### ORDERING (9005)
- Création de commandes
- Suivi des commandes
- Historique des commandes

#### PAYING (9006)
- Traitement du paiement
- (Simulation - toujours réussi)

#### SHIPPING (9008)
- Calcul des frais de port
- Suivi de livraison

## Fonctionnalités

### Authentification
- **Inscription** : Email + Password
- **Connexion** : Email + Password
- **Pas d'authentification forte** : Simple email/password suffit
- Pas de 2FA, pas d'OAuth

### Catalogue
- Navigation par catégories
- Recherche de produits
- Filtres (prix, catégorie, disponibilité)
- Fiche produit détaillée

### Panier
- Ajout de produits
- Modification des quantités
- Calcul automatique des totaux (TTC)
- Validation de disponibilité en temps réel

### Commande
1. Récapitulatif du panier
2. Saisie/Sélection des adresses (livraison + facturation)
3. Choix du transporteur
4. Paiement (simulation)
5. Confirmation de commande

### Mon Compte
- Profil utilisateur
- Historique des commandes
- Suivi des livraisons
- Gestion des adresses

## Stack technique

### Framework suggéré
- **React** ou **Vue.js** ou **Angular**
- **TypeScript** recommandé

### Communication REST API
- **fetch/axios** pour les appels REST API depuis le navigateur
- Génération des clients à partir des fichiers `.yaml`

### State Management
- Redux / Vuex / NgRx selon le framework
- Gestion du state du panier
- Gestion de l'authentification

### UI/UX
- Framework CSS (Tailwind, Material-UI, etc.)
- Responsive design
- Progressive Web App (optionnel)

## Configuration des services

```typescript
// config/services.ts
export const SERVICES = {
  PROFILING: 'localhost:9001',
  CATALOGING: 'localhost:9002',
  STOCKING: 'localhost:9003',
  CARTING: 'localhost:9004',
  ORDERING: 'localhost:9005',
  PAYING: 'localhost:9006',
  SHIPPING: 'localhost:9008',
};
```

## Flux utilisateur principal

### 1. Inscription / Connexion
```
User → PROFILING.CreateUser() ou PROFILING.AuthenticateUser()
```

### 2. Navigation catalogue
```
User → CATALOGING.ListProducts()
User → CATALOGING.GetProduct(product_id)
```

### 3. Ajout au panier
```
User → CARTING.AddItem(cart_id, product_id, quantity)
     ↓
CARTING → STOCKING.CheckAvailability()
CARTING → CATALOGING.GetProduct()
```

### 4. Validation commande
```
User → ORDERING.CreateOrder(cart_id, addresses, payment_method)
     ↓
ORDERING → CARTING.GetCart()
ORDERING → SHIPPING.CalculateRates()
     ↓ (événement Kafka)
ORDERING publishes OrderCreated
     ↓
PAYING traite automatiquement (succès)
PAYING publishes PaymentSucceeded
     ↓
ORDERING confirme la commande
```

## Sécurité

### Authentification simple
- Email + Password stocké dans PROFILING
- Token JWT retourné après connexion
- Token envoyé dans les headers REST API

### Pas de HTTPS obligatoire en dev
- Communication REST API en clair acceptable en développement
- **Production** : TLS obligatoire

## Installation

```bash
# TODO: Commandes d'installation
npm install
```

## Développement

```bash
# TODO: Commandes de développement
npm run dev
```

## Build

```bash
# TODO: Commandes de build
npm run build
```

## Génération des clients REST API

```bash
# Génération des clients à partir des .yaml
# TODO: Script de génération
./scripts/generate-rest-clients.sh
```

## Tests

```bash
# TODO: Commandes de test
npm test
```

## Structure des dossiers suggérée

```
front-office/
├── src/
│   ├── components/        # Composants UI
│   ├── pages/            # Pages
│   ├── services/         # clients REST API
│   ├── store/            # State management
│   ├── utils/            # Utilitaires
│   └── openapi/            # Fichiers .yaml générés
├── public/
└── package.json
```

## Pages principales

- `/` - Page d'accueil
- `/catalog` - Catalogue de produits
- `/product/:id` - Détail produit
- `/cart` - Panier
- `/checkout` - Tunnel de commande
- `/login` - Connexion
- `/register` - Inscription
- `/account` - Mon compte
- `/orders` - Mes commandes
- `/order/:id` - Détail commande
