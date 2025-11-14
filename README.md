# E-Commerce
 Ce repo contiens toutes les instructions pour suivre la 5e session Vibe Coding de Sfeir Bordeaux.

Vous trouverez les étapes à suivre ici :

- Aucune étape pour l'instant

## Les règles

En choisissant l'outil IA de votre choix ainsi que la technologie de votre choix, nous réaliserons un site e-commerce en coopération et en suivant les étapes mentionnées ci-dessus.

Nous ferons un point toutes les demi-heures pour vérifier l'avancement de tous.

N'hésitez pas à demander de l'aide! L'objectif est de découvrir le fonctionnement de ces outils ainsi que leur limitations.

## objectifs

Creer et démarrer les differents micro-services et web app, et faire une premiere commande (generation de la facture au format pdf)

## Solutions

En plus des instructions, ce repo contiens des exemples de solution pour les exercices réalisés.

## Infrastructure

### Kafka (Bus de messages)

Ce projet utilise Apache Kafka 4 comme bus de messages pour la communication entre les microservices.

#### Démarrage de Kafka

Pour lancer Kafka en local avec son interface d'administration :

```bash
docker-compose up -d
```

Cela démarre :
- **Kafka 4** (mode KRaft, sans ZooKeeper) sur le port `9092`
- **Kafka UI** (interface web) accessible sur http://localhost:8080

#### Utilisation de Kafka UI

Une fois les conteneurs démarrés, accédez à http://localhost:8080 pour :
- Visualiser et gérer les topics
- Envoyer des messages dans les topics
- Consommer et lire les messages
- Monitorer les consumers groups
- Voir les configurations du cluster

#### Arrêt de l'infrastructure

```bash
docker-compose down
```

Pour supprimer également les données :

```bash
docker-compose down -v
```
