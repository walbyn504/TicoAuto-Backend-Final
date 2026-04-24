// Validar que el usuario autenticado sea el dueño del vehcículo antes de eliminarlo
const Vehiculo = require('../../modelos/vehiculo');
const fs = require('fs');

const eliminarVehiculo = async (req, res) => {
    try {
        // Obtener el id del vehículo desde los parámetros de la URL
        const id = req.params.id;

        // Verificar que el usuario esté autenticado
        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const vehiculo = await Vehiculo.findById(id); // Busca el vehículo por su ID 

        // Si no encuentra el vehículo, devuelve mensaje de error
        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        // Verificar que el usuario autenticado sea el dueño del vehículo
        if (vehiculo.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para eliminar este vehículo"
            });
        }

        // Guardar la ruta de la imagen asociada al vehículo (si existe)
        const rutaImagen = vehiculo.imagen ? `imagenes/${vehiculo.imagen}` : null;

        await Vehiculo.findByIdAndDelete(id);

        //Eliminar imagen tambien
        if (rutaImagen && fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
        }

        res.status(200).json({
            message: "Vehículo eliminado correctamente"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    eliminarVehiculo
};