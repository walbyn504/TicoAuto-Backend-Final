const usuario = require('../../modelos/usuario');
const jwt = require('jsonwebtoken');
const { verificarGoogleToken } = require('../../utilidades/verificarGoogle');

const loginGoogle = async (req, res) => {
    const { credential } = req.body;

    try {
        if (!credential) {
            return res.status(400).json({ message: "Credencial requerida" });
        }

        // Validar Google
        const { correo, googleId } = await verificarGoogleToken(credential);

        const usuarioEncontrado = await usuario.findOne({
            correo,
            googleId,
            proveedor: 'google'
        });

        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "Usuario no registrado con Google"
            });
        }

        if (usuarioEncontrado.estado !== 'activo') {
            return res.status(403).json({
                message: "Cuenta no verificada. Revisa tu correo para activarla."
            });
        }

        const token = jwt.sign(
            {
                id: usuarioEncontrado._id,
                nombre: usuarioEncontrado.nombre,
                correo: usuarioEncontrado.correo,
                proveedor: usuarioEncontrado.proveedor
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        return res.status(200).json({
            token,
            usuario: usuarioEncontrado
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginGoogle
};