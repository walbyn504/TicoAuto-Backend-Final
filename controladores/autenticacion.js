const usuario = require('../modelos/usuario');
const bcrypt = require('bcrypt');

const registrarUsuario = async (req, res) => {
    const { nombre, primerApellido, segundoApellido, correo, contrasenna } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const usuarioExistente = await usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado." });
        }

        // Encriptar la contraseña
        const hashedContrasenna = await bcrypt.hash(contrasenna, 10);

        // Crear nuevo usuario
        const nuevoUsuario = new usuario({
            nombre,
            primerApellido,
            segundoApellido,
            correo,
            contrasenna: hashedContrasenna
        });

        // Guardar el nuevo usuario en la BD
        const usuarioGuardado = await nuevoUsuario.save();
        return res.status(201).json(usuarioGuardado);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registrarUsuario
};