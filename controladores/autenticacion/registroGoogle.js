// Valida los datos, verifica el toeken de google, consulta el padrón, 
// crea el usuario y envía el correo de verificación.
const usuario = require('../../modelos/usuario');
const { consultarCedula } = require('../../servicios/padronServicio');
const { verificarGoogleToken } = require('../../servicios/googleServicio');
const crypto = require('crypto');
const enviarCorreoVerificacion = require('../../servicios/correoServicio');

const registrarUsuarioGoogle = async (req, res) => {
    const { credential, cedula, telefono } = req.body; // Obtiene las credenciales de Google, cédula y teléfono de la solicitud

    try {
        // Valida que se hayan proporcionado los campos obligatorios
        if (!credential || !cedula || !telefono) {
            return res.status(400).json({ message: "Campos obligatorios" });
        }

        // Valida que la cédula tenga el formato correcto
        if (!/^\d{9}$/.test(cedula)) {
            return res.status(400).json({ message: "Cédula inválida" });
        }

        // Verifica el token de Google y obtiene el correo y googleIdd
        const { correo, googleId } = await verificarGoogleToken(credential);

        // Consulta que la cédula exista en el padrón
        const persona = await consultarCedula(cedula);

        // Si la cédula no existe en el padrón, devuelve mensaje de error
        if (!persona) {
            return res.status(400).json({ message: "Cédula no existe" });
        }

        // Verificar que el correo no esté ya registrado
        if (await usuario.findOne({ correo })) {
            return res.status(400).json({ message: "Correo ya registrado" });
        }

        // Verificar que la cédula no esté ya registrada
        if (await usuario.findOne({ cedula })) {
            return res.status(400).json({ message: "Cédula ya registrada" });
        }

        // Genera el token de verificación
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        // Crea un nuevo usuario con los datos proporcionados
        const nuevoUsuario = new usuario({
            cedula,
            nombre: persona.nombre,
            primerApellido: persona.apellidoPaterno,
            segundoApellido: persona.apellidoMaterno,
            telefono,
            correo,
            googleId,
            proveedor: 'google',
            estado: 'pendiente',
            tokenVerificacion: hashedToken
        });

        const usuarioGuardado = await nuevoUsuario.save(); // Guarda el usuario en la base de datos

        // Genera el enlace de verificación con el token
        const linkVerificacion = `http://localhost:5500/html/usuario/verificacion.html?token=${encodeURIComponent(rawToken)}`;

        // Envía el correo de verificación al usuario
        await enviarCorreoVerificacion(
            usuarioGuardado.correo,
            usuarioGuardado.nombre,
            linkVerificacion
        );

        return res
            .status(201)
            .location(`/api/autenticacion/${usuarioGuardado._id}`)
            .json(usuarioGuardado);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registrarUsuarioGoogle
};