const Vehiculo = require('../../modelos/Vehiculo');
const fs = require('fs'); 


const editarVehiculo = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        const imagen = req.file; // Verificar si se ha subido una nueva imagen
        if (imagen) {
            // Si el vehículo ya tiene una imagen, eliminar la imagen anterior del servidor
            const vehiculoExistente = await Vehiculo.findById(id); 
            if (vehiculoExistente && vehiculoExistente.imagen) {
                const rutaImagenAnterior = `imagenes/${vehiculoExistente.imagen}`;
                if (fs.existsSync(rutaImagenAnterior)) { 
                    fs.unlinkSync(rutaImagenAnterior); 
                }
            }
            body.imagen = req.file.filename;
        }
        const opciones = { new: true }; 
        const updatedVehiculo = await Vehiculo.findByIdAndUpdate(id, body, opciones);
        if (!updatedVehiculo) { 
            return res.status(404);
        }
        res.status(200).json(updatedVehiculo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    editarVehiculo
};