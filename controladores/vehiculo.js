const Vehiculo = require("../modelos/vehiculo");

const crearVehiculo = async (req, res) => {
    try {
        const vehiculo = new Vehiculo({
            marca: req.body.marca,
            modelo: req.body.modelo,
            anno: req.body.anno,
            precio: req.body.precio,
            imagen: req.file.path,
            usuario: req.usuario._id
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


const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();    
        res.status(200).json(vehiculos);
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
    crearVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    marcarVendido,
    obtenerVehiculos
};