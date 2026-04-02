const crypto = require('crypto');
const usuario = require('../../modelos/usuario');

const verificarCorreo = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Token requerido."
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token.trim())
            .digest('hex');

        const usuarioEncontrado = await usuario.findOne({
            tokenVerificacion: hashedToken
        });

        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "Token inválido o expirado."
            });
        }

        if (usuarioEncontrado.estado === 'activo') {
            return res.status(200).json({
                message: "El usuario ya está verificado."
            });
        }

        usuarioEncontrado.estado = 'activo';
        usuarioEncontrado.tokenVerificacion = null;

        await usuarioEncontrado.save();

        return res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { verificarCorreo };