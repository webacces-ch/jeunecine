# Migration API Express vers Next.js

## 🔄 Changements effectués

### Structure d'API Next.js
L'API Express a été convertie en API routes Next.js avec la structure suivante :

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.js
│       │   ├── register/route.js
│       │   └── protected/route.js
│       ├── articles/
│       │   ├── route.js
│       │   └── [id]/route.js
│       └── films/
│           ├── route.js
│           └── [id]/route.js
├── lib/
│   ├── db.js        # Connexion MySQL avec mysql2/promise
│   └── auth.js      # Utilitaires JWT et bcrypt
└── utils/
    └── api.js       # Client API pour le frontend
```

### Fonctionnalités migrées

#### ✅ Authentication
- **POST** `/api/auth/register` - Inscription utilisateur
- **POST** `/api/auth/login` - Connexion utilisateur  
- **GET** `/api/auth/protected` - Route protégée

#### ✅ Articles
- **GET** `/api/articles` - Liste des articles
- **GET** `/api/articles?published=true` - Articles publiés uniquement
- **POST** `/api/articles` - Créer un article (auth requise)
- **GET** `/api/articles/[id]` - Article par ID
- **PUT** `/api/articles/[id]` - Modifier un article (auth requise)
- **DELETE** `/api/articles/[id]` - Supprimer un article (auth requise)

#### ✅ Films
- **GET** `/api/films` - Liste des films
- **POST** `/api/films` - Créer un film (auth requise)
- **GET** `/api/films/[id]` - Film par ID
- **PUT** `/api/films/[id]` - Modifier un film (auth requise)
- **DELETE** `/api/films/[id]` - Supprimer un film (auth requise)

### Configuration

#### Variables d'environnement (.env.local)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cinema
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Dépendances ajoutées
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "multer": "^2.0.1",
  "mysql2": "^3.14.1"
}
```

### Utilisation côté client

```javascript
import { apiClient } from '@/utils/api';

// Authentification
await apiClient.login({ email, password });
await apiClient.register({ username, email, password });

// Articles
const articles = await apiClient.getArticles();
const publishedArticles = await apiClient.getArticles(true);
const article = await apiClient.getArticle(id);

// Films
const films = await apiClient.getFilms();
const film = await apiClient.getFilm(id);
```

### ⚠️ Points à noter

1. **CORS** : Plus besoin de configuration CORS, Next.js gère automatiquement
2. **Upload de fichiers** : À migrer avec la nouvelle API Next.js
3. **Base de données** : Les tables sont créées automatiquement au premier appel
4. **Authentification** : Token JWT stocké dans localStorage côté client

### 🔄 Prochaines étapes

1. **Upload de fichiers** pour les sponsors et galerie
2. **Routes sponsors** 
3. **Routes utilisateurs**
4. **Gestion des uploads statiques**
5. **Tests des routes API**

### 🚀 Lancement

```bash
npm run dev
```

L'API sera disponible à `http://localhost:3000/api/`
