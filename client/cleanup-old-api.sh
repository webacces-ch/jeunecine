#!/bin/bash
# Script de nettoyage des anciens fichiers Express

echo "🧹 Nettoyage des anciens fichiers Express..."

# Sauvegarder les fichiers importants avant suppression
echo "📁 Création du dossier backup..."
mkdir -p backup/old-express-api

# Copier les fichiers importants vers backup
cp -r src/app/api/controllers backup/old-express-api/
cp -r src/app/api/models backup/old-express-api/
cp -r src/app/api/routes backup/old-express-api/
cp -r src/app/api/middleware backup/old-express-api/
cp src/app/api/index.js backup/old-express-api/
cp src/app/api/db.js backup/old-express-api/
cp src/app/api/package.json backup/old-express-api/

echo "✅ Sauvegarde terminée dans backup/old-express-api/"

# Supprimer les anciens fichiers (optionnel - décommentez si vous êtes sûr)
# echo "🗑️ Suppression des anciens fichiers..."
# rm -rf src/app/api/controllers
# rm -rf src/app/api/models  
# rm -rf src/app/api/routes
# rm -rf src/app/api/middleware
# rm src/app/api/index.js
# rm src/app/api/db.js
# rm src/app/api/package.json
# rm src/app/api/README.md
# rm src/app/api/vercel.json

echo "🎉 Migration terminée !"
echo "📝 Consultez API_MIGRATION.md pour plus d'informations"
