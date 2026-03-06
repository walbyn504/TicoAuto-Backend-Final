const Vehiculo = require('../../modelos/Vehiculo');

const filtroVehiculos = async (req, res) => {
  try {
    const { marca, modelo, año_min, año_max, precio_min, precio_max, estado } = req.query;
    const filtro = {};

    if (marca) {
        filtro.marca = marca;       
    } 
    if (modelo) {
        filtro.modelo = modelo;
    }
    if (año_min || año_max) {
        filtro.año = {};                    
        if (año_min) filtro.año.$gte = parseInt(año_min); 
        if (año_max) filtro.año.$lte = parseInt(año_max);
    }
    if (precio_min || precio_max) {
        filtro.precio = {};
        if (precio_min) filtro.precio.$gte = parseInt(precio_min);
        if (precio_max) filtro.precio.$lte = parseInt(precio_max);
    }
    if (estado) {
        filtro.estado = estado;
    }

    const vehiculos = await Vehiculo.find(filtro);
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar vehículos", error: error.message });
  }
};

module.exports = filtroVehiculos; 