# JangQuranAkSunna - Plateforme d'Enseignement Islamique

> **Une sadaqa jâriyah numérique** - Centraliser, organiser et diffuser les enseignements islamiques

## 📱 Vue d'ensemble

JangQuranAkSunna est une plateforme complète comprenant :
- **Application mobile** (Flutter) pour Android et iOS
- **Interface d'administration web** (Next.js) pour la gestion de contenu
- **API backend** (Spring Boot) avec base de données et services
- **Infrastructure** complète avec Docker Compose

## 🏗️ Architecture Monorepo

```
/mobile/          # Application Flutter (Android + iOS)
/admin/           # Interface d'administration web (Next.js 14)
/api/             # Backend API REST (Spring Boot 3)
/infra/           # Infrastructure as Code et configurations
/docs/            # Documentation technique
```

## 🚀 Démarrage rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (pour l'admin web)
- Flutter SDK 3.16+ (pour le mobile)
- Java 21+ (pour l'API)

### Lancement en mode développement

1. **Cloner et configurer l'environnement**
```bash
git clone <repository>
cd jangquranaksunna
cp .env.example .env
```

2. **Démarrer tous les services**
```bash
docker-compose up -d
```

3. **Accéder aux interfaces**
- API: http://localhost:8080
- Admin Web: http://localhost:3000
- Elasticsearch: http://localhost:9200
- MinIO (S3): http://localhost:9001

## 🎯 Fonctionnalités principales

### 📱 Application Mobile
- ✅ Authentification (email/password + OAuth Google)
- ✅ Catalogue de contenus (audio, vidéo, PDF, texte)
- ✅ Recherche avancée multi-facettes
- ✅ Mode hors-ligne sécurisé avec chiffrement
- ✅ Streaming adaptatif (HLS/DASH)
- ✅ Donations (Orange Money, Wave, Stripe, PayPal)
- ✅ Multilingue (FR, AR, WO, PUL) avec support RTL

### 🖥️ Interface d'administration
- ✅ Gestion des contenus (CRUD + modération)
- ✅ Ingestion depuis YouTube et Telegram
- ✅ Gestion des enseignants, mosquées, thèmes
- ✅ Workflows de publication et validation
- ✅ Tableaux de bord et statistiques
- ✅ Système de rôles (RBAC)

### ⚡ Backend API
- ✅ API REST avec OpenAPI 3
- ✅ Base de données PostgreSQL
- ✅ Cache Redis
- ✅ Moteur de recherche Elasticsearch
- ✅ Stockage de fichiers MinIO/S3
- ✅ File d'attente RabbitMQ
- ✅ Transcodage automatique (FFmpeg)

## 📋 Scripts utiles

```bash
# Développement
make dev-start          # Démarrer l'environnement de développement
make dev-stop           # Arrêter l'environnement
make dev-reset          # Reset complet avec suppression des volumes

# Base de données
make db-migrate         # Exécuter les migrations
make db-seed            # Charger les données d'exemple
make db-reset           # Reset complet de la DB

# Build
make build-all          # Builder tous les services
make build-mobile       # Builder l'application mobile
make build-admin        # Builder l'interface admin
make build-api          # Builder l'API

# Tests
make test-all           # Lancer tous les tests
make test-api           # Tests backend uniquement
make test-admin         # Tests frontend admin
make test-mobile        # Tests mobile
```

## 🔒 Sécurité

- **OWASP Mobile Top 10** et **OWASP API Top 10** compliance
- Authentification JWT avec refresh tokens
- Chiffrement des téléchargements hors-ligne (AES-256)
- Rate limiting et protection anti-bruteforce
- Validation stricte des données (DTO)
- Audit log complet
- Scannage antivirus des uploads

## 🌍 Internationalisation

Support natif pour :
- **Français (FR)** - langue principale
- **Arabe (AR)** - avec support RTL
- **Wolof (WO)** - langue locale Sénégal
- **Pulaar/Fulfulde (PUL)** - langue locale Sénégal

## 📊 Observabilité

- Logs structurés (JSON)
- Métriques Prometheus
- Traces distribuées OpenTelemetry
- Tableaux de bord Grafana
- Alertes automatisées

## 🤝 Contribution

Voir [CONTRIBUTING.md](./docs/CONTRIBUTING.md) pour les guidelines de développement.

## 📄 Licence

Ce projet est une **sadaqa jâriyah** (aumône perpétuelle) et est distribué sous licence MIT.

## 📞 Support

- Documentation: [./docs/](./docs/)
- Issues: GitHub Issues
- Email: support@jangquranaksunna.org
