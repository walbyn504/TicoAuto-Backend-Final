const express = require('express');
const router = express.Router();
const { obtenerDatosCedula } = require('../controladores/padron/padron');

// Obtener los datos de una cédula desde el padrón nacional
router.get('/padron/:cedula', obtenerDatosCedula);

module.exports = router;