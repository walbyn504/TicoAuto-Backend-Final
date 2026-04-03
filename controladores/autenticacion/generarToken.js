const usuario = require('../../modelos/usuario');
const bcrypt = require('bcrypt');
const enviarCodigoSMS = require('../../servicios/enviarCodigoSMS');

const generarCodigo2FA = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generarToken = async (req, res) => {
    const { correo, contrasenna } = req.body;

    if (!correo || !correo.trim() || !contrasenna || !contrasenna.trim()) {
        return res.status(400).json({
            message: "Correo y contraseña son requeridos."
        });
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo.trim())) {
        return res.status(400).json({
            message: "El formato del correo no es válido."
        });
    }

    try {
        const usuarioEncontrado = await usuario.findOne({
            correo: correo.trim().toLowerCase()
        });

        if (!usuarioEncontrado) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos."
            });
        }

        if (usuarioEncontrado.estado !== 'activo') {
            return res.status(403).json({
                message: "Cuenta no verificada. Revisa tu correo para activarla."
            });
        }

        if (usuarioEncontrado.proveedor === 'google') {
            return res.status(400).json({
                message: "Este usuario debe iniciar sesión con Google."
            });
        }

        const esValida = await bcrypt.compare(
            contrasenna.trim(),
            usuarioEncontrado.contrasenna
        );

        if (!esValida) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos."
            });
        }

        if (!usuarioEncontrado.telefono) {
            return res.status(400).json({
                message: "El usuario no tiene un número telefónico registrado."
            });
        }

        const codigo = generarCodigo2FA();
        const fechaExpiracion = new Date(Date.now() + 1 * 60 * 1000);

        usuarioEncontrado.codigo2FA = codigo;
        usuarioEncontrado.codigo2FAExpira = fechaExpiracion;
        usuarioEncontrado.loginPendiente = true;

        await usuarioEncontrado.save();

        try {
            await enviarCodigoSMS(usuarioEncontrado.telefono, codigo);
        } catch (error) {
            return res.status(500).json({
                message: "No se pudo enviar el SMS. Contacte a su administrador."
            });
        }

        return res.status(200).json({
            requiere2FA: true,
            usuarioId: usuarioEncontrado._id,
            codigo2FAExpira: fechaExpiracion.toISOString(),
            message: "Se envió un código de verificación a tu teléfono."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    generarToken
};