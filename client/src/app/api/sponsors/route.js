// API route pour la gestion des sponsors
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Créer la table sponsors si elle n'existe pas
async function ensureSponsorTable() {
  const connection = await getConnection();
  const sponsorTableSql = `CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imageUrl VARCHAR(512) NOT NULL,
    link VARCHAR(512)
  )`;
  
  try {
    await connection.execute(sponsorTableSql);
  } catch (error) {
    console.error('Erreur création table sponsors:', error);
  }
}

// GET - Récupérer tous les sponsors
export async function GET(request) {
  try {
    await ensureSponsorTable();
    const connection = await getConnection();
    
    const [rows] = await connection.execute('SELECT * FROM sponsors ORDER BY id DESC');
    
    console.log('Sponsors récupérés:', rows.length);
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des sponsors:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau sponsor
export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { imageUrl, link } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'L\'URL de l\'image est requise' },
        { status: 400 }
      );
    }
    
    await ensureSponsorTable();
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO sponsors (imageUrl, link) VALUES (?, ?)',
      [imageUrl, link]
    );
    
    return NextResponse.json({
      id: result.insertId,
      imageUrl,
      link
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création du sponsor:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
