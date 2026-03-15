
const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const obtenerPreguntasDeMisVehiculos = async (req, res) => {
    try {
        const misVehiculos = await Vehiculo.find({
            usuario: req.usuario.id
        }).select("_id");

        const idsVehiculos = [];

        for (let i = 0; i < misVehiculos.length; i++) {
            const vehiculo = misVehiculos[i];
            idsVehiculos.push(vehiculo._id);
        }

        const preguntas = await Pregunta.find({
            // Buscar preguntas con los ID de mis vehículos
            vehiculo: { $in: idsVehiculos } 
        })
            .populate("usuario", "nombre primerApellido segundoApellido")
            .populate({
                path: "vehiculo",
                populate: {
                    path: "usuario",
                    select: "nombre"
                }
            })
            .sort({ fechaPregunta: -1 });

        const resultado = [];

        for (let i = 0; i < preguntas.length; i++) {
            const pregunta = preguntas[i];

            const respuesta = await Respuesta.findOne({
                pregunta: pregunta._id
            });

            resultado.push({
                pregunta: pregunta,
                respuesta: respuesta || null
            });
        }

        res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener preguntas de tus vehículos",
            error: error.message
        });
    }
};

module.exports = obtenerPreguntasDeMisVehiculos;