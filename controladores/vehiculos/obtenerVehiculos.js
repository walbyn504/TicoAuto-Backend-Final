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
        const id = req.params.id;
        const vehiculo = await Vehiculo.findById(id).populate('usuario');           
        if (!vehiculo) {
            return res.status(404);
        }           
        res.status(200).json(vehiculo);
    }catch (error) {     

        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    obtenerVehiculos, obtenerVehiculoPorId
};