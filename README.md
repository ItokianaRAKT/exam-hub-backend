# Exam Hub — Backend

## Prérequis
- Node.js >= 24
- Docker & Docker Compose

## Installation

### 1. Base de données
```bash
docker compose up -d
```

### 2. Variables d'environnement
```bash
cp .env.example .env
```

### 3. Dépendances
```bash
npm install
```

### 4. Migration & seed
```bash
npm run migrate
```

### 5. Lancement
```bash
npm run dev
```

## Comptes de test
| Rôle        | Email              | Mot de passe |
|-------------|--------------------|--------------|
| Admin       | admin@example.com  | admin123     |
