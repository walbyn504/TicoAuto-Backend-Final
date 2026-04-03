const express = require('express');
const router = express.Router();


const {registrarUsuario } = require('../controladores/autenticacion/registrarUsuario');
const {generarToken} = require('../controladores/autenticacion/generarToken');
const {verificarCorreo} = require('../controladores/autenticacion/verificarCorreo');
const {verificarCodigo2FA} = require('../controladores/autenticacion/verificarCodigo2FA');
  
        
// Ruta para registrar un nuevo usuario
router.post('/autenticacion', registrarUsuario);

router.post('/autenticacion/login', generarToken);

router.get('/autenticacion/verificacion', verificarCorreo);

// Verificación del código 2FA → aquí sí devuelve el JWT final
router.post('/autenticacion/codigo2FA', verificarCodigo2FA);

module.exports = router;