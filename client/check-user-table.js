// Script pour vérifier et mettre à jour la structure de la table users
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkAndUpdateUserTable() {
    let connection;
    
    try {
        // Connexion à la base de données
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'cinema',
        });
        
        console.log('✅ Connecté à la base de données MySQL');
        
        // Vérifier la structure actuelle de la table users
        try {
            const [columns] = await connection.execute(
                'DESCRIBE users'
            );
            
            console.log('📋 Structure actuelle de la table users:');
            columns.forEach(col => {
                console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `(${col.Key})` : ''}`);
            });
            
            // Vérifier si la colonne email existe
            const hasEmail = columns.some(col => col.Field === 'email');
            const hasRole = columns.some(col => col.Field === 'role');
            const hasCreatedAt = columns.some(col => col.Field === 'created_at');
            
            // Ajouter les colonnes manquantes
            if (!hasEmail) {
                await connection.execute('ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE');
                console.log('✅ Colonne email ajoutée');
            }
            
            if (!hasRole) {
                await connection.execute('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "user"');
                console.log('✅ Colonne role ajoutée');
            }
            
            if (!hasCreatedAt) {
                await connection.execute('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
                console.log('✅ Colonne created_at ajoutée');
            }
            
            console.log('✅ Structure de la table mise à jour');
            
        } catch (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') {
                console.log('⚠️  La table users n\'existe pas, création en cours...');
                
                // Créer la table complète
                const createTableSQL = `
                    CREATE TABLE users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        email VARCHAR(255) UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(50) DEFAULT 'user',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                
                await connection.execute(createTableSQL);
                console.log('✅ Table users créée avec la structure complète');
            } else {
                throw error;
            }
        }
        
        // Afficher la structure finale
        const [finalColumns] = await connection.execute('DESCRIBE users');
        console.log('\n📋 Structure finale de la table users:');
        finalColumns.forEach(col => {
            console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `(${col.Key})` : ''}`);
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Connexion fermée');
        }
    }
}

// Exécuter le script
checkAndUpdateUserTable();
