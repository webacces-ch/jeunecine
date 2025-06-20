// API route protégée pour vérifier l'authentification
import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = authenticateRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Token non valide ou manquant' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Accès autorisé',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}
