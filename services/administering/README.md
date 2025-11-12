# ADMINISTERING

## Vue d'ensemble

Service de back-office pour la gestion administrative de la plateforme e-commerce.

## Informations techniques

- **Port HTTP**: 9009
- **Base de données**: InMemory
- **OpenAPI**: `administering/admin_service.yaml`

## Responsabilités

### Back-office de gestion
- Ajout de vendeurs
- Ajout et modification de produits
- Gestion du catalogue via interface admin
- Vue d'ensemble des commandes

### Paramètres système
- Configuration de la plateforme
- Gestion des paramètres globaux
- Configuration des taxes
- Configuration des transporteurs

## API REST API

### Méthodes principales

#### Vendeurs
- `CreateVendor(name, email, company)` - Ajout d'un vendeur
- `GetVendor(vendor_id)` - Récupération d'un vendeur
- `ListVendors(filters)` - Liste des vendeurs
- `UpdateVendor(vendor_id, fields)` - Mise à jour
- `DeleteVendor(vendor_id)` - Suppression

#### Produits (via CATALOGING)
- `AdminCreateProduct(...)` - Création produit (appelle CATALOGING)
- `AdminUpdateProduct(...)` - Mise à jour produit
- `AdminDeleteProduct(...)` - Suppression produit

#### Commandes
- `ListAllOrders(filters, pagination)` - Liste de toutes les commandes
- `GetOrderDetails(order_id)` - Détails d'une commande
- `DispatchOrder(order_id, carrier)` - Expédier une commande

#### Paramètres
- `GetSettings()` - Récupération des paramètres
- `UpdateSettings(settings)` - Mise à jour des paramètres

## Événements Kafka publiés

- `SettingsUpdated` - Paramètres mis à jour
- `VendorCreated` - Vendeur créé
- `VendorUpdated` - Vendeur mis à jour

## Événements Kafka consommés

- `LowStockAlert` - Pour alerter les admins
- `OutOfStock` - Pour gestion des ruptures
- `ReturnRequested` - Pour traiter les retours
- `ShipmentException` - Pour gérer les problèmes d'expédition

## Communication avec autres services

### Synchrone (REST API)
- Appelle **CATALOGING** pour la gestion du catalogue
- Appelle **ORDERING** pour la liste des commandes
- Appelle **SHIPPING** pour dispatch des colis
- Appelle **STOCKING** pour ajustements de stock

### Asynchrone (Kafka)
- Consomme les alertes et événements système
- Publie les changements de configuration

## Modèle de données

### Vendor
```JSON
interface Vendor {
  string: vendor_id = 1;
  string: name = 2;
  string: email = 3;
  string: company = 4;
  string: status = 5; // ACTIVE, INACTIVE
  number: created_at = 6;
}
```

### Settings
```JSON
interface Settings {
  number: default_tax_rate = 1;
  string: default_currency = 2;
  array: string: available_carriers = 3;
  map<string, string> custom_settings = 4;
}
```

## Interface d'administration

Ce service expose les APIs utilisées par le **back-office** pour :
- Gérer les vendeurs
- Gérer le catalogue produits
- Voir et gérer les commandes
- Expédier les commandes
- Configurer la plateforme

## Configuration

- Port HTTP: `9009`
- Kafka broker: `localhost:9092`
- Topic Kafka: `admin.events`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
