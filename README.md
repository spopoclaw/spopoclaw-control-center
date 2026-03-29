# 🎛️ SpopoClaw Control Center

Console d'administration et de supervision pour SpopoClaw / OpenClaw et le host VPS `spopoclaw-01`.

## 🌐 Accès

**URL de production :** http://95.111.236.247:8000

**Utilisateurs autorisés :**
- `youssef.mahtat.as.developer@gmail.com`
- `spopoclaw@gmail.com`

## 📋 Fonctionnalités MVP

### ✅ Implémentées

1. **Tableau de bord général**
   - Statut global SpopoClaw
   - Statut OpenClaw Gateway
   - Uptime applicatif et host
   - Indicateurs CPU, RAM en temps réel
   - Auto-refresh toutes les 5 secondes

2. **Supervision système**
   - CPU, RAM, swap, load average
   - Espace disque par partition
   - Interfaces réseau et statistiques
   - Top processus par consommation CPU
   - Services (OpenClaw, SSH)
   - Ports en écoute

3. **Supervision OpenClaw**
   - Statut Gateway (online/offline)
   - Configuration et canaux
   - Journaux récents
   - Health check intégré

4. **Journal d'audit**
   - Timeline des événements
   - Types d'événements (system, auth, error)
   - Historique des connexions

5. **Authentification sécurisée**
   - Google OAuth2
   - Allowlist stricte des emails
   - JWT tokens
   - Protection des routes API

## 🏗️ Architecture

### Stack technique

| Couche | Technologie |
|--------|-------------|
| **Backend** | Python 3.12 + FastAPI |
| **Frontend** | Angular 21 + TypeScript |
| **UI** | Tailwind CSS + Angular Material |
| **Auth** | Google OAuth2 (authlib) |
| **Monitoring** | psutil (Python) |
| **Serveur** | Uvicorn (ASGI) |

### Structure du projet

```
spopoclaw-control-center/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── main.py       # Point d'entrée
│   │   ├── config.py     # Configuration
│   │   └── routers/      # Endpoints API
│   ├── requirements.txt
│   └── .env              # Variables d'environnement
├── frontend/             # Application Angular
│   ├── src/app/
│   │   ├── components/   # Composants UI
│   │   ├── services/     # Services HTTP
│   │   └── models/       # Types TypeScript
│   └── dist/             # Build production
├── docker-compose.yml    # Configuration Docker
└── README.md
```

## 🚀 Déploiement

### Prérequis

- Python 3.12+
- Node.js 22+
- npm 10+

### Installation

```bash
# Cloner le repository
git clone https://github.com/spopoclaw/spopoclaw-control-center.git
cd spopoclaw-control-center

# Backend
cd backend
pip install -r requirements.txt  # ou --break-system-packages si nécessaire

# Frontend
cd ../frontend
npm install
npm run build

# Configuration
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos credentials Google OAuth
```

### Démarrage

```bash
# Depuis le dossier backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Ou utiliser le script
./start.sh
```

### Configuration Google OAuth

1. Aller à https://console.cloud.google.com/apis/credentials
2. Créer des identifiants OAuth 2.0
3. Configurer les URI de redirection :
   - `http://95.111.236.247:8000/api/auth/callback`
4. Copier le Client ID et Client Secret dans `backend/.env`

## 🔌 API Endpoints

### Health
- `GET /api/health/` - Statut général
- `GET /api/health/detailed` - Statut détaillé

### Auth
- `GET /api/auth/login` - Redirection OAuth Google
- `GET /api/auth/callback` - Callback OAuth
- `GET /api/auth/verify` - Vérification token JWT
- `GET /api/auth/allowed-users` - Liste des utilisateurs autorisés

### System
- `GET /api/system/info` - Informations système
- `GET /api/system/cpu` - Statistiques CPU
- `GET /api/system/memory` - Statistiques mémoire
- `GET /api/system/disk` - Utilisation disque
- `GET /api/system/network` - Interfaces réseau
- `GET /api/system/processes?limit=20` - Top processus
- `GET /api/system/services` - Services système
- `GET /api/system/ports` - Ports en écoute

### OpenClaw
- `GET /api/openclaw/status` - Statut Gateway
- `GET /api/openclaw/info` - Configuration
- `GET /api/openclaw/logs?lines=50` - Journaux

### Audit
- `GET /api/audit/events` - Événements récents

## 🔒 Sécurité

- ✅ Authentification Google OAuth2 obligatoire
- ✅ Allowlist stricte (seuls 2 emails autorisés)
- ✅ JWT tokens avec expiration
- ✅ CORS configuré pour l'IP de production
- ✅ Aucun secret exposé au frontend
- ✅ Variables sensibles côté backend uniquement

## 📝 Configuration

### Variables d'environnement (backend/.env)

```env
SECRET_KEY=votre-cle-secrete
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REDIRECT_URI=http://95.111.236.247:8000/api/auth/callback
ALLOWED_USERS=youssef.mahtat.as.developer@gmail.com,spopoclaw@gmail.com
OPENCLAW_GATEWAY_URL=http://localhost:18789
ENV=production
```

## 🔧 Maintenance

### Voir les logs
```bash
tail -f /tmp/scc.log
```

### Redémarrer l'application
```bash
pkill -f "uvicorn app.main:app"
cd ~/codes-repositories/spopoclaw-control-center/backend
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/scc.log 2>&1 &
```

### Mise à jour du code
```bash
cd ~/codes-repositories/spopoclaw-control-center
git pull origin main
cd frontend && npm run build
cd ../backend
pkill -f "uvicorn app.main:app"
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/scc.log 2>&1 &
```

## 🐳 Docker (optionnel)

```bash
# Build et démarrage avec Docker Compose
docker-compose up --build -d

# Arrêt
docker-compose down
```

## 📊 Prochaines améliorations suggérées

- [ ] Centre d'alertes avec notifications
- [ ] Historique des métriques système (graphiques)
- [ ] Gestion des containers Docker
- [ ] Boutons d'action (redémarrage services)
- [ ] HTTPS avec certificats SSL
- [ ] Tests automatisés
- [ ] CI/CD GitHub Actions

## 📄 Licence

Projet privé - Usage personnel uniquement

---

Développé avec ❤️ par SpopoClaw pour Youssef MAHTAT
