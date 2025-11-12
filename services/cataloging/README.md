# CATALOGING

## Vue d'ensemble

Service de gestion du catalogue produits avec catégories et hiérarchies.

## Informations techniques

- **Port HTTP**: 9002
- **Base de données**: InMemory (cache)
- **OpenAPI**: `cataloging/catalog_service.yaml`

## Responsabilités

### Gestion du catalogue produits
- Création, modification et suppression de produits
- Gestion des informations produit (nom, description, prix)
- Gestion des variantes de produits

### Gestion des catégories
- Organisation en catégories et sous-catégories
- Hiérarchie de catégories
- Navigation dans l'arborescence

## API REST API

### Méthodes principales

#### Produits
- `CreateProduct(name, description, price, category_id)` - Création d'un produit
- `GetProduct(product_id)` - Récupération d'un produit
- `UpdateProduct(product_id, fields)` - Mise à jour d'un produit
- `DeleteProduct(product_id)` - Suppression d'un produit
- `ListProducts(filters, pagination)` - Liste des produits

#### Catégories
- `CreateCategory(name, parent_id)` - Création d'une catégorie
- `GetCategory(category_id)` - Récupération d'une catégorie
- `UpdateCategory(category_id, fields)` - Mise à jour d'une catégorie
- `DeleteCategory(category_id)` - Suppression d'une catégorie
- `GetCategoryTree()` - Arborescence complète

## Événements Kafka publiés

- `ProductCreated` - Produit créé
- `ProductUpdated` - Produit mis à jour
- `ProductDeleted` - Produit supprimé
- `PriceChanged` - Prix modifié
- `CategoryCreated` - Catégorie créée

## Événements Kafka consommés

- `StockCommitted` - Pour mettre à jour la disponibilité
- `OutOfStock` - Pour marquer un produit indisponible

## Communication avec autres services

### Synchrone (REST API)
- Appelé par **CARTING** pour récupérer les informations produit
- Appelé par **ADMINISTERING** pour la gestion du catalogue

### Asynchrone (Kafka)
- Consomme les événements de **STOCKING** pour la disponibilité

## Modèle de données

### Product
```JSON
interface Product {
  string: product_id = 1;
  string: name = 2;
  string: description = 3;
  number: price = 4;
  string: category_id = 5;
  boolean: available = 6;
  number: created_at = 7;
  number: updated_at = 8;
}
```

### Category
```JSON
interface Category {
  string: category_id = 1;
  string: name = 2;
  string: parent_id = 3; // null si catégorie racine
  number: level = 4;
}
```

## Configuration

- Port HTTP: `9002`
- Kafka broker: `localhost:9092`
- Topic Kafka: `catalog.events`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
