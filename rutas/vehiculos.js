const express = require('express');
const router = express.Router();
const multer = require('multer');


const { verificarToken, verificarTokenOpcional } 
       = require('../controladores/autenticacion/verificarToken');


const { crearVehiculo } = require('../controladores/vehiculos/crearVehiculo');
const { editarVehiculo } = require('../controladores/vehiculos/editarVehiculo');
const {  obtenerVehiculoPorId,obtenerMisVehiculos,obtenerVehiculoEdicion} 
        = require('../controladores/vehiculos/obtenerVehiculos');

const { eliminarVehiculo } = require('../controladores/vehiculos/eliminarVehiculo');
const { marcarVendido } = require("../controladores/vehiculos/marcarVendido");
const { filtroVehiculos } = require('../controladores/vehiculos/filtroVehiculos');


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

// Obtener un vehículo por ID
router.get('/vehiculo/:id', verificarTokenOpcional, obtenerVehiculoPorId);

// Gestion de mis vehículos
router.get('/mis-vehiculos', verificarToken, obtenerMisVehiculos);

// Obtener un vehículo para edición
router.get('/vehiculo/edicion/:id', verificarToken, obtenerVehiculoEdicion);

// Eliminar un vehículo existente
router.delete('/vehiculo/:id', verificarToken, eliminarVehiculo);

// Cambiar estado del vehículo a vendido
router.patch('/vehiculo/vendido/:id', verificarToken, marcarVendido);

// Filtro de vehículos 
router.get('/vehiculos/filtro', filtroVehiculos);

module.exports = router;
