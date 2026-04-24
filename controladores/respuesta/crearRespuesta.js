// Verifica que el usuario tenga permiso para responder, que la pregunta exista, y que aún no haya una respuesta.
const Pregunta = require('../../modelos/pregunta');
const Respuesta = require('../../modelos/respuesta');
const Vehiculo = require('../../modelos/vehiculo');

const crearRespuesta = async (req, res) => {
    try {
        const { preguntaId } = req.params; // Obtiene el ID de la pregunta
        const { respuesta } = req.body; // Obtiene la respuesta del cuerpo de la solicitud

        // Verifica que la respuesta no esté vacía
        if (!respuesta || !respuesta.trim()) {
            return res.status(400).json({
                message: "La respuesta es obligatoria"
            });
        }

        // Busca la pregunta correspondiente
        const pregunta = await Pregunta.findById(preguntaId);

        // Si la pregunta no existe, devuelve un error
        if (!pregunta) {
            return res.status(404).json({
                message: "Pregunta no encontrada"
            });
        }

         // Busca el vehículo relacionado con la pregunta
        const vehiculo = await Vehiculo.findById(pregunta.vehiculo);

        // Si el vehículo no existe, devuelve un error
        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        // Verifica que el usuario que responde sea el dueño del vehículo
        if (vehiculo.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para responder esta pregunta"
            });
        }

         // Verifica si la pregunta ya ha sido respondida
        const respuestaExistente = await Respuesta.findOne({ pregunta: preguntaId });

        // Si ya hay una respuesta, devuelve un error
        if (respuestaExistente) {
            return res.status(400).json({
                message: "La pregunta ya fue respondida"
            });
        }

        // Crea una nueva respuesta
        const nuevaRespuesta = new Respuesta({
            respuesta: respuesta.trim(),
            pregunta: preguntaId,
            usuarioRespuesta: req.usuario.id
        });

        const respuestaCreada = await nuevaRespuesta.save(); // Guarda la respuesta en la base de datos

        res
            .status(201)
            .location(`/api/respuestas/${respuestaCreada._id}`)
            .json(respuestaCreada);

    } catch (error) {
        res.status(500).json({
            message: "Error al crear la respuesta"
        });
    }
};

module.exports = {
    crearRespuesta
};