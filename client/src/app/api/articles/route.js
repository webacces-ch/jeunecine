// API route pour la gestion des articles
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// Créer la table articles si elle n'existe pas
async function ensureArticleTable() {
  const connection = await getConnection();
  const articleTableSql = `CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    coverImage VARCHAR(512),
    tags TEXT,
    summary TEXT
  )`;
  
  try {
    await connection.execute(articleTableSql);
  } catch (error) {
    console.error('Erreur création table articles:', error);
  }
}

// GET - Récupérer tous les articles
export async function GET(request) {
  try {
    await ensureArticleTable();
    const connection = await getConnection();
    
    const url = new URL(request.url);
    const published = url.searchParams.get('published');
    
    let query = 'SELECT * FROM articles';
    let params = [];
    
    if (published === 'true') {
      query += ' WHERE status = ? ORDER BY date DESC';
      params = ['published'];
    }
    
    const [rows] = await connection.execute(query, params);
    
    // Parse les tags JSON
    const articles = rows.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : null
    }));
    
    console.log('Articles récupérés:', articles.length);
    return NextResponse.json(articles);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel article
export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { title, content, date, author, status, coverImage, tags, summary } = await request.json();
    
    if (!title || !content || !date || !author || !status) {
      return NextResponse.json(
        { error: 'Champs manquants' },
        { status: 400 }
      );
    }
    
    await ensureArticleTable();
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO articles (title, content, date, author, status, coverImage, tags, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        content,
        date,
        author,
        status,
        coverImage || null,
        Array.isArray(tags) ? JSON.stringify(tags) : null,
        summary || null
      ]
    );
    
    return NextResponse.json({
      id: result.insertId,
      title,
      content,
      date,
      author,
      status,
      coverImage,
      tags,
      summary
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
