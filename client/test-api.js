// Script de test pour toutes les routes API Next.js
const API_BASE = 'http://localhost:3000/api';

// Fonction utilitaire pour faire des requêtes
async function makeRequest(method, url, data = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        console.log(`${method} ${url}:`, {
            status: response.status,
            success: response.ok,
            data: result
        });
        
        return { response, result };
    } catch (error) {
        console.error(`${method} ${url} ERROR:`, error);
        return { error };
    }
}

async function testAllRoutes() {
    console.log('🚀 Test de toutes les routes API Next.js');
    console.log('=' .repeat(50));

    let token = null;

    // 1. Test de connexion pour obtenir un token
    console.log('📝 1. Test de connexion');
    const loginResult = await makeRequest('POST', `${API_BASE}/auth/login`, {
        username: 'admin',
        password: 'admin'
    });
    
    if (loginResult.result && loginResult.result.token) {
        token = loginResult.result.token;
        console.log('✅ Token obtenu:', token.substring(0, 20) + '...');
    }

    // 2. Test de la route protégée
    console.log('\n🔒 2. Test de route protégée');
    await makeRequest('GET', `${API_BASE}/auth/protected`, null, token);

    // 3. Test des articles
    console.log('\n📰 3. Test des articles');
    await makeRequest('GET', `${API_BASE}/articles`);
    await makeRequest('GET', `${API_BASE}/articles?published=true`);
    
    // Créer un article de test
    const articleData = {
        title: 'Article de test',
        content: 'Contenu de test',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        status: 'published',
        summary: 'Résumé de test'
    };
    const articleResult = await makeRequest('POST', `${API_BASE}/articles`, articleData, token);
    
    if (articleResult.result && articleResult.result.id) {
        const articleId = articleResult.result.id;
        await makeRequest('GET', `${API_BASE}/articles/${articleId}`);
        await makeRequest('PUT', `${API_BASE}/articles/${articleId}`, {
            ...articleData,
            title: 'Article modifié'
        }, token);
    }

    // 4. Test des films
    console.log('\n🎬 4. Test des films');
    await makeRequest('GET', `${API_BASE}/films`);
    
    const filmData = {
        title: 'Film de test',
        subtitle: 'Sous-titre',
        youtube: 'dQw4w9WgXcQ',
        description: 'Description du film'
    };
    const filmResult = await makeRequest('POST', `${API_BASE}/films`, filmData, token);
    
    if (filmResult.result && filmResult.result.id) {
        const filmId = filmResult.result.id;
        await makeRequest('GET', `${API_BASE}/films/${filmId}`);
    }

    // 5. Test des sponsors
    console.log('\n🏢 5. Test des sponsors');
    await makeRequest('GET', `${API_BASE}/sponsors`);
    
    const sponsorData = {
        imageUrl: '/uploads/sponsors/test.jpg',
        link: 'https://example.com'
    };
    await makeRequest('POST', `${API_BASE}/sponsors`, sponsorData, token);

    // 6. Test de la galerie
    console.log('\n🖼️ 6. Test de la galerie');
    await makeRequest('GET', `${API_BASE}/galerie`);
    
    const galerieData = {
        title: 'Image de test',
        imageUrl: '/uploads/galerie/test.jpg',
        description: 'Description de l\'image'
    };
    await makeRequest('POST', `${API_BASE}/galerie`, galerieData, token);

    // 7. Test des utilisateurs
    console.log('\n👤 7. Test des utilisateurs');
    await makeRequest('GET', `${API_BASE}/user/me`, null, token);

    console.log('\n✅ Tests terminés!');
}

// Exécuter les tests si ce fichier est lancé directement
if (require.main === module) {
    testAllRoutes().catch(console.error);
}

module.exports = { testAllRoutes, makeRequest };
