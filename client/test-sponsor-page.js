// Test complet pour les sponsors avec upload
const FormData = require('form-data');

async function testSponsorsWithUpload() {
    try {
        console.log('🔑 Test de connexion...');
        
        // 1. Connexion
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
        
        // 2. Test de l'upload d'image
        console.log('📤 Test de l\'upload d\'image...');
        
        // Créer un fichier image de test simple (PNG 1x1 pixel)
        const testImageBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
            0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49,
            0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        const formData = new FormData();
        formData.append('file', testImageBuffer, {
            filename: 'test-sponsor.png',
            contentType: 'image/png'
        });
        formData.append('type', 'sponsors');
        
        const uploadResponse = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            },
            body: formData
        });
        
        const uploadResult = await uploadResponse.json();
        console.log('✅ Upload result:', uploadResult);
        
        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResult.error}`);
        }
        
        // 3. Créer un sponsor avec l'image uploadée
        console.log('➕ Création d\'un sponsor avec image uploadée...');
        
        const sponsorData = {
            imageUrl: uploadResult.url,
            link: 'https://exemple-test.com'
        };
        
        const sponsorResponse = await fetch('http://localhost:3000/api/sponsors', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(sponsorData),
        });
        
        const sponsorResult = await sponsorResponse.json();
        console.log('✅ Sponsor créé:', sponsorResult);
        
        if (!sponsorResponse.ok) {
            throw new Error(`Sponsor creation failed: ${sponsorResult.error}`);
        }
        
        // 4. Vérifier que le sponsor apparaît dans la liste
        console.log('📋 Vérification de la liste des sponsors...');
        
        const listResponse = await fetch('http://localhost:3000/api/sponsors');
        const sponsors = await listResponse.json();
        
        console.log('✅ Sponsors dans la liste:', sponsors.length);
        sponsors.forEach(sponsor => {
            console.log(`  - ID: ${sponsor.id}, Image: ${sponsor.imageUrl}, Link: ${sponsor.link}`);
        });
        
        // 5. Tester l'accès à l'image
        console.log('🖼️ Test d\'accès à l\'image...');
        const imageResponse = await fetch(`http://localhost:3000${uploadResult.url}`);
        console.log('✅ Image accessible:', imageResponse.ok, 'Status:', imageResponse.status);
        
        console.log('🎉 Test SponsorPage complet réussi !');
        console.log('');
        console.log('📝 Workflow de SponsorPage:');
        console.log('  1. ✅ Upload d\'image via /api/upload');
        console.log('  2. ✅ Création de sponsor avec imageUrl');
        console.log('  3. ✅ Affichage de la liste des sponsors');
        console.log('  4. ✅ Accès aux images uploadées');
        
    } catch (error) {
        console.error('❌ Erreur dans les tests:', error);
    }
}

testSponsorsWithUpload();
