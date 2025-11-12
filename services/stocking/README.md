# STOCKING

## Vue d'ensemble

Service de gestion des stocks avec système de réservation et alertes de rupture.

## Informations techniques

- **Port HTTP**: 9003
- **Base de données**: InMemory (avec row-level locking)
- **Proto**: `stocking/stock_service.yaml`

## Responsabilités

### Gestion des stocks
- Suivi des quantités disponibles par produit
- Mise à jour des stocks lors des réceptions
- Gestion multi-entrepôts (si applicable)

### Alertes de rupture
- Détection automatique des stocks faibles
- Alertes de rupture de stock
- Notifications aux administrateurs

### Réservations
- Réservation temporaire lors de l'ajout au panier
- Libération des réservations expirées
- Commit définitif lors de la validation de commande

## API REST API

### Méthodes principales

- `CheckAvailability(product_id, quantity)` - Vérification de disponibilité
- `ReserveStock(product_id, quantity, ttl)` - Réservation temporaire
- `ReleaseReservation(reservation_id)` - Libération d'une réservation
- `CommitStock(reservation_id, order_id)` - Commit définitif
- `GetStock(product_id)` - Récupération du stock
- `UpdateStock(product_id, quantity)` - Mise à jour du stock
- `AdjustStock(product_id, adjustment, reason)` - Ajustement manuel

## Événements Kafka publiés

- `StockReserved` - Stock réservé temporairement
- `StockReleased` - Réservation libérée
- `StockCommitted` - Réservation confirmée définitivement
- `LowStockAlert` - Alerte stock faible
- `OutOfStock` - Rupture de stock
- `StockAdjusted` - Ajustement de stock

## Événements Kafka consommés

- `CartItemAdded` - Pour réserver le stock
- `CartItemRemoved` - Pour libérer le stock
- `CartItemUpdated` - Pour ajuster la réservation
- `CartAbandoned` - Pour libérer le stock
- `OrderConfirmed` - Pour commit définitif

## Communication avec autres services

### Synchrone (REST API)
- Appelé par **CARTING** pour vérifier la disponibilité
- Appelé par **ORDERING** pour commit du stock

### Asynchrone (Kafka)
- Consomme les événements de **CARTING** pour les réservations
- Publie vers **CATALOGING**, **ORDERING**, **ADMINISTERING**

## Modèle de données

### Stock
```JSON
interface Stock {
  string: product_id = 1;
  number: available_quantity = 2;
  number: reserved_quantity = 3;
  number: committed_quantity = 4;
  number: low_stock_threshold = 5;
  number: updated_at = 6;
}
```

### Reservation
```JSON
interface Reservation {
  string: reservation_id = 1;
  string: product_id = 2;
  number: quantity = 3;
  number: expires_at = 4; // TTL
  string: status = 5; // PENDING, COMMITTED, RELEASED
}
```

## Configuration

- Port HTTP: `9003`
- Kafka broker: `localhost:9092`
- Topic Kafka: `stock.events`
- TTL réservation par défaut: `15 minutes`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
