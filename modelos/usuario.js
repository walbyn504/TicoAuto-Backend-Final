const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    primerApellido: {
        type: String,
        required: true  
    },

    segundoApellido: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    contrasenna: {
        type: String,
        required: true
    },

    token: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);