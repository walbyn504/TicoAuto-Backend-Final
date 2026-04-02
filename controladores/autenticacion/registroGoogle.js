const usuario = require('../../modelos/usuario');
const { consultarCedula } = require('../../servicios/padronServicio');
const { verificarGoogleToken } = require('../../utilidades/verificarGoogle');

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
            estado: 'activo'
        });

        await nuevoUsuario.save();

        return res.status(201).json({
            message: "Usuario registrado con Google"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registrarUsuarioGoogle
};