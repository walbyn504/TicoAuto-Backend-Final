const Vehiculo = require('../../modelos/vehiculo');

const obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id).populate('usuario');

        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        let usuarioData;

        if (req.usuario) {
            // Usuario logueado: mostrar toda la información del usuario dueño
            usuarioData = vehiculo.usuario;
        } else {
            // Usuario no logueado: mostrar solo el nombre
            usuarioData = {
                nombre: vehiculo.usuario.nombre
            };
        }

        res.status(200).json({
            ...vehiculo.toObject(),
            usuario: usuarioData
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const obtenerMisVehiculos = async (req, res) => {
    try {
        // Validar que exista usuario autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const vehiculos = await Vehiculo.find({
            usuario: req.usuario.id,
            estado: 'Disponible'
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
        // Validar que exista usuario autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const vehiculo = await Vehiculo.findById(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        // Validar que el vehículo pertenezca al usuario
        if (vehiculo.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para editar este vehículo"
            });
        }

        res.status(200).json(vehiculo);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    obtenerVehiculoPorId,
    obtenerMisVehiculos,
    obtenerVehiculoEdicion
};