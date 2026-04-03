const usuario = require('../../modelos/usuario');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { consultarCedula } = require('../../servicios/padronServicio');

const enviarCorreoVerificacion = require('../../servicios/correoServicio');

const validarContrasenna = (contrasenna) => {
    const tieneMin = /[a-z]/.test(contrasenna);
    const tieneMay = /[A-Z]/.test(contrasenna);
    const tieneNumero = /\d/.test(contrasenna);
    const tieneEspecial = /[@$!%*?&.#_-]/.test(contrasenna);
    const largoMinimo = contrasenna.length >= 8;

    return tieneMin && tieneMay && tieneNumero && tieneEspecial && largoMinimo;
};

const validarDatosRegistro = ({ cedula, telefono, correo, contrasenna }) => {
    if (
        !cedula || !cedula.trim() ||
        !telefono || !telefono.trim() ||
        !correo || !correo.trim() ||
        !contrasenna || !contrasenna.trim()
    ) {
        return "Todos los campos son obligatorios.";
    }

    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula.trim())) {
        return "La cédula debe tener exactamente 9 dígitos.";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim())) {
        return "El formato del correo no es válido.";
    }

    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono.trim())) {
        return "El teléfono debe tener al menos 8 dígitos.";
    }

    if (!validarContrasenna(contrasenna.trim())) {
        return "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.";
    }

    return null;
};

const registrarUsuario = async (req, res) => {
    const { cedula, telefono, correo, contrasenna } = req.body;

    try {
        const errorValidacion = validarDatosRegistro({
            cedula,
            telefono,
            correo,
            contrasenna
        });

        if (errorValidacion) {
            return res.status(400).json({
                message: errorValidacion
            });
        }

        // Verificar que la cédula exista en el padrón
        const persona = await consultarCedula(cedula.trim());

        if (!persona) {
            return res.status(400).json({
                message: "La cédula no existe en el padrón."
            });
        }

        // Verificar que el correo y la cédula no estén ya registrados
        const usuarioExistenteCorreo = await usuario.findOne({ 
            correo: correo.trim().toLowerCase() 
        });

        if (usuarioExistenteCorreo) {
            return res.status(400).json({
                message: "El correo electrónico ya está registrado."
            });
        }

        const usuarioExistenteCedula = await usuario.findOne({
            cedula: cedula.trim()
        });

        if (usuarioExistenteCedula) {
            return res.status(400).json({
                message: "La cédula ya está registrada."
            });
        }

        // Encriptar la contraseña
        const hashedContrasenna = await bcrypt.hash(contrasenna.trim(), 10);
        
        // Generar token de verificación
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const nuevoUsuario = new usuario({
            cedula: cedula.trim(),
            nombre: persona.nombre,
            primerApellido: persona.apellidoPaterno,
            segundoApellido: persona.apellidoMaterno,
            telefono: telefono.trim(),
            correo: correo.trim().toLowerCase(),
            contrasenna: hashedContrasenna,
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
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registrarUsuario
};