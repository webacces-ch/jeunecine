// Script pour créer l'utilisateur admin
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
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
        
        // Créer la table users si elle n'existe pas
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableSQL);
        console.log('✅ Table users créée/vérifiée');
        
        // Hasher le mot de passe "admin"
        const hashedPassword = await bcrypt.hash('admin', 10);
        console.log('✅ Mot de passe hashé généré');
        
        // Données de l'utilisateur admin
        const adminData = {
            username: 'admin',
            email: 'admin@jeunecine.com',
            password: hashedPassword,
            role: 'admin'
        };
        
        // Vérifier si l'utilisateur admin existe déjà
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [adminData.username, adminData.email]
        );
        
        if (existingUsers.length > 0) {
            console.log('⚠️  Un utilisateur admin existe déjà');
            
            // Mettre à jour le mot de passe existant
            await connection.execute(
                'UPDATE users SET password = ?, role = ? WHERE username = ? OR email = ?',
                [adminData.password, adminData.role, adminData.username, adminData.email]
            );
            console.log('✅ Mot de passe admin mis à jour');
        } else {
            // Créer le nouvel utilisateur admin
            const [result] = await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [adminData.username, adminData.email, adminData.password, adminData.role]
            );
            console.log('✅ Utilisateur admin créé avec l\'ID:', result.insertId);
        }
        
        // Afficher les informations de connexion
        console.log('\n🎉 Configuration terminée !');
        console.log('📋 Informations de connexion:');
        console.log('   - Username: admin');
        console.log('   - Email: admin@jeunecine.com');
        console.log('   - Password: admin');
        console.log('   - Role: admin');
        console.log('\n🔗 URL de connexion: http://localhost:3000/api/auth/login');
        
        console.log('\n📝 Exemple de requête POST pour se connecter:');
        console.log(`curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "admin@jeunecine.com", "password": "admin"}'`);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Suggestions:');
            console.log('   - Vérifiez que MySQL est démarré');
            console.log('   - Vérifiez les paramètres de connexion dans .env.local');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Connexion fermée');
        }
    }
}

// Exécuter le script
createAdminUser();
