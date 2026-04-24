// Verifica el correo, la contraseña, y genera un código de verificación 2FA si todo es válido.
const usuario = require('../../modelos/usuario');
const bcrypt = require('bcrypt');
const enviarCodigoSMS = require('../../servicios/mensajeServicio');

// Genera un código de 6 dígitos para la verificación 2FA.
const generarCodigo2FA = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verifica el correo, la contraseña, y genera un código de verificación 2FA si todo es correcto.
const loginLocal = async (req, res) => {
    const { correo, contrasenna } = req.body;

    // valida que no esten vacíos el correo y la contraseña, y que el formato del correo sea correcto.
    if (!correo || !correo.trim() || !contrasenna || !contrasenna.trim()) {
        return res.status(400).json({
            message: "Correo y contraseña son requeridos."
        });
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión para validar formato de correo

    // Valida el formato del correo
    if (!regexCorreo.test(correo.trim())) {
        return res.status(400).json({
            message: "El formato del correo no es válido."
        });
    }

    try {
        // Busca un usuario con el correo digitado
        const usuarioEncontrado = await usuario.findOne({
            correo: correo.trim().toLowerCase() // Busqueda insensible a mayúsculas y espacios en blanco
        });

        // Si no encuentra un usuario con el correo digitado; devuelve mensaje de error
        if (!usuarioEncontrado) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos."
            });
        }

        // Si el usuario existe pero no está activo, devuelve mensaje de error
        if (usuarioEncontrado.estado !== 'activo') {
            return res.status(403).json({
                message: "Cuenta no verificada. Revisa tu correo para activarla."
            });
        }

        // Si el usuario posteriormente se regsitró con Google, no se le permite iniciar sesión con correo y contraseña
        if (usuarioEncontrado.proveedor === 'google') {
            return res.status(400).json({
                message: "Este usuario debe iniciar sesión con Google."
            });
        }

        // Compara la contraseña digitada con la conytraseña de la base de datos
        const esValida = await bcrypt.compare(
            contrasenna.trim(),
            usuarioEncontrado.contrasenna
        );

        // Si la contraseña no es válida, devuelve mensaje de error
        if (!esValida) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos."
            });
        }

        // Si el usuario no tiene un número telefónico registrado, devuelve mensaje de error
        if (!usuarioEncontrado.telefono) {
            return res.status(400).json({
                message: "El usuario no tiene un número telefónico registrado."
            });
        }

        const codigo = generarCodigo2FA(); // Genera el código de verificación 2FA
        const fechaExpiracion = new Date(Date.now() + 1 * 60 * 1000); // Tiempo de expiración de 1 minuto

        // Guarda el código 2FA y fechaExpiración en el usuario (en la base de datos)
        usuarioEncontrado.codigo2FA = codigo;
        usuarioEncontrado.codigo2FAExpira = fechaExpiracion;
        usuarioEncontrado.loginPendiente = true; 

        await usuarioEncontrado.save(); // Guarda los cambios en la base de datos

        try {
            // Envía el código de verificación al teléfono del usuario
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
    loginLocal
};