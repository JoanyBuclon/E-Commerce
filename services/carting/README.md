# CARTING

## Vue d'ensemble

Service de gestion du panier d'achat avec calcul des totaux et gestion des sessions.

## Informations techniques

- **Port HTTP**: 9004
- **Base de données**: InMemory (sessions)
- **Proto**: `carting/cart_service.yaml`

## Responsabilités

### Gestion du panier
- Ajout, modification, suppression d'articles
- Calcul des totaux (sous-total, taxes, total)
- Gestion des paniers anonymes et authentifiés
- Persistance temporaire du panier

### Calcul des prix
- Calcul du sous-total
- Application des taxes
- Calcul du total final

## API REST API

### Méthodes principales

- `CreateCart(user_id?)` - Création d'un panier
- `GetCart(cart_id)` - Récupération d'un panier
- `AddItem(cart_id, product_id, quantity)` - Ajout d'un article
- `UpdateItem(cart_id, product_id, quantity)` - Mise à jour quantité
- `RemoveItem(cart_id, product_id)` - Retrait d'un article
- `ClearCart(cart_id)` - Vider le panier
- `Checkout(cart_id)` - Validation du panier

## Événements Kafka publiés

- `CartCreated` - Panier créé
- `CartItemAdded` - Article ajouté
- `CartItemRemoved` - Article retiré
- `CartItemUpdated` - Quantité modifiée
- `CartAbandoned` - Panier abandonné (TTL expiré)
- `CartCheckedOut` - Panier validé

## Événements Kafka consommés

- `ProductUpdated` - Pour mettre à jour les prix
- `PriceChanged` - Pour recalculer le total
- `ProductDeleted` - Pour retirer du panier

## Communication avec autres services

### Synchrone (REST API)
- Appelle **CATALOGING** pour récupérer les infos produit
- Appelle **STOCKING** pour vérifier la disponibilité
- Appelé par **ORDERING** pour récupérer le panier

### Asynchrone (Kafka)
- Publie les événements de panier
- Consomme les événements de produit

## Modèle de données

### Cart
```JSON
interface Cart {
  string: cart_id = 1;
  string: user_id = 2; // null si anonyme
  array: CartItem items = 3;
  number: subtotal = 4;
  number: tax = 5;
  number: total = 6;
  number: created_at = 7;
  number: updated_at = 8;
  number: expires_at = 9; // TTL 7 jours
}
```

### CartItem
```JSON
interface CartItem {
  string: product_id = 1;
  string: product_name = 2;
  number: unit_price = 3;
  number: quantity = 4;
  number: subtotal = 5;
}
```

## Configuration

- Port HTTP: `9004`
- Kafka broker: `localhost:9092`
- Topic Kafka: `cart.events`
- TTL panier: `7 jours`
- Taux de taxe: `20%`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
