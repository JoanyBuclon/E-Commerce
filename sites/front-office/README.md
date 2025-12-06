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

#### CATALOGING (9002)

- Lister le catalogue
- Détails produit

#### ORDERING (9003)

- Création de commandes
- Historique des commandes
- Détails commande

#### PAYING (9004)

- Traitement du paiement
- (Simulation - toujours réussi)

#### SHIPPING (9005)

- Calcul des frais de port
- Suivi de livraison

## Fonctionnalités

### Authentification

- **Inscription** : Email + Password
- **Connexion** : Email + Password
- **Pas d'authentification forte** : Simple email/password suffisent
- Pas de 2FA, pas d'OAuth

### Catalogue

- Page d'accueil avec la liste des produits
- Recherche de produits (client side)
- Filtres (client side: prix, catégorie, disponibilité)
- Fiche produit détaillée

### Panier

- Ajout de produits au panier (client side)
- Modification des quantités
- Calcul automatique des totaux (TTC)

### Commande

1. Récapitulatif du panier
2. Saisie/Sélection des adresses (livraison + facturation)
3. Paiement (simulation)
4. Confirmation de commande

### Mon Compte

- Profil utilisateur
- Historique des commandes
- Détails d'une commande (suivi de la livraison)

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
  ORDERING: 'localhost:9003',
  PAYING: 'localhost:9004',
  SHIPPING: 'localhost:9005',
};
```

## Sécurité

### Authentification simple

- Email + Password stocké dans PROFILING
- Token JWT retourné après connexion
- Token envoyé dans les headers REST API

### Pas de HTTPS obligatoire en dev

- Communication REST API en clair acceptable en développement
- **Production** : TLS obligatoire

## Pages principales

- `/` - Page d'accueil, catalogue de produits
- `/product/:id` - Détail produit
- `/cart` - Panier
- `/checkout` - Tunnel de commande
- `/login` - Connexion
- `/register` - Inscription
- `/account` - Mon compte
- `/orders` - Mes commandes
- `/order/:id` - Détail commande
