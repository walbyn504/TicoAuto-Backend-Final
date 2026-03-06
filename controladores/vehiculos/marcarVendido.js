const Vehiculo = require('../../modelos/Vehiculo');

const marcarVendido = async (req, res) => {
    try {
        const id = req.params.id;

        // Actualiza solo el estado a "vendido"
        const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
            id,
            { estado: 'vendido' },
            { new: true } // devuelve el documento actualizado
        );

        if (!vehiculoActualizado) {
           return res.status(404);
        }

        res.status(200).json(vehiculoActualizado);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    marcarVendido
};