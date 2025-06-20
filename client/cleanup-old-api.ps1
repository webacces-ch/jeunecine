# Script PowerShell de nettoyage des anciens fichiers Express

Write-Host "🧹 Nettoyage des anciens fichiers Express..." -ForegroundColor Yellow

# Créer le dossier backup
Write-Host "📁 Création du dossier backup..." -ForegroundColor Blue
New-Item -Path "backup\old-express-api" -ItemType Directory -Force | Out-Null

# Copier les fichiers importants vers backup
Write-Host "💾 Sauvegarde des fichiers..." -ForegroundColor Blue
Copy-Item -Path "src\app\api\controllers" -Destination "backup\old-express-api\" -Recurse -Force
Copy-Item -Path "src\app\api\models" -Destination "backup\old-express-api\" -Recurse -Force
Copy-Item -Path "src\app\api\routes" -Destination "backup\old-express-api\" -Recurse -Force
Copy-Item -Path "src\app\api\middleware" -Destination "backup\old-express-api\" -Recurse -Force
Copy-Item -Path "src\app\api\index.js" -Destination "backup\old-express-api\" -Force
Copy-Item -Path "src\app\api\db.js" -Destination "backup\old-express-api\" -Force
Copy-Item -Path "src\app\api\package.json" -Destination "backup\old-express-api\" -Force

Write-Host "✅ Sauvegarde terminée dans backup\old-express-api\" -ForegroundColor Green

# Supprimer les anciens fichiers (optionnel - décommentez si vous êtes sûr)
Write-Host "⚠️  Pour supprimer les anciens fichiers, décommentez les lignes suivantes :" -ForegroundColor Yellow
Write-Host "# Remove-Item -Path 'src\app\api\controllers' -Recurse -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\models' -Recurse -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\routes' -Recurse -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\middleware' -Recurse -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\index.js' -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\db.js' -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\package.json' -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\README.md' -Force" -ForegroundColor Gray
Write-Host "# Remove-Item -Path 'src\app\api\vercel.json' -Force" -ForegroundColor Gray

Write-Host "🎉 Migration terminée !" -ForegroundColor Green
Write-Host "📝 Consultez API_MIGRATION.md pour plus d'informations" -ForegroundColor Cyan
