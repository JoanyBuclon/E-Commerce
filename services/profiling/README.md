# PROFILING

## Vue d'ensemble

Service de gestion des profils utilisateurs, gérant l'authentification et les informations personnelles.

## Informations techniques

- **Port HTTP**: 9001
- **Base de données**: InMemory
- **Proto**: `profiling/profile_service.yaml`

## Responsabilités

### Gestion des utilisateurs
- Gestion des profils utilisateurs (email / password)
- Authentification par email/password
- Création et mise à jour des profils

### Gestion des adresses
- Adresses de livraison
- Adresses de facturation

### Statut client
- Gestion du statut client (VIP, etc.)
- Historique et préférences utilisateur

## API REST API

### Méthodes principales

- `CreateUser(email, password, name)` - Création d'un nouveau profil utilisateur
- `GetUser(user_id)` - Récupération d'un profil
- `UpdateUser(user_id, fields)` - Mise à jour d'un profil
- `DeleteUser(user_id)` - Suppression d'un profil
- `AuthenticateUser(email, password)` - Authentification
- `AddAddress(user_id, address)` - Ajout d'une adresse
- `UpdateAddress(user_id, address_id, address)` - Mise à jour d'une adresse
- `GetAddresses(user_id)` - Récupération des adresses

## Événements Kafka publiés

- `UserCreated` - Utilisateur créé
- `UserUpdated` - Profil utilisateur mis à jour
- `UserDeleted` - Utilisateur supprimé
- `AddressAdded` - Adresse ajoutée
- `AddressUpdated` - Adresse mise à jour

## Événements Kafka consommés

- `UserAuthenticated` - Pour synchronisation (si nécessaire)

## Communication avec autres services

### Synchrone (REST API)
Aucune dépendance vers d'autres services.

### Asynchrone (Kafka)
- Publie des événements consommés par d'autres services

## Modèle de données

### User
```JSON
interface User {
  string: user_id = 1;
  string: email = 2;
  string: password_hash = 3;
  string: first_name = 4;
  string: last_name = 5;
  string: status = 6; // VIP, STANDARD, etc.
  number: created_at = 7;
  number: updated_at = 8;
}
```

### Address
```JSON
interface Address {
  string: address_id = 1;
  string: user_id = 2;
  string: type = 3; // SHIPPING, BILLING
  string: street = 4;
  string: city = 5;
  string: postal_code = 6;
  string: country = 7;
}
```

## Configuration

- Port HTTP: `9001`
- Kafka broker: `localhost:9092`
- Topic Kafka: `profiling.events`

## Démarrage

```bash
# TODO: Commandes de démarrage
```

## Tests

```bash
# TODO: Commandes de test
```
