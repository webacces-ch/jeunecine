// API route pour un film spécifique
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer un film par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM films WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Film non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Film récupéré:', rows[0].id);
    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un film
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
    const { title, subtitle, youtube, description, imageUrl, videoUrl } = await request.json();
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE films SET title = ?, subtitle = ?, youtube = ?, description = ?, imageUrl = ?, videoUrl = ? WHERE id = ?',
      [title, subtitle, youtube, description, imageUrl, videoUrl, id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Film non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Film mis à jour:', id);
    return NextResponse.json({
      id,
      title,
      subtitle,
      youtube,
      description,
      imageUrl,
      videoUrl
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du film:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un film
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
      'DELETE FROM films WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Film non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('Film supprimé:', id);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
