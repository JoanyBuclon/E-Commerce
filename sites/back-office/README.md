# Back-Office E-Commerce

## Vue d'ensemble

Application d'administration pour la gestion de la plateforme e-commerce.

## Architecture

### Communication avec les microservices

L'application back-office communique **directement** avec le service **ADMINISTERING** (9009) qui orchestre les appels aux autres services.

### Service principal

#### ADMINISTERING (9009)
- Point d'entrée unique pour le back-office
- Gestion des vendeurs
- Gestion du catalogue
- Vue d'ensemble des commandes
- Expédition des commandes
- Configuration système

### Services indirectement accessibles via ADMINISTERING

- **CATALOGING** (via ADMINISTERING) - Gestion du catalogue
- **STOCKING** (via ADMINISTERING) - Ajustements de stock
- **ORDERING** (via ADMINISTERING) - Liste des commandes
- **SHIPPING** (via ADMINISTERING) - Dispatch des colis

## Fonctionnalités

### Authentification Admin
- **Connexion** : Email + Password
- Accès restreint aux administrateurs
- Pas de self-registration

### Gestion des vendeurs
- Ajout de nouveaux vendeurs
- Modification des informations vendeur
- Désactivation de vendeurs
- Liste des vendeurs

### Gestion du catalogue
- **Ajout de produits**
  - Nom, description, prix
  - Catégorie
  - Stock initial
- **Modification de produits**
  - Mise à jour des informations
  - Changement de prix
  - Modification du stock
- **Suppression de produits**
- **Gestion des catégories**
  - Création de catégories
  - Hiérarchie de catégories

### Gestion des commandes
- **Vue d'ensemble**
  - Liste de toutes les commandes
  - Filtres par statut, date, client
  - Recherche par numéro de commande
- **Détails commande**
  - Informations client
  - Articles commandés
  - Statut de paiement
  - Statut d'expédition
- **Expédition**
  - Marquer comme "en préparation"
  - Sélection du transporteur
  - Dispatch (envoi)
  - Génération d'étiquette

### Gestion des stocks
- Vue du stock par produit
- Ajustements manuels de stock
- Alertes de rupture de stock
- Historique des mouvements

### Paramètres système
- Configuration des taxes
- Configuration des transporteurs
- Paramètres globaux de la plateforme

## Stack technique

### Framework suggéré
- **React** ou **Vue.js** ou **Angular**
- **TypeScript** recommandé

### Communication gRPC
- **grpc-web** pour les appels gRPC depuis le navigateur
- Communication principalement avec **ADMINISTERING:9009**

### State Management
- Redux / Vuex / NgRx selon le framework
- Gestion de l'authentification admin
- Cache des données

### UI/UX
- Framework CSS admin-friendly (Ant Design, Material-UI, etc.)
- Tableaux de données
- Formulaires complexes
- Dashboards

## Configuration des services

```typescript
// config/services.ts
export const SERVICES = {
  ADMINISTERING: 'localhost:9009',
};

// Tous les appels passent par ADMINISTERING
```

## Flux administrateur principal

### 1. Connexion Admin
```
Admin → ADMINISTERING.AdminLogin(email, password)
```

### 2. Ajout d'un vendeur
```
Admin → ADMINISTERING.CreateVendor(name, email, company)
```

### 3. Ajout d'un produit
```
Admin → ADMINISTERING.AdminCreateProduct(...)
      ↓
ADMINISTERING → CATALOGING.CreateProduct(...)
ADMINISTERING → STOCKING.UpdateStock(...)
```

### 4. Vue des commandes
```
Admin → ADMINISTERING.ListAllOrders(filters)
```

### 5. Expédition d'une commande
```
Admin → ADMINISTERING.DispatchOrder(order_id, carrier)
      ↓
ADMINISTERING → SHIPPING.DispatchShipment(shipment_id)
      ↓ (événement Kafka)
SHIPPING publishes ShipmentDispatched
```

## Sécurité

### Authentification Admin
- Email + Password
- Token JWT avec rôle ADMIN
- Vérification du rôle sur chaque requête

### Permissions
- Accès complet pour les admins
- Pas de granularité de permissions dans cette version

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

## Génération des clients gRPC

```bash
# Génération des clients à partir des .proto
# TODO: Script de génération
./scripts/generate-grpc-clients.sh
```

## Tests

```bash
# TODO: Commandes de test
npm test
```

## Structure des dossiers suggérée

```
back-office/
├── src/
│   ├── components/        # Composants UI
│   ├── pages/            # Pages
│   │   ├── vendors/      # Gestion vendeurs
│   │   ├── products/     # Gestion produits
│   │   ├── orders/       # Gestion commandes
│   │   └── settings/     # Paramètres
│   ├── services/         # Clients gRPC
│   ├── store/            # State management
│   ├── utils/            # Utilitaires
│   └── proto/            # Fichiers .proto générés
├── public/
└── package.json
```

## Pages principales

- `/` - Dashboard
- `/login` - Connexion admin
- `/vendors` - Liste des vendeurs
- `/vendors/new` - Ajout vendeur
- `/vendors/:id` - Détail vendeur
- `/products` - Liste des produits
- `/products/new` - Ajout produit
- `/products/:id/edit` - Modification produit
- `/orders` - Liste des commandes
- `/orders/:id` - Détail commande
- `/stocks` - Vue des stocks
- `/settings` - Paramètres système

## Dashboard

### KPIs affichés
- Nombre de commandes du jour
- Chiffre d'affaires du jour
- Nombre de commandes en attente d'expédition
- Alertes de rupture de stock
- Nombre de vendeurs actifs

## Notes importantes

⚠️ **Sécurité** : Dans une vraie application, il faudrait :
- Authentification forte pour les admins
- Audit trail de toutes les actions admin
- Granularité des permissions
- 2FA obligatoire

⚠️ **Scalabilité** : Pour une grosse volumétrie :
- Pagination obligatoire sur toutes les listes
- Filtres et recherche avancée
- Export des données
