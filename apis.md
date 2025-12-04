# 📄 Spécifications Consolidated API (REST & Kafka)
1. OpenAPI : APIs REST Synchrones (Microservices)
   
## Cataloging Service (Port 9002)
```YAML

openapi: 3.0.0
info:
  title: Cataloging Service
  version: 1.0.0
servers:
  - url: http://localhost:9002
paths:
  /products:
    get:
      summary: Lister les produits
      parameters:
        - name: name
          in: query
          schema:
            type: string
          description: Recherche simple par nom
      responses:
        '200':
          description: Liste des produits
    post:
      summary: Ajouter un produit (Back Office)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string }
                description: { type: string }
                price: { type: number }
      responses:
        '201':
          description: Produit créé
```

## Ordering Service (Port 9003)

```YAML

openapi: 3.0.0
info:
  title: Ordering Service
  version: 1.0.0
servers:
  - url: http://localhost:9003
paths:
  /orders:
    post:
      summary: Créer une commande
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userEmail: { type: string }
                items: 
                  type: array
                  items: { type: string } # Product IDs
      responses:
        '201':
          description: Commande créée (Statut CREATED)
  /orders/{id}:
    get:
      summary: Obtenir le détail et le statut d'une commande
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Détails de la commande
```

## Paying Service (Port 9004)

```YAML

openapi: 3.0.0
info:
  title: Paying Service
  version: 1.0.0
servers:
  - url: http://localhost:9004
paths:
  /payments:
    post:
      summary: Effectuer un paiement
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                orderId: { type: string }
                amount: { type: number }
                creditCardToken: { type: string }
      responses:
        '200':
          description: Paiement accepté
        '402':
          description: Paiement refusé
```

## Shipping Service (Port 9005)

```YAML

openapi: 3.0.0
info:
  title: Shipping Service
  version: 1.0.0
servers:
  - url: http://localhost:9005
paths:
  /shipments/{orderId}:
    put:
      summary: Mettre à jour le statut de livraison (Back Office)
      parameters:
        - name: orderId
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status: 
                  type: string
                  enum: [SENT, DELIVERED, CANCELLED]
      responses:
        '200':
          description: Statut mis à jour
```

# 2. AsyncAPI : Événements Kafka Asynchrones

```YAML

asyncapi: 2.6.0
info:
  title: E-Commerce Events
  version: 1.0.0
  description: Messages asynchrones pour l'orchestration des commandes.

servers:
  kafka:
    url: localhost:9092
    protocol: kafka

channels:
  # Canal pour les événements de paiement
  payment.events:
    publish:
      message:
        $ref: '#/components/messages/PaymentValidated'
    subscribe:
      message:
        $ref: '#/components/messages/PaymentValidated'

  # Canal pour les événements de livraison
  shipping.events:
    publish:
      message:
        $ref: '#/components/messages/ShipmentSent'
    subscribe:
      message:
        $ref: '#/components/messages/ShipmentSent'

components:
  messages:
    PaymentValidated:
      name: PaymentValidated
      title: Paiement Validé
      summary: Émis par PAYING quand un paiement réussit. Consommé par ORDERING (update status) et SHIPPING (initier livraison).
      payload:
        type: object
        properties:
          paymentId:
            type: string
          orderId:
            type: string
          amount:
            type: number
          timestamp:
            type: string
            format: date-time

    ShipmentSent:
      name: ShipmentSent
      title: Colis Envoyé
      summary: Émis par SHIPPING quand le Back Office marque le colis comme envoyé. Consommé par ORDERING.
      payload:
        type: object
        properties:
          shipmentId:
            type: string
          orderId:
            type: string
          trackingNumber:
            type: string
          status:
            type: string
            enum: [SENT]
          timestamp:
            type: string
            format: date-time
```
