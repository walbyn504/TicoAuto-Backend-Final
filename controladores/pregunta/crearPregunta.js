const Pregunta = require("../../modelos/pregunta");
const Vehiculo = require("../../modelos/vehiculo");

const crearPregunta = async (req, res) => {
    const { vehiculoId } = req.params;
    const { pregunta } = req.body;

    if (!vehiculoId || !pregunta) {
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

        const nuevaPregunta = new Pregunta({
            vehiculo: vehiculoId,
            usuario: req.usuario.id,
            pregunta: pregunta.trim()
        });

        const preguntaGuardada = await nuevaPregunta.save();

        return res.status(201).json({
            mensaje: "Pregunta creada correctamente.",
            preguntaGuardada
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al crear la pregunta",
            error: error.message
        });
    }
};

module.exports = crearPregunta;