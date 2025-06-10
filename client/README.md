# Configuration de l’URL de l’API pour la production (cPanel)

Pour que le frontend Next.js fonctionne correctement en production sur cPanel, il faut définir la variable d’environnement suivante dans le dossier `client/` :

```
NEXT_PUBLIC_API_URL=https://leonardwicki.emf-informatique.ch:8080
```

Cela permet au helper `getApiUrl` (utilisé dans tout le code) de générer les bonnes URLs d’API et d’images, que ce soit en local ou en production.

**Ne jamais utiliser d’URL localhost en dur dans le code.**

---

## Résumé technique

- Utilisez toujours `getApiUrl('/api/xxx')` pour accéder à l’API Express.
- Pour les images uploadées, utilisez la même base d’URL (`NEXT_PUBLIC_API_URL`).
- Le `basePath` et `assetPrefix` sont déjà configurés dans `next.config.mjs` pour `/jeunecine`.

---

**Exemple de déploiement sur cPanel**

- API Express : https://leonardwicki.emf-informatique.ch:8080/api/...
- Frontend Next.js : https://leonardwicki.emf-informatique.ch/jeunecine
