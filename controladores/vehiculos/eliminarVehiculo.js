const Vehiculo = require('../../modelos/Vehiculo');

const eliminarVehiculo = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedVehiculo = await Vehiculo.findByIdAndDelete(id);
        if (!deletedVehiculo) {
            return res.status(404);
        }
        res.status(200).json(deletedVehiculo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    eliminarVehiculo
};