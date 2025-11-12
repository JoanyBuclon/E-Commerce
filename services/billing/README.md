# BILLING

## Vue d'ensemble

Service de génération de factures et gestion des taxes.

## Informations techniques

- **Port HTTP**: 9007
- **Base de données**: InMemory
- **Proto**: `billing/billing_service.yaml`

## Responsabilités

### Génération de factures
- Création de factures à partir des commandes
- Génération de numéros de facture
- Génération de PDF de facture
- Historique des factures

### Gestion des taxes
- Calcul des taxes selon la localisation
- Application des règles fiscales
- Exports comptables

## API REST API

### Méthodes principales

- `CreateInvoice(order_id)` - Création d'une facture
- `GetInvoice(invoice_id)` - Récupération d'une facture
- `GetInvoicePDF(invoice_id)` - Téléchargement du PDF
- `ListInvoices(user_id, filters)` - Liste des factures
- `FinalizeInvoice(invoice_id)` - Finalisation d'une facture

## Événements Kafka publiés

- `InvoiceGenerated` - Facture générée
- `InvoiceSent` - Facture envoyée
- `InvoicePaid` - Facture payée
- `CreditNoteIssued` - Avoir émis

## Événements Kafka consommés

- `OrderCreated` - Pour créer la facture brouillon
- `OrderConfirmed` - Pour finaliser la facture
- `PaymentSucceeded` - Pour marquer comme payée

## Communication avec autres services

### Synchrone (REST API)
- Appelle **ORDERING** pour récupérer les détails de commande
- Appelle **PROFILING** pour les adresses de facturation

### Asynchrone (Kafka)
- Consomme les événements de commande et paiement
- Publie les événements de facturation

## Modèle de données

### Invoice
```JSON
interface Invoice {
  string: invoice_id = 1;
  string: invoice_number = 2; // Format: INV-2024-00001
  string: order_id = 3;
  string: user_id = 4;
  Address billing_address = 5;
  array: InvoiceItem items = 6;
  number: subtotal = 7;
  number: tax = 8;
  number: total = 9;
  string: status = 10; // DRAFT, FINALIZED, PAID
  number: created_at = 11;
  number: finalized_at = 12;
}
```

### InvoiceItem
```JSON
interface InvoiceItem {
  string: product_name = 1;
  number: unit_price = 2;
  number: quantity = 3;
  number: subtotal = 4;
  number: tax_rate = 5;
  number: tax_amount = 6;
}
```

## Génération de numéro de facture

Format : `INV-YYYY-NNNNN`
- `INV` : Préfixe
- `YYYY` : Année
- `NNNNN` : Numéro séquentiel (5 chiffres)

Exemple : `INV-2024-00123`

## Configuration

- Port HTTP: `9007`
- Kafka broker: `localhost:9092`
- Topic Kafka: `billing.events`
- Taux de taxe par défaut: `20%`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
