// Test spécifique pour les films
async function testFilm() {
    try {
        // 1. Connexion
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin' })
        });
        
        const loginData = await loginResponse.json();
        console.log('Login:', loginData);
        
        if (!loginData.token) {
            throw new Error('Pas de token reçu');
        }
        
        // 2. Création de film
        const filmResponse = await fetch('http://localhost:3000/api/films', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                title: 'Film de test',
                subtitle: 'Sous-titre de test',
                youtube: 'dQw4w9WgXcQ',
                description: 'Description du film de test'
            })
        });
        
        const filmData = await filmResponse.json();
        console.log('Film créé:', filmData);
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

testFilm();
