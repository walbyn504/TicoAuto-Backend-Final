// Validación del código 2FA para completar el inicio de sesión
// Genera un token JWT para el usuario autenticado si el código es correto
const usuario = require('../../modelos/usuario');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Verifica que el cófigo 2FA proporcionado por el usuario sea correcto
const verificarCodigo2FA = async (req, res) => {
    const { usuarioId, codigo } = req.body; // Obtiene el ID del usuario y el código 2FA de la solicitud

    // Valida que se hayan proporcionado el ID del usuario y el código 2FA
    if (!usuarioId || !codigo || !codigo.trim()) {
        return res.status(400).json({
            message: "Usuario y código son requeridos."
        });
    }

    try {
        // Busca el usuario por su ID
        const usuarioEncontrado = await usuario.findById(usuarioId);

        // Si no encuentra el usuario, devuelve mensaje de error
        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        // Verifica que el usuario tenga un inicio de sesión pendiente y que el código este activo
        if (!usuarioEncontrado.loginPendiente) {
            return res.status(400).json({
                message: "No hay un inicio de sesión pendiente."
            });
        }

        // Verifica que el código 2FA exista y sea correcto
        if (!usuarioEncontrado.codigo2FA || !usuarioEncontrado.codigo2FAExpira) {
            return res.status(400).json({
                message: "No hay un código activo."
            });
        }

        // Verifica que el código no haya expirado
        if (usuarioEncontrado.codigo2FAExpira < new Date()) {
            return res.status(400).json({
                message: "El código expiró."
            });
        }

        // Compara el código digitado con el código almacenado
        if (usuarioEncontrado.codigo2FA !== codigo.trim()) {
            return res.status(401).json({
                message: "El código es incorrecto."
            });
        }

        // Si el código es correcto, limpia los campos relacionados y permite el inicio de sesión
        usuarioEncontrado.codigo2FA = null;
        usuarioEncontrado.codigo2FAExpira = null;
        usuarioEncontrado.loginPendiente = false;

        await usuarioEncontrado.save(); // Guarda los cambios en la base de datos

        // Genera el token JWT para el usuario autenticado
        const token = jwt.sign(
            {
                id: usuarioEncontrado._id,
                nombre: usuarioEncontrado.nombre,
                correo: usuarioEncontrado.correo,
                proveedor: usuarioEncontrado.proveedor
            },
            SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        return res.status(200).json({
            message: "Código verificado correctamente.",
            token,
            usuarioId: usuarioEncontrado._id,
            nombre: usuarioEncontrado.nombre,
            proveedor: usuarioEncontrado.proveedor
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    verificarCodigo2FA
};