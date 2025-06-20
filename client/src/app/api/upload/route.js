// API route pour l'upload de fichiers
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { authenticateRequest } from '@/lib/auth';

// Fonction pour créer le dossier s'il n'existe pas
async function ensureUploadDir(uploadPath) {
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }
}

// POST - Upload de fichiers
export async function POST(request) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // sponsors, galerie, films, etc.

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier que c'est bien un fichier
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Format de fichier invalide' },
        { status: 400 }
      );
    }

    // Vérifier le type MIME
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Seules les images sont autorisées' },
        { status: 400 }
      );
    }

    // Créer le nom de fichier unique
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.name);
    const filename = `${type}-${timestamp}-${randomSuffix}${extension}`;

    // Définir le chemin d'upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    await ensureUploadDir(uploadDir);

    const filepath = path.join(uploadDir, filename);

    // Convertir le fichier en Buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Retourner l'URL publique du fichier
    const publicUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}

// Configuration pour permettre les fichiers volumineux
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
