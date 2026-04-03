const { OAuth2Client } = require('google-auth-library');


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Valida tokens de Google
const client = new OAuth2Client(CLIENT_ID);


const verificarGoogleToken = async (credential) => {
    try {

        // Verifica que el token sea válido y pertenezca al CLIENT_ID
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID
        });
        
        // Extrae los datos del usuario desde el token
        const payload = ticket.getPayload();

        return {
            correo: payload.email,  // correo del usuario
            googleId: payload.sub   // ID único de Google
        };

    } catch (error) {
        throw new Error('Token de Google inválido');
    }
};

module.exports = {
    verificarGoogleToken
};