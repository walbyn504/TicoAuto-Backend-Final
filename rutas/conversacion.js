const express = require('express');
const router = express.Router();

const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const obtenerPreguntasEnviadas = require('../controladores/conversacion/obtenerPreguntasEnviadas');
const obtenerPreguntasVehiculos = require('../controladores/conversacion/obtenerPreguntasVehiculos');

router.get('/preguntas/enviadas', verificarToken, obtenerPreguntasEnviadas);

router.get('/preguntas/recibidas', verificarToken, obtenerPreguntasVehiculos);


module.exports = router;