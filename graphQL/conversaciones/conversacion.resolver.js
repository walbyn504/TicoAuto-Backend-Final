
/*Resolvers de GraphQL para manejar las conversaciones entre usuarios interesados y vendedores. 
Permite obtener preguntas y respuestas relacionadas con los vehículos de un usuario, 
tanto para el usuario como para el vendedor.*/

const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

const conversacionResolvers = {

    // Conversión del campo ID de Pregunta a String 
    Pregunta: {
        id: (doc) => String(doc._id)
    },

    // Conversión de los campos ID de Respuesta, Pregunta y del usuario a String para GraphQL
    Respuesta: {
        id: (doc) => String(doc._id), // Convierte el ID de la respuesta a String
        pregunta: (doc) => String(doc.pregunta),
        usuarioRespuesta: (doc) => String(doc.usuarioRespuesta)
    },

    Query: {

        // Obtiene las conversaciones del usuario (preguntas realizadas por él)
        obtenerMisConversaciones: async (_, __, contexto) => {
            try {

                const userId = contexto.usuario?.id; // Obtiene el Id del usuario autenticado

                // Si no hay un usuario autenticado, lanza un error
                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                // Busca las preguntas realizadas por el usuario autenticado junto a sus posibles respuestas
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

                const resultado = []; // Almacena las preguntas junto a sus posibles respuestas

                // Para cada pregunta, busca su respuesta (si existe) y se agrega al resultado
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


        // Obtiene las conversaciones relacionadas a sus vehículos. 
        obtenerConversacionesDeMisVehiculos: async (_, __, contexto) => {
            try {

                const userId = contexto.usuario?.id; // Obtiene el Id del usuario autenticado

                // Si no hay un usuario autenticado, lanza un error
                if (!userId) {
                    throw new Error("Usuario no autenticado");
                }

                //Busca los vehiculos del usuario autenticado 
                //Para obtener las preguntas relacionadas
                const misVehiculos = await Vehiculo.find({
                    usuario: userId
                }).select("_id");

                const idsVehiculos = []; // Almacena los ID de los vehículos del usuario autenticado

                // Extrae los ID de los vehículos
                for (let i = 0; i < misVehiculos.length; i++) {
                    const vehiculo = misVehiculos[i];
                    idsVehiculos.push(vehiculo._id);
                }

                // Busca las preguntas relacionadas a los vehículos del  usuario autenticado
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
                    .sort({ fechaPregunta: -1 }); // Ordena más recientes primero

                const resultado = []; // Almacena las preguntas junto a sus posibles respuestas

                // Para cada pregunta, busca su respuesta (si existe) y se agrega al resultado
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