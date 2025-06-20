// API route pour les utilisateurs
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

// GET - Obtenir les informations de l'utilisateur connecté
export async function GET(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [user.id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les informations de l'utilisateur
export async function PUT(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }
    
    const { username, email } = await request.json();
    
    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username et email sont requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Vérifier si le username ou email existe déjà (pour un autre utilisateur)
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, user.id]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Ce username ou email est déjà utilisé' },
        { status: 409 }
      );
    }
    
    // Mettre à jour l'utilisateur
    const [result] = await connection.execute(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, user.id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    
    // Récupérer les données mises à jour
    const [updatedRows] = await connection.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [user.id]
    );
    
    return NextResponse.json(updatedRows[0]);
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
