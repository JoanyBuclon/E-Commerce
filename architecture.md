# Architecture Microservices E-Commerce

## Vue d'ensemble

Architecture microservices complète pour une plateforme e-commerce utilisant **gRPC** pour la communication synchrone et **Kafka** pour les événements asynchrones.

---

## Table des matières

1. [sites](#sites)
2. [Liste des microservices](#liste-des-microservices)
3. [Architecture technique](#architecture-technique)
4. [Stack technologique](#stack-technologique)
5. [Annexes](#annexes)
---
## sites

### Front-end

Site E-commerce 

port 9000

Appel direct sur les micro-services.

Pas d'authentification forte (juste un email/password suffit)

### Back-end


Site de gestion back office du site e-commerce

port 9010

Appel direct sur les micro-services.

Pas d'authentification forte (juste un email/password suffit)

## Liste des microservices

### Domaine Utilisateur

#### PROFILING
- **Port gRPC**: 9001
- **Responsabilités**:
  - Gestion des profils utilisateurs (email / password)
  - Adresses de livraison/facturation
  - Statut client (VIP, etc.)
- **Base de données**: InMemory
- **Proto**: `profiling/profile_service.proto`

---

### Domaine Catalogue & Inventaire

#### CATALOGING
- **Port gRPC**: 9002
- **Responsabilités**: 
  - Gestion du catalogue produits
  - Catégories et hiérarchies
- **Base de données**: InMemory (cache)
- **Proto**: `cataloging/catalog_service.proto`

#### STOCKING
- **Port gRPC**: 9003
- **Responsabilités**: 
  - Gestion des stocks
  - Alertes de rupture
- **Base de données**: InMemory (avec row-level locking)
- **Proto**: `stocking/stock_service.proto`

---

### Domaine Transaction

#### CARTING
- **Port gRPC**: 9004
- **Responsabilités**: 
  - Gestion du panier d'achat
  - Calcul des totaux
  - Paniers anonymes/authentifiés
- **Base de données**: InMemory (sessions)
- **Proto**: `carting/cart_service.proto`

#### ORDERING
- **Port gRPC**: 9005
- **Responsabilités**: 
  - Gestion du cycle de vie des commandes
  - Historique des commandes
- **Base de données**: InMemory
- **Proto**: `ordering/order_service.proto`

#### PAYING
- **Port gRPC**: 9006
- **Responsabilités**: 
  - Traitement des paiements (oui tout le temps)
  - Gestion des remboursements
- **Base de données**: InMemory (ACID)
- **Proto**: `paying/payment_service.proto`

#### BILLING
- **Port gRPC**: 9007
- **Responsabilités**: 
  - Génération de factures
  - Gestion des taxes
- **Base de données**: InMemory
- **Proto**: `billing/billing_service.proto`

#### SHIPPING
- **Port gRPC**: 9008
- **Responsabilités**: 
  - Calcul des frais d'expédition
  - Gestion des transporteurs
  - Suivi des colis (tracking)
  - Étiquettes d'expédition
- **Base de données**: InMemory
- **Proto**: `shipping/shipping_service.proto`

---

### Domaine Administration

#### ADMINISTERING
- **Port gRPC**: 9009
- **Responsabilités**: 
  - Back-office de gestion (ajout vendeur et produit)
  - Paramètres système
- **Base de données**: InMemory
- **Proto**: `administering/admin_service.proto`

---

## Architecture technique

### Stack technologique

#### Communication
- **gRPC**: HTTP/2 avec Protocol Buffers
- **Event Bus**: Apache Kafka avec Schema Registry (Protobuf)


#### Infrastructure
- **Container**: Docker

---

### Pattern architecturaux

#### Database per Service
- Chaque microservice possède sa propre base de données in memory
- Isolation complète des données
- Évite le couplage par la base de données
- bounded context

#### Event-Driven Architecture
- Communication asynchrone via Kafka
- Découplage temporel entre services
- Event sourcing optionnel pour auditabilité

#### CQRS (optionnel)
- Séparation lecture/écriture

---

## Annexes

### Glossaire

- **gRPC**: Framework RPC haute performance utilisant HTTP/2 et Protocol Buffers
- **Protocol Buffers (Protobuf)**: Format de sérialisation binaire développé par Google
- **Event Sourcing**: Pattern où les changements d'état sont stockés comme séquence d'événements
- **CQRS**: Command Query Responsibility Segregation - séparation read/write
- **Saga**: Pattern de transaction distribuée avec compensation
- **Circuit Breaker**: Pattern empêchant les appels à un service défaillant

### Ressources

#### Documentation officielle
- gRPC: https://grpc.io/docs/
- Protocol Buffers: https://protobuf.dev/
- Kafka: https://kafka.apache.org/documentation/

#### Outils recommandés
- **Buf**: Gestion de schémas Protobuf (https://buf.build/)
- **BloomRPC**: Client gRPC GUI pour tests
- **Postman**: Support gRPC pour tests



### exemple: Processus de commande complet

**Étapes détaillées**:

1. **Création de commande**
   - Client → `ORDERING.CreateOrder()` avec cart_id, adresses, méthode paiement
   - ORDERING récupère le panier via `CARTING.GetCart()` (gRPC sync)
   - Validation des données

2. **Publication OrderCreated**
   - ORDERING publie `OrderCreated` avec détails complets

3. **Consommation parallèle**
   - **PAYING**: Crée payment intent via `CreatePaymentIntent()`
   - **BILLING**: Crée une facture brouillon

4. **Traitement du paiement**
   - PAYING traite et valide le paiement

5. **Paiement réussi**
   - PAYING publie `PaymentSucceeded`

6. **Confirmation de commande**
   - ORDERING consomme `PaymentSucceeded`
   - Met à jour statut à "confirmed"
   - Publie `OrderConfirmed`

7. **Actions post-confirmation**
   - **STOCKING**: Commit définitif du stock réservé
   - **SHIPPING**: Crée l'expédition via `CreateShipment()`
   - **BILLING**: Finalise la facture et génère le PDF


---

## Changelog

| Version | Date | Auteur | Changements |
|---------|------|--------|-------------|
| 1.0 | 2025-11-12 | Architecture Team | Version initiale - Architecture complète avec gRPC |

---