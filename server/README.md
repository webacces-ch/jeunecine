# Auth API for Jeune Ciné (Express)

## Endpoints

### POST /api/register

Créer un nouvel utilisateur (admin). À utiliser uniquement pour la création initiale !

Body JSON :

```
{
  "username": "admin",
  "password": "votre_mot_de_passe"
}
```

Réponse :

- 200 : `{ id, username }`
- 400 : `{ error }`

### POST /api/login

Connexion utilisateur, retourne un JWT si succès.

Body JSON :

```
{
  "username": "admin",
  "password": "votre_mot_de_passe"
}
```

Réponse :

- 200 : `{ token }`
- 401 : `{ error }`

### GET /api/protected

Exemple de route protégée (nécessite le header `Authorization: Bearer <token>`)

Réponse :

- 200 : `{ message, user }`
- 401/403 : accès refusé

## Sécurité

- Les mots de passe sont hashés avec bcryptjs.
- Les tokens JWT expirent après 2h.
- Le secret JWT est à configurer dans `.env`.

## Lancer le serveur

```
cd server
node index.js
```

## Dépendances principales

- express
- cors
- jsonwebtoken
- bcryptjs
- dotenv
- mysql2

## Installation locale rapide

```
cd server
cp .env.example .env   # puis éditez si besoin
npm install
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cinema CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
node index.js
```

Ensuite côté client :

```
cd ../client
npm install
npm run dev
```

Le frontend écoute sur http://localhost:3000 et l'API sur http://localhost:8080.

## Option Docker rapide (MySQL + Adminer)

À la racine du repo :

```
docker compose up -d db adminer
```

Puis configure `.env` avec :
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app
DB_PASSWORD=app
DB_NAME=cinema
```

Adminer dispo sur http://localhost:8081 (serveur: db / user: app / pass: app).

Lance ensuite l'API :
```
cd server
npm install
npm run dev
```
