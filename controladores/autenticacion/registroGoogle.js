const usuario = require('../../modelos/usuario');
const { consultarCedula } = require('../../servicios/padronServicio');
const { verificarGoogleToken } = require('../../utilidades/verificarGoogle');
const crypto = require('crypto');
const enviarCorreoVerificacion = require('../../utilidades/enviarCorreo');

const registrarUsuarioGoogle = async (req, res) => {
    const { credential, cedula, telefono } = req.body;

    try {
        if (!credential || !cedula || !telefono) {
            return res.status(400).json({ message: "Campos obligatorios" });
        }

        if (!/^\d{9}$/.test(cedula)) {
            return res.status(400).json({ message: "Cédula inválida" });
        }

        // Validar Google
        const { correo, googleId } = await verificarGoogleToken(credential);

        // Padrón
        const persona = await consultarCedula(cedula);

        if (!persona) {
            return res.status(400).json({ message: "Cédula no existe" });
        }

        // Validaciones
        if (await usuario.findOne({ correo })) {
            return res.status(400).json({ message: "Correo ya registrado" });
        }

        if (await usuario.findOne({ cedula })) {
            return res.status(400).json({ message: "Cédula ya registrada" });
        }

         // Generar token de verificación
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        // Crear usuario
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

        const usuarioGuardado = await nuevoUsuario.save();

        // Enviar correo de verificación
        const linkVerificacion = `http://localhost:5500/html/usuario/verificacion.html?token=${encodeURIComponent(rawToken)}`;

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