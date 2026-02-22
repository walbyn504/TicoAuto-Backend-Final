const Vehiculo = require("../modelos/vehiculo");

const crearVehiculo = async (req, res) => {
    try {
        const vehiculo = new Vehiculo({
            marca: req.body.marca,
            modelo: req.body.modelo,
            anio: req.body.anio,
            precio: req.body.precio
        });

        // Guardar el vehículo en la BD y retornar el vehículo creado
        const vehiculoCreado = await vehiculo.save();
        res.status(201).json(vehiculoCreado);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const editarVehiculo = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const opciopnes = { new: true };
        const updatedVehiculo = await Vehiculo.findByIdAndUpdate(id, body, opciopnes);
        if (!updatedVehiculo) { 
            return res.status(404);
        }
        res.json(updatedVehiculo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
    crearVehiculo,
    editarVehiculo,
    eliminarVehiculo
};