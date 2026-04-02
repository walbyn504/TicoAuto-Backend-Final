const express = require('express');
const router = express.Router();


const {registrarUsuario } = require('../controladores/autenticacion/registrarUsuario');
const {generarToken} = require('../controladores/autenticacion/generarToken');
const {verificarCorreo} = require('../controladores/autenticacion/verificarCorreo');
  
        
// Ruta para registrar un nuevo usuario
router.post('/autenticacion', registrarUsuario);

router.post('/autenticacion/login', generarToken);

router.get('/autenticacion/verificacion', verificarCorreo);

module.exports = router;