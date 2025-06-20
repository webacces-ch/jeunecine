# API Routes Next.js - Jeunecine

## 🚀 Routes API disponibles

### 🔐 Authentification

#### POST `/api/auth/login`
Connecter un utilisateur avec username/email et mot de passe.

**Body:**
```json
{
  "username": "admin",  // ou "email": "admin@example.com"
  "password": "admin"
}
```

**Réponse:**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

#### POST `/api/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "username": "nouvel_utilisateur",
  "email": "user@example.com",
  "password": "mot_de_passe"
}
```

#### GET `/api/auth/protected`
Route protégée pour vérifier l'authentification.

**Headers:**
```
Authorization: Bearer <token>
```

---

### 📰 Articles

#### GET `/api/articles`
Récupérer tous les articles.

**Query params:**
- `published=true` : Récupérer uniquement les articles publiés

#### POST `/api/articles`
Créer un nouvel article. *(Authentification requise)*

**Body:**
```json
{
  "title": "Titre de l'article",
  "content": "Contenu HTML de l'article",
  "date": "2025-06-20",
  "author": "Nom de l'auteur",
  "status": "published", // ou "draft"
  "coverImage": "/uploads/articles/image.jpg",
  "tags": ["tag1", "tag2"],
  "summary": "Résumé de l'article"
}
```

#### GET `/api/articles/[id]`
Récupérer un article spécifique par ID.

#### PUT `/api/articles/[id]`
Mettre à jour un article. *(Authentification requise)*

#### DELETE `/api/articles/[id]`
Supprimer un article. *(Authentification requise)*

---

### 🎬 Films

#### GET `/api/films`
Récupérer tous les films.

#### POST `/api/films`
Créer un nouveau film. *(Authentification requise)*

**Body:**
```json
{
  "title": "Titre du film",
  "subtitle": "Sous-titre",
  "youtube": "dQw4w9WgXcQ", // ID YouTube
  "description": "Description du film",
  "imageUrl": "/uploads/films/poster.jpg",
  "videoUrl": "/uploads/films/video.mp4"
}
```

#### GET `/api/films/[id]`
Récupérer un film spécifique par ID.

#### PUT `/api/films/[id]`
Mettre à jour un film. *(Authentification requise)*

#### DELETE `/api/films/[id]`
Supprimer un film. *(Authentification requise)*

---

### 🏢 Sponsors

#### GET `/api/sponsors`
Récupérer tous les sponsors.

#### POST `/api/sponsors`
Créer un nouveau sponsor. *(Authentification requise)*

**Body:**
```json
{
  "imageUrl": "/uploads/sponsors/logo.jpg",
  "link": "https://sponsor-website.com"
}
```

#### GET `/api/sponsors/[id]`
Récupérer un sponsor spécifique par ID.

#### PUT `/api/sponsors/[id]`
Mettre à jour un sponsor. *(Authentification requise)*

#### DELETE `/api/sponsors/[id]`
Supprimer un sponsor. *(Authentification requise)*

---

### 🖼️ Galerie

#### GET `/api/galerie`
Récupérer toutes les images de la galerie.

#### POST `/api/galerie`
Ajouter une nouvelle image à la galerie. *(Authentification requise)*

**Body:**
```json
{
  "title": "Titre de l'image",
  "imageUrl": "/uploads/galerie/image.jpg",
  "description": "Description de l'image"
}
```

#### GET `/api/galerie/[id]`
Récupérer une image spécifique par ID.

#### PUT `/api/galerie/[id]`
Mettre à jour une image. *(Authentification requise)*

#### DELETE `/api/galerie/[id]`
Supprimer une image. *(Authentification requise)*

---

### 👤 Utilisateurs

#### GET `/api/user/me`
Récupérer les informations de l'utilisateur connecté. *(Authentification requise)*

#### PUT `/api/user/me`
Mettre à jour les informations de l'utilisateur connecté. *(Authentification requise)*

**Body:**
```json
{
  "username": "nouveau_username",
  "email": "nouvel_email@example.com"
}
```

---

### 📁 Upload

#### POST `/api/upload`
Uploader un fichier. *(Authentification requise)*

**Form Data:**
- `file`: Le fichier à uploader (images uniquement)
- `type`: Type d'upload (`sponsors`, `galerie`, `films`, `articles`)

**Réponse:**
```json
{
  "success": true,
  "filename": "sponsors-1640995200000-123456789.jpg",
  "url": "/uploads/sponsors/sponsors-1640995200000-123456789.jpg",
  "size": 152340,
  "type": "image/jpeg"
}
```

---

## 🔑 Authentification

Toutes les routes marquées *(Authentification requise)* nécessitent un header d'authentification :

```
Authorization: Bearer <token>
```

Le token est obtenu via la route `/api/auth/login`.

---

## 🗄️ Base de données

Les tables suivantes sont créées automatiquement :

- `users` : Utilisateurs
- `articles` : Articles de blog
- `films` : Films
- `sponsors` : Sponsors
- `galerie` : Images de galerie

---

## 🧪 Tests

Exécuter les tests de toutes les routes :

```bash
node test-api.js
```

---

## 📝 Notes

- Toutes les routes retournent du JSON
- Les erreurs incluent un message d'erreur et un code de statut HTTP approprié
- Les uploads sont stockés dans `/public/uploads/`
- L'environnement de développement utilise `http://localhost:3000`
