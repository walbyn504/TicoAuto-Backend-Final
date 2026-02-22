const express = require('express');
const router = express.Router();

const { 
    crearVehiculo,
    editarVehiculo,
    eliminarVehiculo
 } = require("../controladores/vehiculo");



// Ruta para crear un nuevo vehículo
router.post('/vehiculo', crearVehiculo)

// Ruta para editar un vehículo existente
router.put('/vehiculo/:id', editarVehiculo)

// Ruta para eliminar un vehículo existente
router.delete('/vehiculo/:id', eliminarVehiculo)


module.exports = router;





