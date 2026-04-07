const Vehiculo = require('../../modelos/vehiculo');

const marcarVendido = async (req, res) => {
    try {
        const id = req.params.id;

        // Verificar usuario autenticado
        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        // Buscar vehículo
        const vehiculo = await Vehiculo.findById(id);

        if (!vehiculo) {
            return res.status(404).json({
                message: "Vehículo no encontrado"
            });
        }

        // Verificar que el vehículo pertenezca al usuario logueado
        if (vehiculo.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({
                message: "No tiene permiso para marcar este vehículo como vendido"
            });
        }

        // Verificar si ya estaba vendido
        if (vehiculo.estado === "Vendido") {
            return res.status(400).json({
                message: "El vehículo ya está marcado como vendido"
            });
        }

        // Actualizar estado
        vehiculo.estado = "Vendido";
        await vehiculo.save();

        res.status(200).json({
            message: "Vehículo marcado como vendido",
            vehiculo
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    marcarVendido
};