const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");

const obtenerMisPreguntas = async (req, res) => {
    try {
        const misPreguntas = await Pregunta.find({
            usuario: req.usuario.id
        })
        .populate({
            path: "vehiculo",
            populate: {
                path: "usuario",
                select: "nombre"
            }
        })
        .sort({ fechaPregunta: -1 });

        const resultado = [];

        for (let i = 0; i < misPreguntas.length; i++) {
            const preguntaActual = misPreguntas[i];

            const respuesta = await Respuesta.findOne({
                pregunta: preguntaActual._id
            });

            resultado.push({
                pregunta: preguntaActual,
                respuesta: respuesta
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener tus preguntas",
            error: error.message
        });
    }
};

module.exports = obtenerMisPreguntas;