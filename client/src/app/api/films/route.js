// API route pour la gestion des films
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Créer la table films si elle n'existe pas
async function ensureFilmTable() {
  const connection = await getConnection();
  const filmTableSql = `CREATE TABLE IF NOT EXISTS films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    youtube VARCHAR(255),
    description TEXT,
    imageUrl VARCHAR(512),
    videoUrl VARCHAR(255)
  )`;
  
  try {
    await connection.execute(filmTableSql);
  } catch (error) {
    console.error('Erreur création table films:', error);
  }
}

// GET - Récupérer tous les films
export async function GET(request) {
  try {
    await ensureFilmTable();
    const connection = await getConnection();
    
    const [rows] = await connection.execute('SELECT * FROM films');
    
    console.log('Films récupérés:', rows.length);
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau film
export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { title, subtitle, youtube, description, imageUrl, videoUrl } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }
    
    await ensureFilmTable();
    const connection = await getConnection();
      const [result] = await connection.execute(
      'INSERT INTO films (title, subtitle, youtube, description, imageUrl, videoUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle || null, youtube || null, description || null, imageUrl || null, videoUrl || null]
    );
    
    return NextResponse.json({
      id: result.insertId,
      title,
      subtitle,
      youtube,
      description,
      imageUrl,
      videoUrl
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création du film:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
