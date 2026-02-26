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
            contrasenna: hashedContrasenna,
            token: null
        });

        // Guardar el nuevo usuario en la BD
        const usuarioGuardado = await nuevoUsuario.save();
        return res.status(201).json(usuarioGuardado);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const generarToken = async (req, res) => {
    const { correo, contrasenna } = req.body;

    if (!correo || !contrasenna) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos." });
    }

    try {
        // Buscar el usuario por correo
    const usuarioEncontrado = await usuario.findOne({ correo });

    if (!usuarioEncontrado) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    const esValida = await bcrypt.compare(contrasenna, usuarioEncontrado.contrasenna);

    if (!esValida) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }
        // Generar un token (en este caso, simplemente un hash del correo y contraseña)
        const token = await bcrypt.hash(correo + contrasenna, 10);

        // Guardar el token en la base de datos
        usuarioEncontrado.token = token;
        await usuarioEncontrado.save();
        return res.status(201).json({ token: usuarioEncontrado.token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assuming Bearer token format

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    try {
        const usuarioEncontrado = await usuario.findOne({ token });
        if (!usuarioEncontrado) {
            return res.status(401).json({ message: "Token inválido." });
        }
        req.usuario = usuarioEncontrado;
        // Continuar con la siguiente función de middleware o ruta
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registrarUsuario,
    generarToken,
    verificarToken
};