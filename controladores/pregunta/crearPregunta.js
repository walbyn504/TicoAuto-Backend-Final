// Verifica que el usuario no se pregunte a sí mismo, que no tenga preguntas pendientes sin respuesta, 
// y luego guarda la nueva pregunta.
const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const crearPregunta = async (req, res) => {
    const { vehiculoId } = req.params; // Obtiene el ID del vehículo de los parámetros de la ruta
    const { pregunta } = req.body; // Obtiene el texto del cuerpo de la pregunta de la solicitud


    // Valida que se hayan proporcionado el ID del vehículo y el texto de la pregunta
    if (!vehiculoId || !pregunta || !pregunta.trim()) {
        return res.status(400).json({
            mensaje: "El id del vehículo y la pregunta son requeridos."
        });
    }

    try {
        const vehiculoEncontrado = await Vehiculo.findById(vehiculoId); // Busca el vehículo por su ID

        // Si no encuentra el vehículo, muestra un mensaje de error
        if (!vehiculoEncontrado) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado."
            });
        }

        // Valida que el dueño no puede preguntarse a sí mismo
        if (vehiculoEncontrado.usuario.toString() === req.usuario.id) {
            return res.status(403).json({
                mensaje: "No puedes enviar preguntas a tu propio vehículo."
            });
        }

        // Busca las preguntas del usuario autenticado para ese vehículo
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
                    mensaje: "Debes esperar a que tu pregunta anterior sea respondida."
                });
            }
        }

        // Si pasa todas las validaciones, crea y guarda la nueva pregunta
        const nuevaPregunta = new Pregunta({
            vehiculo: vehiculoId,
            usuario: req.usuario.id,
            pregunta: pregunta.trim()
        });

        const preguntaGuardada = await nuevaPregunta.save(); // Guarda la pregunta en la base de datos

        res
            .status(201)
            .location(`/api/pregunta/${preguntaGuardada._id}`)
            .json(preguntaGuardada);

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear la pregunta",
            error: error.message
        });
    }
};

module.exports = crearPregunta;