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

## Dépendances

- express
- cors
- body-parser
- jsonwebtoken
- bcryptjs
- sqlite3
- dotenv
