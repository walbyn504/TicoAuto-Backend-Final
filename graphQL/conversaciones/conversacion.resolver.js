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
                if (!contexto.usuario) {
                    throw new Error("Usuario no autenticado");
                }

                const userId = contexto.usuario.id || contexto.usuario.usuarioId || contexto.usuario._id;

                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                const preguntas = await Pregunta.find({
                    usuario: userId
                })
                    .populate("usuario", "nombre primerApellido segundoApellido")
                    .populate({
                        path: "vehiculo",
                        populate: {
                            path: "usuario",
                            select: "nombre primerApellido segundoApellido"
                        }
                    })
                    .sort({ fechaPregunta: -1 });

                const idsPreguntas = preguntas.map((pregunta) => pregunta._id);

                const respuestas = await Respuesta.find({
                    pregunta: { $in: idsPreguntas }
                });

                const mapaRespuestas = {};

                for (let i = 0; i < respuestas.length; i++) {
                    mapaRespuestas[respuestas[i].pregunta.toString()] = respuestas[i];
                }

                return preguntas.map((pregunta) => ({
                    pregunta,
                    respuesta: mapaRespuestas[pregunta._id.toString()] || null
                }));
            } catch (error) {
                console.error(error);
                throw new Error(error.message || "Error al obtener tus conversaciones");
            }
        },

        obtenerConversacionesDeMisVehiculos: async (_, __, contexto) => {
            try {
                if (!contexto.usuario) {
                    throw new Error("Usuario no autenticado");
                }

                const userId = contexto.usuario.id || contexto.usuario.usuarioId || contexto.usuario._id;

                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                const misVehiculos = await Vehiculo.find({
                    usuario: userId
                }).select("_id");

                const idsVehiculos = misVehiculos.map((vehiculo) => vehiculo._id);

                const preguntas = await Pregunta.find({
                    vehiculo: { $in: idsVehiculos }
                })
                    .populate("usuario", "nombre primerApellido segundoApellido")
                    .populate({
                        path: "vehiculo",
                        populate: {
                            path: "usuario",
                            select: "nombre primerApellido segundoApellido"
                        }
                    })
                    .sort({ fechaPregunta: -1 });

                const idsPreguntas = preguntas.map((pregunta) => pregunta._id);

                const respuestas = await Respuesta.find({
                    pregunta: { $in: idsPreguntas }
                });

                const mapaRespuestas = {};

                for (let i = 0; i < respuestas.length; i++) {
                    mapaRespuestas[respuestas[i].pregunta.toString()] = respuestas[i];
                }

                return preguntas.map((pregunta) => ({
                    pregunta,
                    respuesta: mapaRespuestas[pregunta._id.toString()] || null
                }));
            } catch (error) {
                console.error(error);
                throw new Error(error.message || "Error al obtener las conversaciones de tus vehículos");
            }
        }
    }
};

module.exports = conversacionResolvers;