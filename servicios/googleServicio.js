// Verifica tokens de Google y extraer información del usuario
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Crea un cliente de OAuth2 para verificar los tokens de Google
const client = new OAuth2Client(CLIENT_ID);


const verificarGoogleToken = async (credential) => {
    try {

        // Verifica que el token de Google sea válido y extrae la información del usuario
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID
        });
        
        // Si el token es válido, extrae el correo y el ID de Google del usuario
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