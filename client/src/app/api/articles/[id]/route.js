// API route pour un article spécifique
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer un article par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    const article = {
      ...rows[0],
      tags: rows[0].tags ? JSON.parse(rows[0].tags) : null
    };
    
    console.log('Article récupéré:', article.id);
    return NextResponse.json(article);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un article
export async function PUT(request, { params }) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const { title, content, date, author, status, coverImage, tags, summary } = await request.json();
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE articles SET title = ?, content = ?, date = ?, author = ?, status = ?, coverImage = ?, tags = ?, summary = ? WHERE id = ?',
      [
        title,
        content,
        date,
        author,
        status,
        coverImage || null,
        Array.isArray(tags) ? JSON.stringify(tags) : null,
        summary || null,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Article mis à jour:', id);
    return NextResponse.json({
      id,
      title,
      content,
      date,
      author,
      status,
      coverImage,
      tags,
      summary
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un article
export async function DELETE(request, { params }) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM articles WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Article supprimé:', id);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
