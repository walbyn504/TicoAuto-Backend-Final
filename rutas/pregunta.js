const express = require('express');
const router = express.Router();

const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const crearPregunta = require('../controladores/pregunta/crearPregunta');
const obtenerPreguntas = require('../controladores/pregunta/obtenerPreguntas');
const obtenerPreguntasVehiculos = require('../controladores/pregunta/obtenerPreguntasVehiculos');

router.post('/vehiculo/:vehiculoId/pregunta', verificarToken, crearPregunta);
router.get('/pregunta/obtenerMisPreguntas', verificarToken, obtenerPreguntas);
router.get('/obtenerPreguntasDeMisVehiculos', verificarToken, obtenerPreguntasVehiculos);

module.exports = router;