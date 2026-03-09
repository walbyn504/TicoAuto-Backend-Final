const express = require('express');
const router = express.Router();

const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const crearPregunta = require('../controladores/pregunta/crearPregunta');
const obtenerPreguntas = require('../controladores/pregunta/obtenerPreguntas')

router.post('/pregunta/crearPregunta', verificarToken, crearPregunta);

router.get('/pregunta/obtenerMisPreguntas', verificarToken, obtenerPreguntas);
module.exports = router;