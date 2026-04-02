const express = require('express');
const router = express.Router();

const { registrarUsuarioGoogle } = require('../controladores/autenticacion/registroGoogle');
const { loginGoogle } = require('../controladores/autenticacion/loginGoogle');

router.post('/google', registrarUsuarioGoogle);
router.post('/google/login', loginGoogle);

module.exports = router;