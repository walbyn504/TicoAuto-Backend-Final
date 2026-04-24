// Valida el token JWT para proteger rutas y obtiene las 
// preguntas relacionadas a los vehiculos del usuario autenticado
const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");
const Vehiculo = require("../../modelos/vehiculo");

// Obtiene las preguntas relacionadas a los vehículos del usuario autenticado, junto a sus respuestas (si existen)
const obtenerPreguntasDeMisVehiculos = async (req, res) => {
    try {
        //Busca los vehiculos del usuario autenticado 
        //Para obtener las preguntas relacionadas
        const misVehiculos = await Vehiculo.find({
            usuario: req.usuario.id
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
            .populate("usuario", "nombre primerApellido segundoApellido")
            .populate({
                path: "vehiculo",
                populate: {
                    path: "usuario",
                    select: "nombre"
                }
            })
            .sort({ fechaPregunta: -1 });

        const resultado = []; // Almacena las preguntas junto a sus posibles respuestas

        // Para cada pregunta, busca su respuesta (si existe) y se agrega al resultado
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