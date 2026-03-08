const usuario = require('../../modelos/usuario');
const Vehiculo = require('../../modelos/vehiculo');


const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id).populate('usuario');

        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        let usuarioData;

        if (req.usuario) {
            // Usuario logueado → mostramos toda la info
            usuarioData = vehiculo.usuario;
        } else {
            // Usuario NO logueado → solo nombre
            usuarioData = {
                nombre: vehiculo.usuario.nombre
            };
        }

        res.json({
            ...vehiculo.toObject(),
            usuario: usuarioData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const obtenerMisVehiculos = async (req, res) => {
    try {

        const vehiculos = await Vehiculo.find({
            usuario: req.usuario.id
        });

        res.status(200).json(vehiculos);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const obtenerVehiculoEdicion = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        res.status(200).json(vehiculo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
    

module.exports = {
    obtenerVehiculos, obtenerVehiculoPorId, obtenerMisVehiculos, obtenerVehiculoEdicion
};