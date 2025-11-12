# PAYING

## Vue d'ensemble

Service de traitement des paiements avec gestion des remboursements.

## Informations techniques

- **Port gRPC**: 9006
- **Base de données**: InMemory (ACID)
- **Proto**: `paying/payment_service.proto`

## Responsabilités

### Traitement des paiements
- Traitement des paiements (simulation - toujours réussi)
- Validation des moyens de paiement
- Historique des transactions

### Gestion des remboursements
- Traitement des remboursements
- Remboursements partiels et totaux
- Historique des remboursements

## API gRPC

### Méthodes principales

- `CreatePaymentIntent(order_id, amount, payment_method)` - Initialisation du paiement
- `ProcessPayment(payment_id)` - Traitement du paiement
- `GetPayment(payment_id)` - Récupération d'un paiement
- `RefundPayment(payment_id, amount, reason)` - Remboursement
- `ListPayments(user_id, filters)` - Liste des paiements

## Événements Kafka publiés

- `PaymentInitiated` - Paiement initialisé
- `PaymentSucceeded` - Paiement réussi (toujours dans cette simulation)
- `PaymentFailed` - Paiement échoué (jamais dans cette simulation)
- `PaymentRefunded` - Remboursement effectué
- `PaymentPending` - Paiement en attente

## Événements Kafka consommés

- `OrderCreated` - Pour créer le payment intent
- `ReturnApproved` - Pour traiter le remboursement

## Communication avec autres services

### Synchrone (gRPC)
- Appelle **ORDERING** pour récupérer les détails de commande
- Appelé par **ORDERING** pour créer le payment intent

### Asynchrone (Kafka)
- Consomme les événements de commande
- Publie les événements de paiement

## Modèle de données

### Payment
```protobuf
message Payment {
  string payment_id = 1;
  string order_id = 2;
  double amount = 3;
  string payment_method = 4; // CARD, PAYPAL, etc.
  string status = 5; // PENDING, SUCCEEDED, FAILED, REFUNDED
  int64 created_at = 6;
  int64 processed_at = 7;
}
```

### Refund
```protobuf
message Refund {
  string refund_id = 1;
  string payment_id = 2;
  double amount = 3;
  string reason = 4;
  int64 created_at = 5;
}
```

## Simulation de paiement

⚠️ **Important** : Ce service simule le traitement des paiements.
Dans cette version, **tous les paiements réussissent automatiquement**.

### Comportement
1. Réception d'une demande de paiement
2. Validation basique des données
3. **Succès automatique** après un délai minimal
4. Publication de l'événement `PaymentSucceeded`

### Pour la production
Pour une vraie implémentation, intégrer :
- Stripe
- PayPal
- Autres providers de paiement

## Configuration

- Port gRPC: `9006`
- Kafka broker: `localhost:9092`
- Topic Kafka: `payment.events`
- Mode simulation: `true`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
