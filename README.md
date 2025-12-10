# E-Commerce

Ce repo contient toutes les instructions pour suivre la 5e session Vibe Coding de Sfeir Bordeaux.

## Objectifs

Créer et démarrer les différents micro-services et web app, et faire une première commande.

## Installation et Démarrage

### Prérequis
- Docker Desktop
- Git

### Lancement Rapide

Utilisez le script fourni pour lancer toute la stack (Infrastructure + Services + Frontends). Ce script configure automatiquement l'adresse IP pour permettre l'accès réseau (important pour Kafka).

```bash
./start.sh
```

Cela démarre :
- **Front-Office** : http://localhost
- **Back-Office** : http://admin.localhost (pensez à ajouter `127.0.0.1 admin.localhost` à votre `/etc/hosts`)
- **Traefik Dashboard** : http://localhost:8080/dashboard/
- **Kafka UI** : http://localhost:8090
- **Kafka Broker** : Port 9092 (accessible via IP locale)
- **Microservices** : Accessibles via `http://localhost/api/<service>/...`

### Front-Office avec Docker

Le front-office peut également être lancé dans un container Docker :

```bash
# Option 1: Build et run direct
cd sites/front-office/front-office-example
docker build -t front-office:latest .
docker run -p 9000:3000 front-office:latest
```

```bash
# Option 2: Via Docker Compose
docker compose up -d front-office
```

Pour utiliser le front-office conteneurisé avec Traefik, modifiez `traefik/dynamic.yml` pour pointer vers `http://front-office:3000` au lieu de `http://192.168.1.42:9000`.

**Documentation complète:** [sites/front-office/front-office-example/DOCKER.md](sites/front-office/front-office-example/DOCKER.md)

### Back-Office avec Docker

Le back-office peut également être lancé dans un container Docker :

```bash
# Option 1: Build et run direct
cd sites/back-office/back-office-example
docker build -t back-office:latest .
docker run -p 9010:3000 back-office:latest
```

```bash
# Option 2: Via Docker Compose
docker compose up -d back-office
```

Pour utiliser le back-office conteneurisé avec Traefik, modifiez `traefik/dynamic.yml` pour pointer vers `http://back-office:3000` au lieu de `http://192.168.1.42:9010`.

**Documentation complète:** [sites/back-office/back-office-example/DOCKER.md](sites/back-office/back-office-example/DOCKER.md)

## Infrastructure Technique

### API Gateway (Traefik)
Traefik agit comme point d'entrée unique (BFF - Backend for Frontend) et reverse proxy.
- `admin.localhost` -> Back-Office
- `/` -> Front-Office
- `/api/<service>` -> Microservices

### Kafka (Bus de messages)
Apache Kafka 4 (KRaft) assure la communication asynchrone.
Le broker annonce l'IP de votre machine (via `HOST_IP`) pour permettre aux services situés sur d'autres machines du réseau de s'y connecter.

## Déploiement Distribué (Réseau Local)

Si vous souhaitez faire tourner un microservice (ex: `profiling`) sur une autre machine de votre réseau local (ex: `192.168.1.50`), suivez ces étapes :

### 1. Désactiver le service local
Dans `docker-compose.yml`, commentez ou supprimez le service concerné pour qu'il ne tourne plus sur votre machine principale.

### 2. Configurer la redirection dans Traefik
Ouvrez le fichier `traefik/dynamic.yml`.
Décommentez et adaptez la configuration du routeur et du service pour pointer vers l'IP de l'autre machine.

Exemple pour `profiling` :

```yaml
http:
  routers:
    external-profiling:
      rule: "PathPrefix(`/api/profiling`)"
      service: external-profiling-svc
      middlewares:
        - profiling-strip
  
  services:
    external-profiling-svc:
      loadBalancer:
        servers:
          - url: "http://192.168.1.50:9001" # IP de la machine qui héberge le service
```

Traefik rechargera cette configuration automatiquement (hot-reload).

### 3. Connecter le service distant à Kafka
Sur la machine distante, assurez-vous que votre microservice pointe bien vers l'IP de votre machine principale pour Kafka (et non `localhost`), car Kafka annonce l'IP du réseau.

## Arrêt

```bash
docker compose down
# ou pour tout supprimer (volumes inclus)
docker compose down -v
```


## Lien vers les slides 
[Ici](https://docs.google.com/presentation/d/1UGYW3IjrTDb5I37UtbeuWGy8Bxe5wGZFSQLHmPLIT74/edit?usp=sharing)
