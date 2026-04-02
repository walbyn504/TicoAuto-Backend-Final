const crypto = require('crypto');
const usuario = require('../../modelos/usuario');

const verificarCorreo = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.json({ ok: false });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token.trim())
            .digest('hex');

        const usuarioEncontrado = await usuario.findOne({
            tokenVerificacion: hashedToken
        });

        if (!usuarioEncontrado) {
            return res.json({ ok: false });
        }

        usuarioEncontrado.estado = 'activo';
        usuarioEncontrado.tokenVerificacion = null;

        await usuarioEncontrado.save();

        return res.json({ ok: true });

    } catch (error) {
        console.error(error);
        return res.json({ ok: false });
    }
};

module.exports = { verificarCorreo };