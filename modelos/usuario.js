const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({

    cedula: {
        type: String,
        required: true,
        unique: true
    },
    
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

    telefono: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    contrasenna: {
        type: String,
        default: null
    },

    googleId: {
        type: String,
        default: null
    },

    proveedor: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },

    estado: {
        type: String,
        enum: ['pendiente', 'activo'],
        default: 'pendiente'
    },

    tokenVerificacion: {
        type: String,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);