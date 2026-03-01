const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({

    marca: {
        type: String,
        required: true
    },

    modelo: {
        type: String,
        required: true
    },

    anno: {
        type: Number,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    imagen: { 
        type: String, 
        required: true 
    },  

    // En estado, puede ser "disponible" o "vendido". Por defecto será "disponible"
    estado: {
        type: String,
        enum: ['disponible', 'vendido'],
        default: 'disponible'
    },

    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    }

},

{ timestamps: true });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);