const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {

    if (!SECRET_KEY) {
        return res.status(500).json({
            message: "Error de configuración del servidor."
        });
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: "Token no proporcionado."
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Formato de token inválido."
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Token no proporcionado."
        });
    }

    try {
        const tokenDescifrado = jwt.verify(token, SECRET_KEY);
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