const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const obtenerPreguntasDeMisVehiculos = async (req, res) => {
    try {
        const misVehiculos = await Vehiculo.find({
            usuario: req.usuario.id
        }).select("_id marca modelo usuario");

        const idsVehiculos = misVehiculos.map(vehiculo => vehiculo._id);

        const preguntas = await Pregunta.find({
            vehiculo: { $in: idsVehiculos }
        })
        .populate("usuario", "nombre")
        .populate({
            path: "vehiculo",
            populate: {
                path: "usuario",
                select: "nombre"
            }
        })
        .sort({ createdAt: -1 });

        const resultado = [];

        for (let i = 0; i < preguntas.length; i++) {
            const preguntaActual = preguntas[i];

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
            mensaje: "Error al obtener preguntas de tus vehículos",
            error: error.message
        });
    }
};

module.exports = obtenerPreguntasDeMisVehiculos;