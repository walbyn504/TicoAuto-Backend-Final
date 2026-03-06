const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { marcarVendido } = require("../controladores/vehiculos/marcarVendido");
const { verificarToken } = require('../controladores/autenticacion');
const { crearVehiculo } = require('../controladores/vehiculos/crearVehiculo');
const { editarVehiculo } = require('../controladores/vehiculos/editarVehiculo');
const { obtenerVehiculos, obtenerVehiculoPorId } = require('../controladores/vehiculos/obtenerVehiculos');
const { eliminarVehiculo } = require('../controladores/vehiculos/eliminarVehiculo');
const filtroVehiculos = require('../controladores/vehiculos/filtroVehiculos');


// Configuración de Multer para manejar la subida de imágenes
const storage = multer.diskStorage({
    // Guardar las imágenes en la carpeta "imagenes"
    destination: (req, file, cb) => cb(null, 'imagenes/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Crear un nuevo vehículo
router.post('/vehiculo', verificarToken, upload.single('imagen'), crearVehiculo);

// Editar un vehículo existente
router.put('/vehiculo/:id', verificarToken, upload.single('imagen'), editarVehiculo);

// Obtener todos los vehículos
router.get('/vehiculos', obtenerVehiculos);

// Obtener un vehículo por ID
router.get('/vehiculo/:id', verificarToken, obtenerVehiculoPorId);

// Eliminar un vehículo existente
router.delete('/vehiculo/:id', verificarToken, eliminarVehiculo);

// Cambiar estado del vehículo a vendido
router.patch('/vehiculo/vendido/:id', verificarToken, marcarVendido);

// Filtro de vehículos 
router.get('/vehiculos/filtro', filtroVehiculos);

module.exports = router;
