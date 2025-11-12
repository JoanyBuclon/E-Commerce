# SHIPPING

## Vue d'ensemble

Service de gestion des expéditions avec calcul des frais et suivi des colis.

## Informations techniques

- **Port HTTP**: 9008
- **Base de données**: InMemory
- **OpenAPI**: `shipping/shipping_service.yaml`

## Responsabilités

### Calcul des frais d'expédition
- Calcul des frais selon le poids et la destination
- Gestion de plusieurs transporteurs
- Options de livraison (standard, express, etc.)

### Gestion des transporteurs
- Configuration des transporteurs disponibles
- Tarification par transporteur
- Zones de livraison

### Suivi des colis
- Génération de numéros de tracking
- Suivi de l'état d'expédition
- Génération d'étiquettes d'expédition

## API REST API

### Méthodes principales

- `CalculateRates(order_id, destination)` - Calcul des frais de port
- `CreateShipment(order_id, carrier)` - Création d'une expédition
- `GetShipment(shipment_id)` - Récupération d'une expédition
- `DispatchShipment(shipment_id)` - Marquer comme expédiée
- `GetTrackingInfo(shipment_id)` - Infos de suivi
- `GenerateLabel(shipment_id)` - Génération d'étiquette

## Événements Kafka publiés

- `ShippingRateCalculated` - Frais calculés
- `ShipmentCreated` - Expédition créée
- `ShipmentDispatched` - Colis expédié
- `ShipmentInTransit` - Colis en transit
- `ShipmentDelivered` - Colis livré
- `ShipmentException` - Problème d'expédition

## Événements Kafka consommés

- `OrderConfirmed` - Pour créer l'expédition

## Communication avec autres services

### Synchrone (REST API)
- Appelle **PROFILING** pour récupérer l'adresse de livraison
- Appelé par **ORDERING** pour calculer les frais
- Appelé par **ADMINISTERING** pour dispatch

### Asynchrone (Kafka)
- Consomme les événements de commande
- Publie les événements d'expédition

## Modèle de données

### Shipment
```JSON
interface Shipment {
  string: shipment_id = 1;
  string: order_id = 2;
  string: carrier = 3; // DHL, UPS, FedEx, etc.
  string: tracking_number = 4;
  Address destination = 5;
  number: weight = 6;
  number: shipping_cost = 7;
  string: status = 8; // CREATED, DISPATCHED, IN_TRANSIT, DELIVERED, EXCEPTION
  number: created_at = 9;
  number: dispatched_at = 10;
  number: delivered_at = 11;
}
```

### ShippingRate
```JSON
interface ShippingRate {
  string: carrier = 1;
  string: service_level = 2; // STANDARD, EXPRESS, OVERNIGHT
  number: cost = 3;
  number: estimated_days = 4;
}
```

## Transporteurs supportés

### Standard
- **Service**: Livraison standard
- **Délai**: 5-7 jours ouvrés
- **Coût**: 5€ + 0.10€/kg

### Express
- **Service**: Livraison express
- **Délai**: 2-3 jours ouvrés
- **Coût**: 15€ + 0.20€/kg

### Overnight
- **Service**: Livraison express J+1
- **Délai**: 1 jour ouvré
- **Coût**: 30€ + 0.30€/kg

## Configuration

- Port HTTP: `9008`
- Kafka broker: `localhost:9092`
- Topic Kafka: `shipping.events`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
