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