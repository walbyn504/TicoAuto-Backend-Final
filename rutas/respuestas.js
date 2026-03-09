const express = require('express');
const router = express.Router();


const { verificarToken } = require('../controladores/autenticacion/verificarToken');
const { crearRespuesta } = require('../controladores/respuestas/crearRespuesta');



router.post('/pregunta/:preguntaId/respuesta', verificarToken, crearRespuesta);


module.exports = router;