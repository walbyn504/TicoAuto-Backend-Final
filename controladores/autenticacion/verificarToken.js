// Verifica el token JWT para proteger rutas
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware para verificar el token JWT en las solicitudes protegidas
const verificarToken = (req, res, next) => {

    // Verifica que la clave secreta esté configurada
    if (!SECRET_KEY) {
        return res.status(500).json({
            message: "Error de configuración del servidor."
        });
    }

    const authHeader = req.headers['authorization']; // Obtiene el token del encabezado Authorization

    // Verifica que el token esté presente
    if (!authHeader) {
        return res.status(401).json({
            message: "Token no proporcionado."
        });
    }

    // Verifica que el token tenga el formato correcto
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Formato de token inválido."
        });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token del formato 

    // Si el token no está presente, devuelve mensaje de error
    if (!token) {
        return res.status(401).json({
            message: "Token no proporcionado."
        });
    }

    try {
        // Verifica el token
        const tokenDescifrado = jwt.verify(token, SECRET_KEY);
        // Si el token es válido, agrega la información del usuario al objeto de solicitud.
        req.usuario = tokenDescifrado;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado."
        });
    }
};


module.exports = {
    verificarToken,
};