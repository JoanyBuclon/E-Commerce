# Back-Office E-Commerce

## Vue d'ensemble

Application d'administration pour la gestion de la plateforme e-commerce.

## Architecture

### Communication avec les microservices

L'application back-office communique **directement** avec les microservices via REST API.

### Services accessibles au backoffice

- **CATALOGING** - Affichage du catalogue, Ajout de produits
- **ORDERING** - Liste des commandes, modification du statut s'une commande
- **SHIPPING** - Liste des livraisons, modification du statut de livraison

## Fonctionnalités

### Authentification Admin

- **Connexion** : Email + Password
- Accès restreint aux administrateurs
- Pas de self-registration

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

### Communication REST API

- **fetch/axios** pour les appels REST API depuis le navigateur

### State Management

- Redux / Vuex / NgRx selon le framework
- Gestion de l'authentification admin
- Cache des données

### UI/UX

- Framework CSS admin-friendly (Ant Design, Material-UI, etc.)
- Tableaux de données
- Formulaires complexes
- Dashboards

## Sécurité

### Authentification Admin

- Email + Password
- Token JWT avec rôle ADMIN
- Vérification du rôle sur chaque requête

### Permissions

- Accès complet pour les admins
- Pas de granularité de permissions dans cette version

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
