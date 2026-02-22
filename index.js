const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");


mongoose.connect('mongodb://127.0.0.1:27017/ticoAuto');

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Conexión a la BD exitosa');
});

const app = express();

//middleswares
app.use(bodyParser.json());
app.use(cors({
    domains:'*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));



app.listen(3001, () => {
    console.log("Servidor corriendo en puerto 3001");
});