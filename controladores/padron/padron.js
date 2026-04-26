
// Maneja la lógica para consultar datos de una cédula en el padrón
const { consultarCedula } = require('../../servicios/padronServicio');

// Valida el formato de la cédula
const obtenerDatosCedula = async (req, res) => {
    const { cedula } = req.params; // Obtiene la cédula de los parámetros de la ruta

    try {
        // Valida que la cédula tenga el formato correcto
        if (!/^\d{9}$/.test(cedula)) {
            return res.status(400).json({
                message: "Cédula inválida"
            });
        }

        const persona = await consultarCedula(cedula); // Consulta la cédula en el padrón

        // Si la cédula no existe, devuelve mensaje de error
        if (!persona) {
            return res.status(404).json({
                message: "No encontrada en el padrón"
            });
        }

        return res.status(200).json(persona); // Devuelve los datos de la persona asociada a la cédula

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    obtenerDatosCedula
};