// Verifica el token de verificación enviado por correo para activar la cuenta
const crypto = require('crypto');
const usuario = require('../../modelos/usuario');

const verificarCorreo = async (req, res) => {
    try {
        const { token } = req.query; // Obtiene el token de la solicitud

        // Validar que el token exista
        if (!token) {
            return res.status(400).json({
                message: "Token requerido."
            });
        }

        // Hash del token para comparar con la BD
        const hashedToken = crypto
            .createHash('sha256')
            .update(token.trim())
            .digest('hex');

        // Busca un usuario con el token de verificación
        const usuarioEncontrado = await usuario.findOne({
            tokenVerificacion: hashedToken
        });

        // Si no encuentra un usuario con el token, devuelve mensaje de error
        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "Token inválido o expirado."
            });
        }

        // Activar el usuario
        usuarioEncontrado.estado = 'activo';
        usuarioEncontrado.tokenVerificacion = null;

        await usuarioEncontrado.save(); // Guarda cambios en la base de datos

        return res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { verificarCorreo };