// API route pour un sponsor spécifique
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer un sponsor par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM sponsors WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Sponsor non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error('Erreur lors de la récupération du sponsor:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un sponsor
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
    const { imageUrl, link } = await request.json();
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE sponsors SET imageUrl = ?, link = ? WHERE id = ?',
      [imageUrl, link, id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Sponsor non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id,
      imageUrl,
      link
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du sponsor:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un sponsor
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
      'DELETE FROM sponsors WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Sponsor non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur lors de la suppression du sponsor:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
