const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const crearPregunta = async (req, res) => {
    const { vehiculoId } = req.params;
    const { pregunta } = req.body;

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

        

        // Buscar la última pregunta que este usuario hizo sobre este vehículo
        const ultimaPregunta = await Pregunta.findOne({
            vehiculo: vehiculoId,
            usuario: req.usuario.id
        }).sort({ createdAt: -1 }); // Ordena por fecha de creación descendente


        // SI hay una pregunta
        if (ultimaPregunta) {
            // Busca una respuesta asociada a la última pregunta
            const respuestaExistente = await Respuesta.findOne({
                pregunta: ultimaPregunta._id
            });

            // Si no existe respuesta, pregunta pendiente
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

        return res.status(201).json({preguntaGuardada});

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear la pregunta",
            error: error.message
        });
    }
};

module.exports = crearPregunta;