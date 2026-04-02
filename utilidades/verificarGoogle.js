const { OAuth2Client } = require('google-auth-library');

// ID de cliente (Google Cloud)
const CLIENT_ID = '817077174471-bt5e6bh7eelg0989ksook2k9m1eu9tbp.apps.googleusercontent.com';

// Valida tokens de Google
const client = new OAuth2Client(CLIENT_ID);

// Valida el token recibido
const verificarGoogleToken = async (credential) => {

    // Verifica que el token sea válido y pertenezca al CLIENT_ID
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID
    });

    // Extrae los datos del usuario desde el token
    const payload = ticket.getPayload();

    return {
        correo: payload.email,     // correo del usuario
        googleId: payload.sub      // ID único de Google
    };
};

module.exports = {
    verificarGoogleToken
};