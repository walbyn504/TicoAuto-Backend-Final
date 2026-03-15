const express = require('express');
const router = express.Router();

const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const crearPregunta = require('../controladores/pregunta/crearPregunta');


router.post('/vehiculo/:vehiculoId/pregunta', verificarToken, crearPregunta);


module.exports = router;