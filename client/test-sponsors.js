// Test spécifique pour les sponsors et la SponsorPage
async function testSponsors() {
    try {
        // 1. Connexion
        console.log('🔑 Test de connexion...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin' })
        });
        
        const loginData = await loginResponse.json();
        console.log('✅ Login:', loginData.message);
        
        if (!loginData.token) {
            throw new Error('Pas de token reçu');
        }
        
        const token = loginData.token;
        
        // 2. Test route protégée
        console.log('\n🔒 Test de route protégée...');
        const protectedResponse = await fetch('http://localhost:3000/api/auth/protected', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const protectedData = await protectedResponse.json();
        console.log('✅ Route protégée:', protectedData.message);
        
        // 3. Récupération des sponsors
        console.log('\n📋 Récupération des sponsors...');
        const sponsorsResponse = await fetch('http://localhost:3000/api/sponsors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const sponsorsData = await sponsorsResponse.json();
        console.log('✅ Sponsors récupérés:', sponsorsData.length, 'sponsors');
        console.log('Sponsors:', sponsorsData);
        
        // 4. Création d'un sponsor de test
        console.log('\n➕ Création d\'un sponsor de test...');
        const newSponsorResponse = await fetch('http://localhost:3000/api/sponsors', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                imageUrl: '/uploads/sponsors/test-sponsor.jpg',
                link: 'https://exemple-sponsor.com'
            })
        });
        
        if (!newSponsorResponse.ok) {
            const errorData = await newSponsorResponse.json();
            console.log('❌ Erreur création sponsor:', errorData);
        } else {
            const newSponsorData = await newSponsorResponse.json();
            console.log('✅ Sponsor créé:', newSponsorData);
            
            // 5. Test de récupération du sponsor créé
            const sponsorId = newSponsorData.id;
            console.log(`\n🔍 Récupération du sponsor ${sponsorId}...`);
            const singleSponsorResponse = await fetch(`http://localhost:3000/api/sponsors/${sponsorId}`);
            const singleSponsorData = await singleSponsorResponse.json();
            console.log('✅ Sponsor récupéré:', singleSponsorData);
            
            // 6. Test de suppression
            console.log(`\n🗑️ Suppression du sponsor ${sponsorId}...`);
            const deleteResponse = await fetch(`http://localhost:3000/api/sponsors/${sponsorId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (deleteResponse.ok) {
                console.log('✅ Sponsor supprimé avec succès');
            } else {
                const deleteError = await deleteResponse.json();
                console.log('❌ Erreur suppression:', deleteError);
            }
        }
        
        // 7. Test des utilitaires frontend (getApiUrl)
        console.log('\n🛠️ Test des utilitaires frontend...');
        
        // Simuler la fonction getApiUrl
        function getApiUrl(path = "") {
            // En développement, utiliser localhost
            if (process.env.NODE_ENV === 'development') {
                const base = "http://localhost:3000";
                return `${base}${path.startsWith("/") ? path : "/" + path}`;
            }
            return path;
        }
        
        const testUrl = getApiUrl('/api/sponsors');
        console.log('✅ URL générée:', testUrl);
        
        console.log('\n🎉 Tests des sponsors terminés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur dans les tests:', error);
    }
}

testSponsors();
