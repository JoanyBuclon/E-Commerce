# Architecture Microservices E-Commerce

## Vue d'ensemble

Architecture microservices complète pour une plateforme e-commerce utilisant **REST API** pour la communication synchrone et **Kafka** pour les événements asynchrones.

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


#### use case:
 - se connecter (email/password)
 - lister les produits (+ recherche simple par nom)
 - commander un produit (ajouter au panier)
 - payer une commande

### Back-end

Site de gestion back office du site e-commerce

port 9010

Appel direct sur les micro-services.

Pas d'authentification forte (juste un email/password suffit)

#### use case:
 - ajouter produit (nom, detail, prix)
 - evolution des livraisons (statut envoyé, livré)


## Liste des microservices

### Domaine Utilisateur

#### PROFILING
- **Port HTTP**: 9001
- **Responsabilités**:
  - Gestion des profils utilisateurs (email / password)
- **Base de données**: InMemory
- **OpenAPI**: `profiling/openapi.yaml`

---

### Domaine Catalogue

#### CATALOGING
- **Port HTTP**: 9002
- **Responsabilités**: 
  - Gestion des produits (nom, description, prix)
  - lister les produits (+ recherche simple par nom)
- **Base de données**: InMemory (cache)
- **OpenAPI**: `cataloging/openapi.yaml`

---

### Domaine Transaction

#### ORDERING
- **Port HTTP**: 9003
- **Responsabilités**: 
  - Gestion du cycle de vie des commandes (créé, commandé, payé/en préparation, envoyé, livré, annulé)
  - Historique des commandes
- **Base de données**: InMemory
- **OpenAPI**: `ordering/openapi.yaml`

#### PAYING
- **Port HTTP**: 9004
- **Responsabilités**: 
  - Traitement des paiements (oui tout le temps)
- **Base de données**: InMemory (ACID)
- **OpenAPI**: `paying/openapi.yaml`

#### SHIPPING
- **Port HTTP**: 9005
- **Responsabilités**: 
  - Gestion du cycle de vie des livraisons (payé/en préparation, envoyé, livré, annulé)
- **Base de données**: InMemory
- **OpenAPI**: `shipping/openapi.yaml`

---

## Architecture technique

### Stack technologique

#### Communication
- **REST API**: HTTP/1.1 avec JSON (openAPI)
- **Event Bus**: Apache Kafka avec Schema Registry (JSON Schema)


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

#### CQRS (optionnel)
- Séparation lecture/écriture

---

## Annexes

### Glossaire

- **REST API**: Architecture de services web utilisant HTTP et JSON
- **OpenAPI**: Spécification pour décrire et documenter les APIs REST
- **CQRS**: Command Query Responsibility Segregation - séparation read/write

### Ressources

#### Documentation officielle
- OpenAPI: https://spec.openapis.org/
- REST API: https://restfulapi.net/
- Kafka: https://kafka.apache.org/documentation/

#### Outils recommandés
- **Swagger UI**: Interface pour tester les APIs REST
- **Postman**: Client API pour tests REST
- **Insomnia**: Client API alternatif
