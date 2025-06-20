// API route pour la gestion de la galerie
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Créer la table galerie si elle n'existe pas
async function ensureGalerieTable() {
  const connection = await getConnection();
  const galerieTableSql = `CREATE TABLE IF NOT EXISTS galerie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(512) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  
  try {
    await connection.execute(galerieTableSql);
  } catch (error) {
    console.error('Erreur création table galerie:', error);
  }
}

// GET - Récupérer toutes les images de la galerie
export async function GET(request) {
  try {
    await ensureGalerieTable();
    const connection = await getConnection();
    
    const [rows] = await connection.execute('SELECT * FROM galerie ORDER BY created_at DESC');
    
    console.log('Images de galerie récupérées:', rows.length);
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle image à la galerie
export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { title, imageUrl, description } = await request.json();
    
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Le titre et l\'URL de l\'image sont requis' },
        { status: 400 }
      );
    }
    
    await ensureGalerieTable();
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO galerie (title, imageUrl, description) VALUES (?, ?, ?)',
      [title, imageUrl, description]
    );
    
    return NextResponse.json({
      id: result.insertId,
      title,
      imageUrl,
      description
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
