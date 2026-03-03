const express = require('express');
const router = express.Router();

const { registrarUsuario, 
        generarToken } = require('../controladores/autenticacion');
  
        
// Ruta para registrar un nuevo usuario
router.post('/autenticacion', registrarUsuario);

router.post('/autenticacion/login', generarToken);

module.exports = router;