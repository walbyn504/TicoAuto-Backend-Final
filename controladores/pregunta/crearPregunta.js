const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const crearPregunta = async (req, res) => {
    const { vehiculoId } = req.params;
    const { pregunta } = req.body;

    if (!req.usuario) {
        return res.status(401).json({
            mensaje: "Usuario no autenticado."
        });
    }

    if (!vehiculoId || !pregunta || !pregunta.trim()) {
        return res.status(400).json({
            mensaje: "El id del vehículo y la pregunta son requeridos."
        });
    }

    try {
        const vehiculoEncontrado = await Vehiculo.findById(vehiculoId);

        if (!vehiculoEncontrado) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado."
            });
        }

        // El dueño no puede preguntarse a sí mismo
        if (vehiculoEncontrado.usuario.toString() === req.usuario.id) {
            return res.status(403).json({
                mensaje: "No puedes enviar preguntas a tu propio vehículo."
            });
        }

        // Busca todas las preguntas de este usuario sobre este vehículo
        const preguntasUsuario = await Pregunta.find({
            vehiculo: vehiculoId,
            usuario: req.usuario.id
        }).select("_id");

        // Recorre cada pregunta y revisa si ya fue respondida
        for (let i = 0; i < preguntasUsuario.length; i++) {
            const preguntaActual = preguntasUsuario[i];

            const respuestaExistente = await Respuesta.findOne({
                pregunta: preguntaActual._id
            });

            // Si encuentra una pregunta sin respuesta, bloquea
            if (!respuestaExistente) {
                return res.status(400).json({
                    mensaje: "No puedes enviar otra pregunta hasta que la anterior tenga respuesta."
                });
            }
        }

        const nuevaPregunta = new Pregunta({
            vehiculo: vehiculoId,
            usuario: req.usuario.id,
            pregunta: pregunta.trim()
        });

        const preguntaGuardada = await nuevaPregunta.save();

        return res.status(201).json({
            pregunta: preguntaGuardada
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear la pregunta",
            error: error.message
        });
    }
};

module.exports = crearPregunta;