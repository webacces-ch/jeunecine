// API route pour l'enregistrement d'utilisateur
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    const connection = await getConnection();
    
    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' },
        { status: 409 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);
    
    // Créer l'utilisateur
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    // Générer le token
    const token = generateToken({ 
      id: result.insertId, 
      username, 
      email 
    });
    
    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      token,
      user: { id: result.insertId, username, email }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
