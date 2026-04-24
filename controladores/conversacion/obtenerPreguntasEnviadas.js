// Valida el token JWT para proteger rutas y obtiene las preguntas enviadas por el usuario autenticado
const Pregunta = require("../../modelos/pregunta");
const Respuesta = require("../../modelos/respuesta");

// Obtiene las preguntas enviadas por el usuario auetenticado, junto a sus respuestas (solo si existen)
const obtenerMisPreguntas = async (req, res) => {
    try {
        // Busca las preguntas del usuario autenticado 
        const misPreguntas = await Pregunta.find({
            usuario: req.usuario.id
        })
        .populate("usuario", "nombre") 
        .populate({
            path: "vehiculo",
            populate: {
                path: "usuario",
                select: "nombre"
            }
        })
        .sort({ fechaPregunta: -1 }); // Ordena por fecha de pregunta, de más reciente a más antigua

        const resultado = []; // Almacena las preguntas junto a sus posibles respuestas

        // Para cada pregunta, busca su respuesta (si existe) y se agrega al resultado
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

        return res.status(200).json(resultado); // Retorna las preguntas junto a sus respuestas (si existen)

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener tus preguntas",
            error: error.message
        });
    }
};

module.exports = obtenerMisPreguntas;