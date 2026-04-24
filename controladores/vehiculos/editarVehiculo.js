// Valida y actualiza un vehículo existente.
// Solo el dueño del vehículo puede editarlo, y se validan los campos de entrada
const Vehiculo = require('../../modelos/vehiculo');
const fs = require('fs');

const editarVehiculo = async (req, res) => {
    try {
        const id = req.params.id; // Obtiene el ID del vehcículo de la solicitud

        // Verifica que el usuario esté autenticado
        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const vehiculoExistente = await Vehiculo.findById(id); // Busca el vehículo por su ID

        // Si no encuentra el vehcículo, devuelve mensaje de error
        if (!vehiculoExistente) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        // Verifica que solo el dueño pueda editar
        if (vehiculoExistente.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para editar este vehículo"
            });
        }

        // Si pasa todas las validaciones, crea el vehículo
        const marca = req.body.marca?.trim();
        const modelo = req.body.modelo?.trim();
        const anno = parseInt(req.body.anno);
        const precio = parseFloat(req.body.precio);
        const combustible = req.body.combustible;
        const color = req.body.color?.trim();
        const transmision = req.body.transmision;
        const condicion = req.body.condicion;

        // Valida que el usuario esté autenticado
        if (!marca || !modelo || !color || !combustible || !transmision || !condicion) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        // Valida que el año y el precio sean números vçalidos
        if (isNaN(anno) || anno < 0) {
            return res.status(400).json({
                message: "El año debe ser un número válido mayor o igual a 0"
            });
        }

        // Valida que el precio sea un número válido
        if (isNaN(precio) || precio < 0) {
            return res.status(400).json({
                message: "El precio debe ser un número válido mayor o igual a 0"
            });
        }

        // Valida que el combustible, la transmisión y la condición sean valores válidos
        const combustiblesValidos = ['Gasolina', 'Disel', 'Gas'];
        const transmisionesValidas = ['Manual', 'Automatico'];
        const condicionesValidas = ['Nuevo', 'Usado'];

        if (!combustiblesValidos.includes(combustible)) {
            return res.status(400).json({
                message: "Combustible inválido"
            });
        }

        if (!transmisionesValidas.includes(transmision)) {
            return res.status(400).json({
                message: "Transmisión inválida"
            });
        }

        if (!condicionesValidas.includes(condicion)) {
            return res.status(400).json({
                message: "Condición inválida"
            });
        }

        const body = { marca, modelo, anno, precio, combustible, color, transmision, condicion };

        // Si sube imagen nueva, borrar la anterior
        if (req.file) {
            if (vehiculoExistente.imagen) {
                const rutaImagenAnterior = `imagenes/${vehiculoExistente.imagen}`;

                if (fs.existsSync(rutaImagenAnterior)) {
                    fs.unlinkSync(rutaImagenAnterior);
                }
            }

            body.imagen = req.file.filename; // Actualiza la imagen
        }

        const opciones = { new: true, runValidators: true }; //Valida que se cumpla las reglas del modelo

        // Actualiza el vehículo
        const updatedVehiculo = await Vehiculo.findByIdAndUpdate(
            id, body, opciones
        );

        // Si no encuentra el vehículo; devuelve mensaje de error
        if (!updatedVehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        res.status(200).json(updatedVehiculo);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    editarVehiculo
};