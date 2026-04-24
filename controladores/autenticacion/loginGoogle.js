// Verifica las credenciales de Google, busca el usuario en la base de datos
// Y genera un JWT si el usuario está activo.

const usuario = require('../../modelos/usuario');
const jwt = require('jsonwebtoken');
const { verificarGoogleToken } = require('../../servicios/googleServicio');

const loginGoogle = async (req, res) => {
    const { credential } = req.body; // Obtiene las credenciales de Google

    try {
        // Verifica que se haya proporcionado la credencial
        if (!credential) {
            return res.status(400).json({ message: "Credencial requerida" });
        }

        // Validar la crendecial con Google y obtener el correo y googleId
        const { correo, googleId } = await verificarGoogleToken(credential);

        // Busca un usuario con el correo, googleId y proveedor 
        const usuarioEncontrado = await usuario.findOne({
            correo,
            googleId,
            proveedor: 'google'
        });

        // Si no encuentra un usuario; devuelve mensaje de error
        if (!usuarioEncontrado) {
            return res.status(404).json({
                message: "Usuario no registrado con Google"
            });
        }

        // Si el usuario existe pero no está activo, devuelve mensaje de error
        if (usuarioEncontrado.estado !== 'activo') {
            return res.status(403).json({
                message: "Cuenta no verificada. Revisa tu correo para activarla."
            });
        }

        // Genera un token (JWT) para el usuario autenticado
        const token = jwt.sign(
            {
                // Información que se incluirá en el token
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