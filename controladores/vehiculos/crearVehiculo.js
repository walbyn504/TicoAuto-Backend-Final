const Vehiculo = require('../../modelos/Vehiculo');

const crearVehiculo = async (req, res) => {
    try {
        const vehiculo = new Vehiculo({
            marca: req.body.marca,
            modelo: req.body.modelo,
            anno: req.body.anno,
            precio: req.body.precio,
            imagen: req.file.filename,
            usuario: req.usuario._id
        });

        // Guardar el vehículo en la BD y retornar el vehículo creado
        const vehiculoCreado = await vehiculo.save();
        res.status(201).json(vehiculoCreado);
        

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    crearVehiculo
};