// Modelo de Mongoose para las preguntas realizadas sobre vehículos.
// Define la estructura de una pregunta, incluyendo el vehículo, el usuario que hizo la pregunta
const mongoose = require("mongoose");

const preguntaSchema = new mongoose.Schema({
    vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehiculo",
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    pregunta: {
        type: String,
        required: true
    },
    fechaPregunta: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Pregunta", preguntaSchema);