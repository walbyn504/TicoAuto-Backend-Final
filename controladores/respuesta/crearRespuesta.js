const Pregunta = require('../../modelos/pregunta');
const Respuesta = require('../../modelos/respuesta');
const Vehiculo = require('../../modelos/vehiculo');

const crearRespuesta = async (req, res) => {
    try {
        const { preguntaId } = req.params;
        const { respuesta } = req.body;

        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        if (!respuesta || !respuesta.trim()) {
            return res.status(400).json({
                message: "La respuesta es obligatoria"
            });
        }

        const pregunta = await Pregunta.findById(preguntaId);

        if (!pregunta) {
            return res.status(404).json({
                message: "Pregunta no encontrada"
            });
        }

        const vehiculo = await Vehiculo.findById(pregunta.vehiculo);

        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        if (vehiculo.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para responder esta pregunta"
            });
        }

        const respuestaExistente = await Respuesta.findOne({ pregunta: preguntaId });

        if (respuestaExistente) {
            return res.status(400).json({
                message: "La pregunta ya fue respondida"
            });
        }

        const nuevaRespuesta = new Respuesta({
            respuesta: respuesta.trim(),
            pregunta: preguntaId,
            usuarioRespuesta: req.usuario.id
        });

        const respuestaCreada = await nuevaRespuesta.save();

        res.status(201).json(respuestaCreada);

    } catch (error) {
        res.status(500).json({
            message: "Error al crear la respuesta"
        });
    }
};

module.exports = {
    crearRespuesta
};