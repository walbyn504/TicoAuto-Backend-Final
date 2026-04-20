const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const conversacionResolvers = {
    Pregunta: {
        id: (doc) => String(doc._id)
    },

    Respuesta: {
        id: (doc) => String(doc._id),
        pregunta: (doc) => String(doc.pregunta),
        usuarioRespuesta: (doc) => String(doc.usuarioRespuesta)
    },

    Query: {
        obtenerMisConversaciones: async (_, __, contexto) => {
            try {

                const userId = contexto.usuario?.id;

                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                const misPreguntas = await Pregunta.find({
                    usuario: userId
                })
                    .populate("usuario", "_id nombre")
                    .populate({
                        path: "vehiculo",
                        populate: {
                            path: "usuario",
                            select: "_id nombre"
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
                        respuesta: respuesta || null
                    });
                }

                return resultado;

            } catch (error) {
                console.error(error);
                throw new Error(error.message || "Error al obtener tus conversaciones");
            }
        },

        obtenerConversacionesDeMisVehiculos: async (_, __, contexto) => {
            try {

                const userId = contexto.usuario?.id;

                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                const misVehiculos = await Vehiculo.find({
                    usuario: userId
                }).select("_id");

                const idsVehiculos = [];

                for (let i = 0; i < misVehiculos.length; i++) {
                    const vehiculo = misVehiculos[i];
                    idsVehiculos.push(vehiculo._id);
                }

                const preguntas = await Pregunta.find({
                    vehiculo: { $in: idsVehiculos }
                })
                    .populate("usuario", "_id nombre primerApellido segundoApellido")
                    .populate({
                        path: "vehiculo",
                        populate: {
                            path: "usuario",
                            select: "_id nombre"
                        }
                    })
                    .sort({ fechaPregunta: -1 });

                const resultado = [];

                for (let i = 0; i < preguntas.length; i++) {
                    const preguntaActual = preguntas[i];

                    const respuesta = await Respuesta.findOne({
                        pregunta: preguntaActual._id
                    });

                    resultado.push({
                        pregunta: preguntaActual,
                        respuesta: respuesta || null
                    });
                }

                return resultado;

            } catch (error) {
                console.error(error);
                throw new Error(error.message || "Error al obtener las conversaciones de tus vehículos");
            }
        }
    }
};

module.exports = conversacionResolvers;