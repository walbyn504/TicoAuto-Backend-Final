const express = require('express');
const router = express.Router();

const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const obtenerPreguntasEnviadas = require('../controladores/conversacion/obtenerPreguntasEnviadas');
const obtenerPreguntasVehiculos = require('../controladores/conversacion/obtenerPreguntasVehiculos');

//Obtiene las preguntas enviadas por el usuario autenticado
router.get('/preguntas/enviadas', verificarToken, obtenerPreguntasEnviadas);

// Obtiene las preguntas recibidas en los vehículos del usuario autenticado
router.get('/preguntas/recibidas', verificarToken, obtenerPreguntasVehiculos);

module.exports = router;