# SpopoClaw Control Center

Console d'administration et de supervision pour SpopoClaw / OpenClaw et le host spopoclaw-01.

## Architecture

- **Backend** : FastAPI (Python 3.12)
- **Frontend** : Angular 21 + Tailwind CSS + Angular Material
- **Auth** : Google OAuth2 avec allowlist stricte
- **Reverse Proxy** : Caddy (auto-HTTPS)
- **Déploiement** : Docker Compose

## Utilisateurs autorisés

- youssef.mahtat.as.developer@gmail.com
- spopoclaw@gmail.com

## Structure

```
.
├── backend/          # API FastAPI
├── frontend/         # Application Angular
├── docker-compose.yml
└── scripts/          # Scripts de déploiement
```

## Démarrage rapide

```bash
# Development
./scripts/dev.sh

# Production
docker-compose up -d
```

## URL d'accès

- Local : http://localhost:8080
- Production : https://control.spopoclaw.dev (à configurer)
