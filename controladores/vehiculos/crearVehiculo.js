const Vehiculo = require('../../modelos/vehiculo');

const crearVehiculo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Debe subir una imagen"
            });
        }

        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        const marca = req.body.marca?.trim();
        const modelo = req.body.modelo?.trim();
        const anno = parseInt(req.body.anno);
        const precio = parseFloat(req.body.precio);
        const combustible = req.body.combustible;
        const color = req.body.color?.trim();
        const transmision = req.body.transmision;
        const condicion = req.body.condicion;

        if (!marca || !modelo || !color || !combustible || !transmision || !condicion) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        if (isNaN(anno) || anno < 0) {
            return res.status(400).json({
                message: "El año debe ser un número válido mayor o igual a 0"
            });
        }

        if (isNaN(precio) || precio < 0) {
            return res.status(400).json({
                message: "El precio debe ser un número válido mayor o igual a 0"
            });
        }

        const combustiblesValidos = ['Gasolina', 'Disel', 'Gas'];
        const transmisionesValidas = ['Manual', 'Automatico'];
        const condicionesValidas = ['Nuevo', 'Usado'];

        if (!combustiblesValidos.includes(combustible)) {
            return res.status(400).json({
                message: "Combustible inválido"
            });
        }

        if (!transmisionesValidas.includes(transmision)) {
            return res.status(400).json({
                message: "Transmisión inválida"
            });
        }

        if (!condicionesValidas.includes(condicion)) {
            return res.status(400).json({
                message: "Condición inválida"
            });
        }

        const vehiculo = new Vehiculo({
            marca,
            modelo,
            anno,
            precio,
            imagen: req.file.filename,
            combustible,
            color,
            transmision,
            condicion,
            usuario: req.usuario.id
        });

        const vehiculoCreado = await vehiculo.save();

        res.status(201).json(vehiculoCreado);

    } catch (error) {
        console.error("ERROR CREAR VEHICULO:", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    crearVehiculo
};