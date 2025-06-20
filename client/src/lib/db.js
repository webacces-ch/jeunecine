// Connexion à la base de données MySQL pour Next.js
import mysql from 'mysql2/promise';

let connection;

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cinema',
    });
    
    console.log('Connecté à la base de données MySQL');
  }
  
  return connection;
}

export default getConnection;
