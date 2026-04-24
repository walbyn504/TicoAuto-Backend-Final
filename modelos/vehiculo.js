// Modelo para los vehículos disponibles en el sistema, con detalles como marca...
// Y referencia al usuario que publicó el vehículo.
const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true,
        trim: true
    },
    modelo: {
        type: String,
        required: true,
        trim: true
    },
    anno: {
        type: Number,
        required: true,
        min: 0
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Disponible', 'Vendido'],
        default: 'Disponible'
    },
    combustible: {
        type: String,
        enum: ['Gasolina', 'Disel', 'Gas'],
        required: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    transmision: {
        type: String,
        enum: ['Manual', 'Automatico'],
        required: true
    },
    condicion: {
        type: String,
        enum: ['Nuevo', 'Usado'],
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);