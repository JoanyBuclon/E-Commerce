# Front-Office E-Commerce

## Vue d'ensemble

Application front-end pour les clients de la plateforme e-commerce construite avec **SvelteKit 2**, **TypeScript** et **Tailwind CSS 4**.

## Quick Start

### Development (Local)

```bash
cd front-office-example
npm install
npm run dev
```

Accès: `http://localhost:5173`

### Production (Docker)

**Option 1: Container Docker autonome**

```bash
cd front-office-example

# Build
docker build -t front-office:latest .

# Run
docker run -p 9000:3000 front-office:latest
```

Accès: `http://localhost:9000`

**Option 2: Docker Compose (depuis la racine du projet)**

```bash
# Build et démarrage
docker compose up -d front-office

# Logs
docker compose logs -f front-office

# Arrêt
docker compose down front-office
```

Ensuite, mettez à jour `traefik/dynamic.yml` pour pointer vers `http://front-office:3000` et accédez via Traefik à `http://localhost`

**Documentation complète:** Voir [DOCKER.md](./front-office-example/DOCKER.md)

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

### Framework

- **SvelteKit 2** - Framework full-stack avec SSR et routing
- **Svelte 5** - Avec Svelte runes ($state, $derived, $effect)
- **TypeScript** - Type safety complet
- **Vite 7** - Build tool rapide et moderne

### Communication REST API

- **fetch** native pour les appels REST API
- Services singleton avec dual-mode (mock/real API)
- Type-safe avec interfaces TypeScript complètes

### State Management

- **Svelte stores** pour le state global (authStore, cartStore)
- State réactif natif avec Svelte runes
- Gestion du panier côté client (localStorage)
- Gestion de l'authentification avec JWT

### UI/UX

- **Tailwind CSS 4** - Utility-first CSS framework
- **Design responsive** - Mobile-first approach
- **Accessibilité** - ARIA labels et keyboard navigation

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
