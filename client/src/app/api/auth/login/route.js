// API route pour la connexion d'utilisateur
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('📥 Données reçues par l\'API:', body);
        
        const { email, username, password } = body;
        
        // Accepter soit email soit username
        const loginIdentifier = email || username;
        console.log('🔍 Identifiant de connexion:', loginIdentifier);

        if (!loginIdentifier || !password) {
            console.log('❌ Données manquantes:', { loginIdentifier, password: !!password });
            return NextResponse.json(
                { error: 'Email/Username et mot de passe requis' },
                { status: 400 }
            );
        }

        const connection = await getConnection();

        // Trouver l'utilisateur par email OU username
        const [users] = await connection.execute(
            'SELECT id, username, email, password FROM users WHERE email = ? OR username = ?',
            [loginIdentifier, loginIdentifier]
        );        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Identifiant ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Identifiant ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        // Générer le token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email
        });

        return NextResponse.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}
