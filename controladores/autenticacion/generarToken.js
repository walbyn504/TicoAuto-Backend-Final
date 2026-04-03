const usuario = require('../../modelos/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET;

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
        const usuarioEncontrado = await usuario.findOne({ correo });

        if (!usuarioEncontrado) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        if (usuarioEncontrado.estado !== 'activo') {
            return res.status(403).json({
                message: "Cuenta no verificada. Revisa tu correo para activarla."
            });
        }

        const esValida = await bcrypt.compare(contrasenna, usuarioEncontrado.contrasenna);

        if (!esValida) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

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
            token,
            nombre: usuarioEncontrado.nombre,
            usuarioId: usuarioEncontrado._id
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generarToken
};