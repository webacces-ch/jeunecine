// API route pour une image de galerie spécifique
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer une image de galerie par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM galerie WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une image de galerie
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
    const { title, imageUrl, description } = await request.json();
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE galerie SET title = ?, imageUrl = ?, description = ? WHERE id = ?',
      [title, imageUrl, description, id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id,
      title,
      imageUrl,
      description
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image de galerie
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
      'DELETE FROM galerie WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
