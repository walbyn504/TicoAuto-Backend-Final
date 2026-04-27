
/* Valida los datos, verifica la cédula y el correo, encripta la contraseña, 
y envía un correo de verificación.*/
const usuario = require('../../modelos/usuario');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { consultarCedula } = require('../../servicios/padronServicio');
const enviarCorreoVerificacion = require('../../servicios/correoServicio');

// Valida contraseña
const validarContrasenna = (contrasenna) => {
    const tieneMin = /[a-z]/.test(contrasenna);
    const tieneMay = /[A-Z]/.test(contrasenna);
    const tieneNumero = /\d/.test(contrasenna);
    const tieneEspecial = /[@$!%*?&.#_-]/.test(contrasenna);
    const largoMinimo = contrasenna.length >= 8;

    return tieneMin && tieneMay && tieneNumero && tieneEspecial && largoMinimo;
};

// Valida los datos del registro
const validarDatosRegistro = ({ cedula, telefono, correo, contrasenna }) => {
    if (
        !cedula || !cedula.trim() ||
        !telefono || !telefono.trim() ||
        !correo || !correo.trim() ||
        !contrasenna || !contrasenna.trim()
    ) {
        return "Todos los campos son obligatorios.";
    }

    // valida cédula
    const regexCedula = /^\d{9}$/;
    if (!regexCedula.test(cedula.trim())) {
        return "La cédula debe tener exactamente 9 dígitos.";
    }

    // Valida formato del correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim())) {
        return "El formato del correo no es válido.";
    }

    // Valida teléfono (al menos 8 dígitos)
    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono.trim())) {
        return "El teléfono debe tener al menos 8 dígitos.";
    }

    // Valida contraseña
    if (!validarContrasenna(contrasenna.trim())) {
        return "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.";
    }

    return null;
};

// Registra el nuevo usuario, valida los datos, encripta la contraseña y envía el correo de verificación.
const registrarUsuario = async (req, res) => {
    const { cedula, telefono, correo, contrasenna } = req.body; // Obtiene los datos del cuerpo de la solicitud

    try {
        // Valida los datos del registro
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

        // Verificar que el correo no este ya registrados
        const usuarioExistenteCorreo = await usuario.findOne({ 
            correo: correo.trim().toLowerCase() 
        });

        if (usuarioExistenteCorreo) {
            return res.status(400).json({
                message: "El correo electrónico ya está registrado."
            });
        }

        // Verificar que la cédula no este ya registrada
        const usuarioExistenteCedula = await usuario.findOne({
            cedula: cedula.trim()
        });

        if (usuarioExistenteCedula) {
            return res.status(400).json({
                message: "La cédula ya está registrada."
            });
        }

        // Encripta la contraseña
        const hashedContrasenna = await bcrypt.hash(contrasenna.trim(), 10);
        
        // Generar token de verificación
        const tokenOriginal = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(tokenOriginal).digest('hex');

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

        const usuarioGuardado = await nuevoUsuario.save(); // Guarda el nuevo usuario en la base de datos


        // Genera el enlace de verificación con el token
        const linkVerificacion = `http://localhost:5500/html/usuario/verificacion.html?token=${encodeURIComponent(tokenOriginal)}`;

        // Envía el token de verificación al correo del usuario
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