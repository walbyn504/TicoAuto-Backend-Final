
/* Contexto de autenticación para GraphQL. Verifica el token JWT en los headers de la solicitud 
y proporciona los datos del usuario autenticado.*/

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const context = ({ req }) => {
    //Si no hay una clave secreta definida, no permite el acceso al usuario
    if (!SECRET_KEY) {
        return { usuario: null };
    }

    const authHeader = req.headers['authorization']; // Obtiene el token de las headers de la solicitud

    // Si no hay un token, devuelve un usuario nulo
    if (!authHeader) {
        return { usuario: null };
    }

    // Verifica que el token tenga formato "Bearer"
    if (!authHeader.startsWith('Bearer ')) {
        return { usuario: null };
    }

    const token = authHeader.split(' ')[1]; // Extrae el token del formato

    // Si no hay token, devuelve un usuario nulo
    if (!token) {
        return { usuario: null };
    }

    try {
        // Verifica el token y obtiene los datos del usuario autenticado
        const tokenDescifrado = jwt.verify(token, SECRET_KEY);
        return { usuario: tokenDescifrado };
    } catch (error) {
        return { usuario: null };
    }
};

module.exports = context;