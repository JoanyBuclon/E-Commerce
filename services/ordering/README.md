# ORDERING

## Vue d'ensemble

Service de gestion du cycle de vie des commandes et orchestration du processus d'achat.

## Informations techniques

- **Port HTTP**: 9005
- **Base de données**: InMemory
- **Proto**: `ordering/order_service.yaml`

## Responsabilités

### Gestion des commandes
- Création de commandes à partir du panier
- Suivi du statut des commandes
- Historique des commandes par utilisateur
- Gestion des retours

### Orchestration
- Coordination du processus de commande (Saga pattern)
- Gestion des transitions d'état
- Gestion des erreurs et compensations

## API REST API

### Méthodes principales

- `CreateOrder(cart_id, user_id, shipping_address, billing_address, payment_method)` - Création
- `GetOrder(order_id)` - Récupération d'une commande
- `ListOrders(user_id, filters)` - Liste des commandes
- `UpdateOrderStatus(order_id, status)` - Mise à jour du statut
- `CancelOrder(order_id, reason)` - Annulation
- `RequestReturn(order_id, items, reason)` - Demande de retour

## Événements Kafka publiés

- `OrderCreated` - Commande créée
- `OrderConfirmed` - Commande confirmée (après paiement)
- `OrderCancelled` - Commande annulée
- `OrderShipped` - Commande expédiée
- `OrderDelivered` - Commande livrée
- `OrderCompleted` - Commande terminée
- `ReturnRequested` - Retour demandé
- `OrderStatusChanged` - Statut modifié

## Événements Kafka consommés

- `PaymentSucceeded` - Pour confirmer la commande
- `PaymentFailed` - Pour annuler la commande
- `ShipmentCreated` - Pour mettre à jour le statut
- `ShipmentDelivered` - Pour marquer comme livré
- `ReturnApproved` - Pour traiter le retour

## Communication avec autres services

### Synchrone (REST API)
- Appelle **CARTING** pour récupérer le panier
- Appelle **STOCKING** pour commit du stock
- Appelle **SHIPPING** pour calculer les frais
- Appelé par **PAYING** pour récupérer les détails
- Appelé par **BILLING** pour récupérer les détails

### Asynchrone (Kafka)
- Orchestre le flux de commande via événements
- Consomme les événements de paiement et expédition

## Modèle de données

### Order
```JSON
interface Order {
  string: order_id = 1;
  string: user_id = 2;
  string: cart_id = 3;
  array: OrderItem items = 4;
  Address shipping_address = 5;
  Address billing_address = 6;
  string: payment_method = 7;
  number: subtotal = 8;
  number: tax = 9;
  number: shipping_cost = 10;
  number: total = 11;
  string: status = 12; // CREATED, CONFIRMED, SHIPPED, DELIVERED, COMPLETED, CANCELLED
  number: created_at = 13;
  number: updated_at = 14;
}
```

### OrderItem
```JSON
interface OrderItem {
  string: product_id = 1;
  string: product_name = 2;
  number: unit_price = 3;
  number: quantity = 4;
  number: subtotal = 5;
}
```

## Configuration

- Port HTTP: `9005`
- Kafka broker: `localhost:9092`
- Topic Kafka: `order.events`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
