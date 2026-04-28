require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");

// Creación del servidor
const app = express();

// Middlewares
app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));

// Ruta para acceder a las imágenes
app.use('/imagenes', express.static('imagenes'));

// Rutas REST
app.use('/api', require('./rutas/vehiculos'));
app.use('/api', require('./rutas/autenticacion'));
app.use('/api', require('./rutas/pregunta'));
app.use('/api', require('./rutas/respuestas'));
app.use('/api', require('./rutas/padron'));

async function iniciarServidor() {
    try {
        // Conexión a la BD
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a la BD exitosa');

        // Inicialización del servidor REST
        app.listen(process.env.PORT, () => {
            console.log(`Servidor REST corriendo en puerto ${process.env.PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

iniciarServidor();