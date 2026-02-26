const express = require('express');
const router = express.Router();

const { registrarUsuario } = require('../controladores/autenticacion');

// Ruta para registrar un nuevo usuario
router.post('/autenticacion', registrarUsuario);

module.exports = router;